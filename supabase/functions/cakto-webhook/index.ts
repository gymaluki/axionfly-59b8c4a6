import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cakto-signature, x-signature',
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const CAKTO_WEBHOOK_TOKEN = Deno.env.get("CAKTO_WEBHOOK_TOKEN");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    // Validação de token é OPCIONAL — só valida se o secret estiver configurado.
    // Se não estiver, aceita a requisição (a Cakto chama direto sem assinatura).
    if (CAKTO_WEBHOOK_TOKEN) {
      const url = new URL(req.url);
      const token = url.searchParams.get("token");
      if (token !== CAKTO_WEBHOOK_TOKEN) {
        console.warn("Cakto webhook: token inválido");
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      console.log("Cakto webhook: rodando sem validação de token (CAKTO_WEBHOOK_TOKEN não configurado)");
    }

    const raw = await req.text();
    let body: any = {};
    try {
      body = JSON.parse(raw);
    } catch {
      console.error("Cakto webhook: payload não é JSON válido", raw);
    }

    console.log("Cakto webhook recebido:", JSON.stringify(body));

    const data = body?.data ?? body;
    const event: string = (body?.event || body?.type || data?.event || "").toString().toLowerCase();

    const email: string | undefined =
      data?.customer?.email ||
      data?.client?.email ||
      data?.buyer?.email ||
      data?.email ||
      body?.email;

    const status: string = (
      data?.status ||
      data?.payment_status ||
      data?.order_status ||
      body?.status ||
      event ||
      ""
    ).toString().toLowerCase();

    const transactionId: string =
      data?.transaction_id ||
      data?.order_id ||
      data?.id ||
      body?.id ||
      "";

    const productName: string =
      data?.product?.name ||
      data?.product_name ||
      data?.offer?.name ||
      data?.plan ||
      body?.plan ||
      "default";

    const amount: number = parseFloat(data?.amount || data?.total_amount || data?.price || body?.amount || "0");
    const paymentMethod: string = (data?.payment_method || data?.method || body?.method || "").toString().toLowerCase();
    
    // Captura o afiliado — a Cakto pode enviar no campo affiliate_id ou via parâmetro custom
    const affiliateCode: string | null = 
      data?.affiliate_id || 
      data?.affiliate?.id || 
      data?.affiliate?.code || 
      data?.affiliate?.slug ||
      null;

    const productLower = productName.toString().toLowerCase();
    const isLifetime = /(vital|lifetime|único|unico|para sempre)/.test(productLower);
    const plan = isLifetime ? "lifetime" : "monthly";

    if (!email) {
      console.error("Cakto webhook: email do cliente ausente", body);
      return new Response(JSON.stringify({ error: "Missing customer email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const activeStatuses = [
      "approved", "paid", "completed", "complete",
      "purchase_approved", "purchase_complete", "order_paid",
      "subscription_created", "subscription_started", "subscription_renewed",
      "active",
    ];
    const inactiveStatuses = [
      "refunded", "refund", "chargeback", "chargedback",
      "canceled", "cancelled", "subscription_canceled", "subscription_cancelled",
      "expired", "subscription_expired",
      "purchase_refunded", "purchase_chargeback",
    ];

    let subscriptionStatus: string | null = null;
    if (activeStatuses.some((s) => status.includes(s) || event.includes(s))) {
      subscriptionStatus = "active";
    } else if (inactiveStatuses.some((s) => status.includes(s) || event.includes(s))) {
      subscriptionStatus = "inactive";
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Mapeia o código de afiliado da Cakto para o nosso slug interno se necessário
    // Se o código for Lghn3ieU ou LEGLH5Bd (códigos do Matheus na Cakto), salvamos como 'z'
    let affiliateSlug: string | null = null;
    if (affiliateCode) {
      if (["Lghn3ieU", "LEGLH5Bd"].includes(affiliateCode)) {
        affiliateSlug = "m";
      } else if (["A73MAj5S", "KzuwSFCx"].includes(affiliateCode)) {
        affiliateSlug = "u";
      } else if (["ZsdtBDJP", "TSVMgq3q"].includes(affiliateCode)) {
        affiliateSlug = "o";
      } else if (["jbK39AUb", "QmFRRS9a"].includes(affiliateCode)) {
        affiliateSlug = "y";
      } else {
        affiliateSlug = affiliateCode.toLowerCase();
      }
    }

    // Valida se o slug existe na tabela affiliates — senão, salva como null pra não quebrar a FK
    if (affiliateSlug) {
      const { data: affExists } = await supabase
        .from("affiliates")
        .select("slug")
        .eq("slug", affiliateSlug)
        .maybeSingle();
      if (!affExists) {
        console.warn(`Afiliado '${affiliateSlug}' (código Cakto: ${affiliateCode}) não cadastrado. Salvando sem afiliado.`);
        affiliateSlug = null;
      }
    }

    // Registra a venda na tabela platform_sales para o Dashboard
    if (transactionId) {
      const { error: saleError } = await supabase
        .from("platform_sales")
        .upsert(
          {
            transaction_id: String(transactionId),
            email: email.toLowerCase(),
            amount,
            status: subscriptionStatus === "active" ? "paid" : status,
            payment_method: paymentMethod || "unknown",
            plan,
            affiliate_slug: affiliateSlug,
            payload: body,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "transaction_id" }
        );
      
      if (saleError) console.error("Erro ao registrar venda:", saleError);
    }

    if (!subscriptionStatus) {
      console.log(`Cakto: status não acionável (${status}). Venda registrada.`);
      return new Response(JSON.stringify({ ok: true, registered: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailLower = email.toLowerCase();
    let user: { id: string; email?: string | null } | undefined;
    for (let page = 1; page <= 50; page++) {
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
      if (userError) throw userError;
      user = userData.users.find((u) => u.email?.toLowerCase() === emailLower);
      if (user) break;
      if (!userData.users.length || userData.users.length < 1000) break;
    }

    if (!user) {
      if (subscriptionStatus === "active") {
        await supabase
          .from("pending_payments")
          .upsert(
            {
              email: email.toLowerCase(),
              status: "active",
              payment_provider: "cakto",
              transaction_id: String(transactionId || ""),
              plan,
              affiliate_slug: affiliateSlug,
            },
            { onConflict: "email" }
          );
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
    }

    const { data: prevSub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();
    const wasActive = prevSub?.status === "active";

    await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          status: subscriptionStatus,
          payment_provider: "cakto",
          transaction_id: String(transactionId || ""),
          plan,
          affiliate_slug: affiliateSlug,
        },
        { onConflict: "user_id" }
      );

    if (subscriptionStatus === "active" && !wasActive) {
      await supabase.rpc("decrement_vaga");
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Cakto error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: corsHeaders });
  }
});