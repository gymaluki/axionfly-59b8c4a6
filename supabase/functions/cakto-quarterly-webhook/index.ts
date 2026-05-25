// Plano trimestral foi descontinuado. Esta function retorna 410 Gone
// e apenas registra qualquer chamada para auditoria.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cakto-signature, x-signature, x-webhook-token, secret',
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const configuredToken = Deno.env.get("CAKTO_WEBHOOK_TOKEN");
    const url = new URL(req.url);
    const token =
      req.headers.get("x-webhook-token") ||
      req.headers.get("x-cakto-signature") ||
      req.headers.get("x-signature") ||
      req.headers.get("secret") ||
      url.searchParams.get("token") ||
      url.searchParams.get("secret");

    if (configuredToken && token !== configuredToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.text();
    console.log("[cakto-quarterly-webhook] DESCONTINUADO — chamada recebida:", body.slice(0, 2000));
  } catch {
    // ignore
  }
  return new Response(
    JSON.stringify({ error: "Plano trimestral descontinuado. Use apenas mensal ou vitalício." }),
    { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
