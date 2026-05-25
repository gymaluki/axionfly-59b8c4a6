import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-webhook-token, x-perfectpay-signature, x-signature, secret',
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const PERFECTPAY_WEBHOOK_TOKEN = Deno.env.get("PERFECTPAY_LIFETIME_WEBHOOK_TOKEN") || Deno.env.get("PERFECTPAY_WEBHOOK_TOKEN");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    // Validação obrigatória do token
    if (!PERFECTPAY_WEBHOOK_TOKEN) {
      console.error("Perfect Pay LIFETIME webhook: token não configurado");
      return new Response(JSON.stringify({ error: "Webhook token not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const normalizeValue = (value: unknown): string =>
      value === null || value === undefined ? "" : String(value).trim().toLowerCase();
    const raw = await req.text();
    let body: any = {};
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      console.error("Perfect Pay LIFETIME webhook: payload não é JSON válido", raw);
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const token =
      req.headers.get("x-webhook-token") ||
      req.headers.get("x-perfectpay-signature") ||
      req.headers.get("x-signature") ||
      req.headers.get("secret") ||
      body?.secret ||
      url.searchParams.get("token") ||
      url.searchParams.get("secret");
    if (token !== PERFECTPAY_WEBHOOK_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.log("Perfect Pay LIFETIME webhook received:", JSON.stringify(body));

    // Encaminhar para UTMify (Weenbook)
    try {
      const utmifyUrl = "https://api.utmify.com.br/webhooks/perfectpay?id=69d5befe705c5afce3bad2a8";
      const UTMIFY_API_TOKEN = Deno.env.get("UTMIFY_API_TOKEN");
      const utmifyHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (UTMIFY_API_TOKEN) {
        utmifyHeaders["x-api-token"] = UTMIFY_API_TOKEN;
      }
      const utmifyRes = await fetch(utmifyUrl, {
        method: "POST",
        headers: utmifyHeaders,
        body: JSON.stringify(body),
      });
      console.log("UTMify forward status:", utmifyRes.status);
      const utmifyBody = await utmifyRes.text();
      console.log("UTMify response:", utmifyBody);
    } catch (utmifyErr) {
      console.error("Erro ao encaminhar para UTMify:", utmifyErr);
    }

    const email = body?.customer?.email || body?.customer_email || body?.email;
    const status = body?.sale_status_enum || body?.sale_status || body?.status;
    const transactionId = body?.sale_id || body?.transaction_id || body?.code || body?.id;
    const normalizedEmail = normalizeValue(email);
    const normalizedTransactionId = normalizeValue(transactionId);

    if (!normalizedEmail) {
      return new Response(JSON.stringify({ error: "Missing customer email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const statusLower = (status || "").toLowerCase();
    console.log(`LIFETIME event: status=${statusLower}, email=${email}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find user by email (paginated — listUsers default returns only 50)
    const emailLower = normalizedEmail;
    let user: { id: string; email?: string | null } | undefined;
    for (let page = 1; page <= 50; page++) {
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
      if (userError) throw userError;
      user = userData.users.find((u) => u.email?.toLowerCase() === emailLower);
      if (user) break;
      if (!userData.users.length || userData.users.length < 1000) break;
    }

    if (!user) {
      console.log(`User not found for email: ${email}. Saving as pending payment (lifetime).`);

      // Salvar pagamento pendente para ativar quando o usuário se cadastrar
      const statusLowerPending = (statusLower || "").toLowerCase();
      const activeStatusesPending = ["approved", "completed", "paid", "active"];

      if (activeStatusesPending.includes(statusLowerPending)) {
        const { error: pendingError } = await supabase
          .from("pending_payments")
          .upsert(
            {
               email: emailLower,
              status: "active",
              payment_provider: "perfectpay",
               transaction_id: normalizedTransactionId,
              plan: "vitalicio",
            },
            { onConflict: "email" }
          );

        if (pendingError) {
          console.error("Error saving pending payment:", pendingError);
        }
      }

      return new Response(
        JSON.stringify({ message: "User not found yet, payment saved for activation on register" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Plano vitalício:
    // - approved / completed / paid → acesso PERMANENTE (active)
    // - chargeback / refunded → acesso removido (inactive)
    // Cancelamento NÃO se aplica ao vitalício — uma vez aprovado, é para sempre
    // Apenas chargeback ou reembolso removem o acesso

    const activeStatuses = [
      "approved",
      "completed",
      "paid",
    ];

    const inactiveStatuses = [
      "chargeback",
      "chargedback",
      "charge_back",
      "refunded",
    ];

    let subscriptionStatus: string;

    if (activeStatuses.includes(statusLower)) {
      subscriptionStatus = "active";
    } else if (inactiveStatuses.includes(statusLower)) {
      subscriptionStatus = "inactive";
    } else {
      // Para vitalício, eventos como canceled/expired não removem acesso
      // Apenas logamos e ignoramos
      console.log(`Lifetime plan: ignoring event "${statusLower}" — no action needed`);
      return new Response(
        JSON.stringify({ success: true, message: `Event "${statusLower}" ignored for lifetime plan` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verifica se a assinatura já estava ativa antes (para não decrementar vaga duplicado)
    const { data: prevSub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();
    const wasActive = prevSub?.status === "active";

    // Upsert subscription
    const { error: subError } = await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          status: subscriptionStatus,
          payment_provider: "perfectpay",
          transaction_id: normalizedTransactionId,
          plan: "vitalicio",
        },
        { onConflict: "user_id" }
      );

    if (subError) throw subError;

    // Decrementa vaga restante se virou ativo agora
    if (subscriptionStatus === "active" && !wasActive) {
      const { error: vagaError } = await supabase.rpc("decrement_vaga");
      if (vagaError) console.error("Erro decrementando vaga:", vagaError);
    }

    console.log(`LIFETIME subscription ${subscriptionStatus} for user ${email} (event: ${statusLower})`);

    return new Response(
      JSON.stringify({ success: true, status: subscriptionStatus, plan: "vitalicio" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Lifetime webhook error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
