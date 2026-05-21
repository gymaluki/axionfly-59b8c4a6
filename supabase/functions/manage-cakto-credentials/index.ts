import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const clientIdSchema = /^[A-Za-z0-9._\-]{3,200}$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!["GET", "POST"].includes(req.method)) {
    return new Response(JSON.stringify({ error: "Método não permitido." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Não autorizado." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    if (req.method === "GET") {
      const { data: profile, error: profileError } = await admin
        .from("profiles")
        .select("display_name, cakto_product_image_url")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      const { data: creds, error: credsError } = await admin
        .from("user_cakto_credentials")
        .select("id, updated_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (credsError) throw credsError;

      return new Response(JSON.stringify({
        display_name: profile?.display_name ?? null,
        cakto_product_image_url: profile?.cakto_product_image_url ?? null,
        has_credentials: Boolean(creds?.id),
        credentials_updated_at: creds?.updated_at ?? null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const clientId = typeof body.client_id === "string" ? body.client_id.trim() : "";
    const clientSecret = typeof body.client_secret === "string" ? body.client_secret.trim() : "";
    const imageUrl = typeof body.cakto_product_image_url === "string"
      ? body.cakto_product_image_url.trim()
      : "";

    if (!clientIdSchema.test(clientId)) {
      return new Response(JSON.stringify({ error: "Client ID inválido." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (clientSecret.length < 8 || clientSecret.length > 500) {
      return new Response(JSON.stringify({ error: "Client Secret inválido." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let normalizedImageUrl: string | null = null;
    if (imageUrl) {
      try {
        const parsed = new URL(imageUrl);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new Error("invalid_protocol");
        }
        normalizedImageUrl = parsed.toString();
      } catch {
        return new Response(JSON.stringify({ error: "URL da imagem inválida." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { error: credentialsError } = await admin
      .from("user_cakto_credentials")
      .upsert(
        {
          user_id: user.id,
          client_id: clientId,
          client_secret: clientSecret,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

    if (credentialsError) throw credentialsError;

    const { error: profileUpdateError } = await admin
      .from("profiles")
      .update({ cakto_product_image_url: normalizedImageUrl })
      .eq("user_id", user.id);

    if (profileUpdateError) throw profileUpdateError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("manage-cakto-credentials error:", error);
    return new Response(JSON.stringify({ error: "Falha ao salvar credenciais." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});