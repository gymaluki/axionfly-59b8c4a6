// Edge function: cria checkout (PIX/Cartão) na API Cakto
// Usado pelo modal de checkout customizado da landing page

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CheckoutPayload {
  plan: "monthly" | "lifetime";
  payment_method: "pix" | "credit_card";
  customer: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
  };
}

// Sanitização básica
const onlyDigits = (s: string) => (s || "").replace(/\D/g, "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Método não permitido" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const CAKTO_CLIENT_ID = Deno.env.get("CAKTO_CLIENT_ID");
    const CAKTO_CLIENT_SECRET = Deno.env.get("CAKTO_CLIENT_SECRET");

    if (!CAKTO_CLIENT_ID || !CAKTO_CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ error: "Credenciais Cakto não configuradas no servidor." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = (await req.json()) as CheckoutPayload;
    const { plan, payment_method, customer } = body || ({} as CheckoutPayload);

    // Validação simples
    if (!plan || !payment_method || !customer?.name || !customer?.email || !customer?.cpf || !customer?.phone) {
      return new Response(JSON.stringify({ error: "Dados incompletos." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cpf = onlyDigits(customer.cpf);
    const phone = onlyDigits(customer.phone);
    if (cpf.length !== 11) {
      return new Response(JSON.stringify({ error: "CPF inválido." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Preço por plano (em centavos)
    const PLAN_PRICES: Record<string, { amount: number; title: string }> = {
      monthly: { amount: 14790, title: "AxionFly Mensal" },
      lifetime: { amount: 17990, title: "AxionFly Vitalício" },
    };
    const planInfo = PLAN_PRICES[plan];

    // 1) OAuth token
    const tokenRes = await fetch("https://api.cakto.com.br/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CAKTO_CLIENT_ID,
        client_secret: CAKTO_CLIENT_SECRET,
      }),
    });
    const tokenData = await tokenRes.json().catch(() => ({}));
    if (!tokenRes.ok || !tokenData?.access_token) {
      console.error("Cakto OAuth falhou:", tokenData);
      return new Response(
        JSON.stringify({ error: "Falha ao autenticar com Cakto.", detail: tokenData }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const accessToken = tokenData.access_token as string;

    // 2) Cria checkout/transação
    const orderRes = await fetch("https://api.cakto.com.br/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: planInfo.amount,
        currency: "BRL",
        payment_method,
        description: planInfo.title,
        customer: {
          name: customer.name,
          email: customer.email,
          document: cpf,
          phone,
        },
        metadata: { plan },
      }),
    });

    const orderData = await orderRes.json().catch(() => ({}));
    if (!orderRes.ok) {
      console.error("Cakto checkout falhou:", orderData);
      return new Response(
        JSON.stringify({
          error: "Não foi possível criar o checkout.",
          detail: orderData,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normaliza retorno
    const pixCode =
      orderData?.pix?.qr_code ||
      orderData?.pix_qr_code ||
      orderData?.qr_code ||
      null;
    const pixImage =
      orderData?.pix?.qr_code_image ||
      orderData?.pix_qr_code_image ||
      orderData?.qr_code_image ||
      null;
    const checkoutUrl = orderData?.checkout_url || orderData?.payment_link || null;

    return new Response(
      JSON.stringify({
        success: true,
        payment_method,
        amount: planInfo.amount,
        pix_code: pixCode,
        pix_qr_image: pixImage,
        checkout_url: checkoutUrl,
        raw: orderData,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("cakto-create-checkout error:", err);
    return new Response(JSON.stringify({ error: "Erro interno." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
