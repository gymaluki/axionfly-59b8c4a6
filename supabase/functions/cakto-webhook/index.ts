import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cakto-signature, x-signature',
};

// Webhook da Cakto
// Configure a URL no painel da Cakto:
// https://<PROJECT_REF>.functions.supabase.co/cakto-webhook?token=<CAKTO_WEBHOOK_TOKEN>
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

    // Validação opcional via token na query string
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
    }

    const raw = await req.text();
    let body: any = {};
    try {
      body = JSON.parse(raw);
    } catch {
      console.error("Cakto webhook: payload não é JSON válido", raw);
    }

    console.log("Cakto webhook recebido:", JSON.stringify(body));

    // Cakto envia campos variados; cobrimos os principais formatos
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

    // Detecta plano (mensal x lifetime/vitalício) pelo nome do produto
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

    // Mapeamento de status
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

    if (!subscriptionStatus) {
      console.log(`Cakto: status não acionável (status=${status}, event=${event}). Ignorando.`);
      return new Response(JSON.stringify({ ok: true, ignored: true, status, event }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Localiza usuário pelo email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) throw userError;

    const user = userData.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    // Se ainda não tem conta, salva como pending_payment para liberar no cadastro
    if (!user) {
      console.log(`Cakto: usuário ainda não cadastrado (${email}). Salvando pending_payment.`);

      if (subscriptionStatus === "active") {
        const { error: pendingError } = await supabase
          .from("pending_payments")
          .upsert(
            {
              email: email.toLowerCase(),
              status: "active",
              payment_provider: "cakto",
              transaction_id: String(transactionId || ""),
              plan,
            },
            { onConflict: "email" }
          );
        if (pendingError) console.error("Erro ao salvar pending_payment:", pendingError);
      }

      return new Response(
        JSON.stringify({ ok: true, message: "Pagamento salvo para liberar no cadastro" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Atualiza assinatura do usuário existente
    const { error: subError } = await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          status: subscriptionStatus,
          payment_provider: "cakto",
          transaction_id: String(transactionId || ""),
          plan,
        },
        { onConflict: "user_id" }
      );

    if (subError) throw subError;

    console.log(`Cakto: assinatura ${subscriptionStatus} para ${email} (plano=${plan})`);

    return new Response(
      JSON.stringify({ success: true, status: subscriptionStatus, plan }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Cakto webhook error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
