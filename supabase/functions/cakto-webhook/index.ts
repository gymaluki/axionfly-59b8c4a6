import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cakto-signature, x-signature, x-webhook-token, cakto-signature, secret',
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

    // Validação de token OBRIGATÓRIA — bloqueia chamadas não autenticadas.
    if (!CAKTO_WEBHOOK_TOKEN) {
      console.error("Cakto webhook: CAKTO_WEBHOOK_TOKEN não configurado — bloqueando requisição");
      return new Response(JSON.stringify({ error: "Webhook not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const raw = await req.text();
    let body: any = {};
    try {
      body = JSON.parse(raw);
    } catch {
      console.error("Cakto webhook: payload não é JSON válido", raw);
    }

    const url = new URL(req.url);
    const normalizeValue = (value: unknown): string =>
      value === null || value === undefined ? "" : String(value).trim().toLowerCase();
    const token =
      req.headers.get("x-webhook-token") ||
      req.headers.get("x-cakto-signature") ||
      req.headers.get("cakto-signature") ||
      req.headers.get("x-signature") ||
      req.headers.get("secret") ||
      body?.secret ||
      url.searchParams.get("token") ||
      url.searchParams.get("secret");
    if (token !== CAKTO_WEBHOOK_TOKEN) {
      console.warn("Cakto webhook: token inválido");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
    const normalizedEmail = normalizeValue(email);

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
    const normalizedTransactionId = normalizeValue(transactionId);

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
      data?.affiliate ||
      data?.affiliate_id || 
      data?.affiliate?.id || 
      data?.affiliate?.code || 
      data?.affiliate?.slug ||
      null;

    const productLower = productName.toString().toLowerCase();
    const isLifetime = /(vital|lifetime|único|unico|para sempre)/.test(productLower);
    const plan = isLifetime ? "lifetime" : "monthly";

    if (!normalizedEmail) {
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

    // PROTEÇÃO ANTIFRAUDE: valor mínimo aceito para ativar assinatura.
    // O plano mais barato é R$67,90 — qualquer valor abaixo de R$30 é fraude
    // (atacante criando produto fake na Cakto por valor irrisório).
    const MIN_VALID_AMOUNT = 30;
    if (subscriptionStatus === "active" && amount > 0 && amount < MIN_VALID_AMOUNT) {
      const attackerIp =
        req.headers.get("x-forwarded-for") ||
        req.headers.get("cf-connecting-ip") ||
        req.headers.get("x-real-ip") ||
        "desconhecido";
      const attackerUA = req.headers.get("user-agent") || "desconhecido";
      const detectedAt = new Date().toISOString();

      console.error(
        `[FRAUDE BLOQUEADA] Cakto webhook: valor R$${amount} abaixo do mínimo (R$${MIN_VALID_AMOUNT}). ` +
        `Email: ${email}, transaction: ${transactionId}, IP: ${attackerIp}, payload: ${JSON.stringify(body)}`
      );

      // Registra a tentativa no painel de erros do admin pra alerta em tempo real
      try {
        const supabaseAlert = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        await supabaseAlert.from("system_errors").insert({
          level: "error",
          source: "fraud_attempt_cakto",
          message: `🚨 TENTATIVA DE FRAUDE BLOQUEADA — Cakto Webhook (R$ ${amount})`,
          user_email: email,
          user_agent: attackerUA,
          url: req.url,
          context: {
            attacker_ip: attackerIp,
            attempted_amount: amount,
            minimum_required: MIN_VALID_AMOUNT,
            transaction_id: transactionId,
            payload: body,
            detected_at: detectedAt,
          },
        });
      } catch (e) {
        console.error("Falha ao registrar tentativa de fraude:", e);
      }

      const alerta = [
        "═══════════════════════════════════════════════════════════════",
        "🚨 ATENÇÃO — TENTATIVA DE FRAUDE DETECTADA E BLOQUEADA 🚨",
        "═══════════════════════════════════════════════════════════════",
        "",
        "VOCÊ ACABA DE TENTAR FRAUDAR A PLATAFORMA AXIONFLY.",
        "",
        "Foi identificado que você criou um produto na Cakto com valor",
        `irrisório de R$ ${amount.toFixed(2)} tentando obter acesso indevido`,
        `à assinatura (valor mínimo legítimo: R$ ${MIN_VALID_AMOUNT.toFixed(2)}).`,
        "",
        "── O QUE FOI CAPTURADO DE VOCÊ ──",
        `• Endereço IP:        ${attackerIp}`,
        `• Navegador/Agente:   ${attackerUA}`,
        `• E-mail utilizado:   ${email}`,
        `• ID da transação:    ${transactionId || "N/A"}`,
        `• Valor da tentativa: R$ ${amount.toFixed(2)}`,
        `• Data/Hora (UTC):    ${detectedAt}`,
        "",
        "── CONSEQUÊNCIAS ──",
        "1. Sua tentativa foi REGISTRADA permanentemente em nosso sistema.",
        "2. Seu IP, e-mail e dispositivo foram MARCADOS e ficarão sob",
        "   monitoramento contínuo.",
        "3. O acesso NÃO foi e NÃO será liberado.",
        "4. Tentativa de fraude eletrônica é crime previsto no Art. 171-A",
        "   do Código Penal Brasileiro (Lei 14.155/2021), com pena de",
        "   RECLUSÃO de 4 a 8 anos e multa.",
        "5. Caso novas tentativas sejam identificadas, todos os dados",
        "   coletados serão encaminhados às autoridades competentes",
        "   (Polícia Civil — Delegacia de Crimes Cibernéticos) e à Cakto",
        "   para abertura de boletim de ocorrência e investigação.",
        "",
        "Pare AGORA enquanto ainda é tempo.",
        "Se quiser acesso legítimo, adquira o plano em axionfly.site",
        "═══════════════════════════════════════════════════════════════",
      ].join("\n");

      return new Response(alerta, {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
      });
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
    if (normalizedTransactionId) {
      const { error: saleError } = await supabase
        .from("platform_sales")
        .upsert(
          {
            transaction_id: normalizedTransactionId,
            email: normalizedEmail,
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
      if (subscriptionStatus === "active") {
        await supabase
          .from("pending_payments")
          .upsert(
            {
               email: emailLower,
              status: "active",
              payment_provider: "cakto",
               transaction_id: normalizedTransactionId,
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
      .select("status, transaction_id, plan")
      .eq("user_id", user.id)
      .maybeSingle();
    const wasActive = prevSub?.status === "active";

    // FIX PIX: se chega um evento "inactive" (expired/cancelled) mas é de uma
    // transação ANTIGA diferente da que está ativa, ignora — senão o PIX que
    // expirou derruba a assinatura paga (caso comum: usuário gera PIX, não paga,
    // gera outro e paga; o primeiro expira depois e cancelava o acesso).
    if (
      subscriptionStatus === "inactive" &&
      wasActive &&
      prevSub?.transaction_id &&
      normalizedTransactionId &&
      normalizeValue(prevSub.transaction_id) !== normalizedTransactionId
    ) {
      console.log(
        `Cakto: ignorando '${status}' de transação antiga (${transactionId}) — assinatura ativa atual é ${prevSub.transaction_id}`
      );
      return new Response(
        JSON.stringify({ ok: true, ignored: true, reason: "stale_transaction" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          status: subscriptionStatus,
          payment_provider: "cakto",
          transaction_id: normalizedTransactionId,
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