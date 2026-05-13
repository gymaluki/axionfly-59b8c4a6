import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cakto-signature, x-signature',
};

// Webhook da Cakto — Plano TRIMESTRAL (90 dias de acesso)
// Configure a URL no painel da Cakto:
// https://<PROJECT_REF>.functions.supabase.co/cakto-quarterly-webhook?token=<CAKTO_WEBHOOK_TOKEN>
//
// Ao receber confirmação de pagamento, libera acesso por 90 dias (expires_at = now + 90d).
// Em renovação, soma mais 90 dias a partir da data atual de expiração (se ainda futura)
// ou a partir de agora (se já expirou).
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

    if (CAKTO_WEBHOOK_TOKEN) {
      const url = new URL(req.url);
      const token = url.searchParams.get("token");
      if (token !== CAKTO_WEBHOOK_TOKEN) {
        console.warn("Cakto quarterly webhook: token inválido");
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      console.log("Cakto quarterly webhook: rodando sem validação de token");
    }

    const raw = await req.text();
    let body: any = {};
    try {
      body = JSON.parse(raw);
    } catch {
      console.error("Cakto quarterly webhook: payload não é JSON válido", raw);
    }

    console.log("Cakto quarterly webhook recebido:", JSON.stringify(body));

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

    if (!email) {
      console.error("Cakto quarterly webhook: email do cliente ausente", body);
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

    if (!subscriptionStatus) {
      console.log(`Cakto quarterly: status não acionável (status=${status}, event=${event}). Ignorando.`);
      return new Response(JSON.stringify({ ok: true, ignored: true, status, event }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Localiza usuário pelo email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) throw userError;

    const user = userData.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    // Sem cadastro ainda → salva como pending_payment com 90 dias de validade
    if (!user) {
      console.log(`Cakto quarterly: usuário ainda não cadastrado (${email}). Salvando pending_payment.`);

      if (subscriptionStatus === "active") {
        const expiresAt = new Date(Date.now() + NINETY_DAYS_MS).toISOString();
        const { error: pendingError } = await supabase
          .from("pending_payments")
          .upsert(
            {
              email: email.toLowerCase(),
              status: "active",
              payment_provider: "cakto",
              transaction_id: String(transactionId || ""),
              plan: "quarterly",
              expires_at: expiresAt,
            },
            { onConflict: "email" }
          );
        if (pendingError) console.error("Erro ao salvar pending_payment trimestral:", pendingError);
      }

      return new Response(
        JSON.stringify({ ok: true, message: "Pagamento trimestral salvo para liberar no cadastro" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calcula nova data de expiração (acumula em renovação)
    let newExpiresAt: string | null = null;
    if (subscriptionStatus === "active") {
      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("expires_at")
        .eq("user_id", user.id)
        .maybeSingle();

      const currentExpiry = existingSub?.expires_at ? new Date(existingSub.expires_at).getTime() : 0;
      const base = currentExpiry > Date.now() ? currentExpiry : Date.now();
      newExpiresAt = new Date(base + NINETY_DAYS_MS).toISOString();
    }

    const { error: subError } = await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          status: subscriptionStatus,
          payment_provider: "cakto",
          transaction_id: String(transactionId || ""),
          plan: "quarterly",
          expires_at: newExpiresAt,
        },
        { onConflict: "user_id" }
      );

    if (subError) throw subError;

    console.log(`Cakto quarterly: assinatura ${subscriptionStatus} para ${email} (expira em ${newExpiresAt})`);

    return new Response(
      JSON.stringify({ success: true, status: subscriptionStatus, plan: "quarterly", expires_at: newExpiresAt }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Cakto quarterly webhook error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
