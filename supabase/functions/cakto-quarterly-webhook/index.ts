// Plano trimestral foi descontinuado. Esta function retorna 410 Gone
// e apenas registra qualquer chamada para auditoria.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cakto-signature, x-signature',
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
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
