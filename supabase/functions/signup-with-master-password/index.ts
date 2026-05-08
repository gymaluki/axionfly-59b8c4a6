// Edge function: cadastra usuário e, se a senha digitada for a senha mestra,
// libera automaticamente 1 mês de acesso (plano "monthly").
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MASTER_PASSWORD = Deno.env.get("MASTER_PASSWORD") ?? "";
const FREE_ACCESS_EMAILS = (Deno.env.get("FREE_ACCESS_EMAILS") ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();

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

    const normalizedEmail = email.trim().toLowerCase();
    const isMaster =
      (MASTER_PASSWORD.length > 0 && password === MASTER_PASSWORD) ||
      FREE_ACCESS_EMAILS.includes(normalizedEmail);

    // Cria o usuário (já confirmado para login imediato com a senha mestra)
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: isMaster, // master = sem necessidade de verificação
    });

    if (createErr || !created.user) {
      return new Response(
        JSON.stringify({ error: createErr?.message ?? "Falha ao criar conta." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Se usou a senha mestra, ativa 1 mês de acesso
    if (isMaster) {
      const { error: subErr } = await admin
        .from("subscriptions")
        .upsert(
          {
            user_id: created.user.id,
            status: "active",
            plan: "monthly",
            payment_provider: "master_password",
            transaction_id: `master-${Date.now()}`,
          },
          { onConflict: "user_id" },
        );

      if (subErr) {
        console.error("Erro ao ativar assinatura mensal:", subErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        masterAccess: isMaster,
        userId: created.user.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Erro inesperado:", err);
    return new Response(
      JSON.stringify({ error: "Erro inesperado ao processar cadastro." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
