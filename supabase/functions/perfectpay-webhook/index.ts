import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-webhook-token',
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const PERFECTPAY_WEBHOOK_TOKEN = Deno.env.get("PERFECTPAY_MONTHLY_WEBHOOK_TOKEN") || Deno.env.get("PERFECTPAY_WEBHOOK_TOKEN");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    // Validação obrigatória do token
    if (!PERFECTPAY_WEBHOOK_TOKEN) {
      console.error("Perfect Pay webhook: token não configurado");
      return new Response(JSON.stringify({ error: "Webhook token not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = req.headers.get("x-webhook-token");
    if (token !== PERFECTPAY_WEBHOOK_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    console.log("Perfect Pay webhook received:", JSON.stringify(body));

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

    const email = body?.customer?.email || body?.email;
    const status = body?.sale_status_enum || body?.status;
    const transactionId = body?.sale_id || body?.transaction_id || body?.id;
    const plan = body?.product?.name || body?.plan || "default";

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing customer email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Event: status=${status}, email=${email}, plan=${plan}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find user by email (paginated — listUsers default returns only 50)
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
      console.log(`User not found for email: ${email}. Saving as pending payment.`);

      // Salvar pagamento pendente para ativar quando o usuário se cadastrar
      const statusLowerPending = (status || "").toLowerCase();
      const activeStatusesPending = ["approved", "completed", "paid", "subscription_started", "subscription_renewed"];

      if (activeStatusesPending.includes(statusLowerPending)) {
        const { error: pendingError } = await supabase
          .from("pending_payments")
          .upsert(
            {
              email: email.toLowerCase(),
              status: "active",
              payment_provider: "perfectpay",
              transaction_id: String(transactionId || ""),
              plan: plan || "default",
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

    // Map Perfect Pay events to subscription status
    // Eventos do plano mensal:
    // - approved / completed / paid → ativo (aprovado)
    // - subscription_started → ativo (assinatura iniciada)
    // - subscription_renewed → ativo (assinatura renovada)
    // - chargeback → inativo (charge back)
    // - subscription_canceled / canceled → inativo (assinatura cancelada)
    // - subscription_expired / expired → inativo (assinatura expirada)
    // - refunded → inativo (reembolsado)

    const statusLower = (status || "").toLowerCase();

    const activeStatuses = [
      "approved",
      "completed",
      "paid",
      "subscription_started",
      "subscription_renewed",
    ];

    const inactiveStatuses = [
      "chargeback",
      "chargedback",
      "charge_back",
      "canceled",
      "cancelled",
      "subscription_canceled",
      "subscription_cancelled",
      "subscription_expired",
      "expired",
      "refunded",
    ];

    let subscriptionStatus: string | null;

    if (activeStatuses.includes(statusLower)) {
      subscriptionStatus = "active";
    } else if (inactiveStatuses.includes(statusLower)) {
      subscriptionStatus = "inactive";
    } else {
      // FIX: status desconhecido (ex: "pending", "waiting_payment") NÃO deve
      // desativar nada — apenas ignora. Antes caía em "inactive" e derrubava
      // o acesso quando chegava um PIX gerado mas não pago.
      console.log(`Perfect Pay: status desconhecido (${statusLower}) — ignorando.`);
      return new Response(
        JSON.stringify({ ok: true, ignored: true, status: statusLower }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verifica se já estava ativo antes (para não decrementar vaga duplicado)
    const { data: prevSub } = await supabase
      .from("subscriptions")
      .select("status, transaction_id")
      .eq("user_id", user.id)
      .maybeSingle();
    const wasActive = prevSub?.status === "active";

    // FIX PIX: se chega "expired/cancelled" de uma transação ANTIGA diferente
    // da que está ativa, ignora — o PIX velho expirando não pode derrubar a
    // assinatura paga em outra transação.
    if (
      subscriptionStatus === "inactive" &&
      wasActive &&
      prevSub?.transaction_id &&
      String(transactionId || "") &&
      String(prevSub.transaction_id) !== String(transactionId)
    ) {
      console.log(
        `Perfect Pay: ignorando '${statusLower}' de transação antiga (${transactionId}) — assinatura ativa atual é ${prevSub.transaction_id}`
      );
      return new Response(
        JSON.stringify({ ok: true, ignored: true, reason: "stale_transaction" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upsert subscription
    const { error: subError } = await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          status: subscriptionStatus,
          payment_provider: "perfectpay",
          transaction_id: String(transactionId || ""),
          plan,
        },
        { onConflict: "user_id" }
      );

    if (subError) throw subError;

    if (subscriptionStatus === "active" && !wasActive) {
      const { error: vagaError } = await supabase.rpc("decrement_vaga");
      if (vagaError) console.error("Erro decrementando vaga:", vagaError);
    }

    console.log(`Subscription ${subscriptionStatus} for user ${email} (event: ${statusLower})`);

    return new Response(
      JSON.stringify({ success: true, status: subscriptionStatus }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
