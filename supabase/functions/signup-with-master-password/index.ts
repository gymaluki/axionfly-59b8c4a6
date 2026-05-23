// Edge function: cadastra usuário sem liberar acesso automático.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const reqId = crypto.randomUUID().slice(0, 8);
  console.log(`[signup ${reqId}] início — método=${req.method}`);

  try {
    const { email, password } = await req.json();
    console.log(`[signup ${reqId}] payload recebido — email=${email}, senha_len=${password?.length ?? 0}`);

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.trim() === "" ||
      password.length < 6
    ) {
      return new Response(
        JSON.stringify({ error: "Email ou senha inválidos." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const normalizedEmailEarly = email.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmailEarly);

    if (!isValidEmail) {
      return new Response(
        JSON.stringify({ error: "Email ou senha inválidos." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 🛡️ Bloqueio anti-bot: padrões usados em ataques de criação em massa
    const ABUSE_PATTERNS: RegExp[] = [
      /hackedby/i,
      /lorota|lorata/i,
      /^hacked[_.\-]?\d+/i,
      /^user[_.\-]?\d{10,}/i,        // user_<timestamp>_xxx
      /^test[_.\-]?\d+/i,
      /^admin@/i,                     // admin@gmail.com, admin@admin.com etc
      /^axionfly@/i,                  // tentativa de impersonar a marca
    ];
    if (ABUSE_PATTERNS.some((re) => re.test(normalizedEmailEarly))) {
      console.warn("Signup bloqueado (padrão suspeito):", normalizedEmailEarly);
      return new Response(
        JSON.stringify({ error: "Cadastro não permitido para este email." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Bloqueia subaddressing abusivo (mais de 1 "+" tag)
    const localPart = normalizedEmailEarly.split("@")[0] ?? "";
    if ((localPart.match(/\+/g) ?? []).length > 1) {
      return new Response(
        JSON.stringify({ error: "Cadastro não permitido para este email." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Tamanho máximo razoável
    if (normalizedEmailEarly.length > 120) {
      return new Response(
        JSON.stringify({ error: "Email muito longo." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const normalizedEmail = normalizedEmailEarly;

    console.log(`[signup ${reqId}] criando usuário — email=${normalizedEmail}`);

    // Cria o usuário (já confirmado para login imediato)
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true, // sempre confirma — evita "Email not confirmed" no auto-login
    });

    if (createErr || !created.user) {
      console.error(`[signup ${reqId}] FALHA createUser:`, createErr?.status, createErr?.message, createErr);
      return new Response(
        JSON.stringify({
          error: "Não foi possível concluir o cadastro. Se você já tiver conta, tente entrar.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log(`[signup ${reqId}] usuário criado — id=${created.user.id}, confirmed_at=${created.user.email_confirmed_at}`);

    return new Response(
      JSON.stringify({
        success: true,
        masterAccess: false,
        userId: created.user.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("Erro inesperado:", err);
    return new Response(
      JSON.stringify({ error: "Erro inesperado ao processar cadastro." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
