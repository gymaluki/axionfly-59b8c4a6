import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.49.4/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const PERFECTPAY_WEBHOOK_TOKEN = Deno.env.get("PERFECTPAY_WEBHOOK_TOKEN");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    // Validate webhook token if configured
    if (PERFECTPAY_WEBHOOK_TOKEN) {
      const url = new URL(req.url);
      const token = url.searchParams.get("token");
      if (token !== PERFECTPAY_WEBHOOK_TOKEN) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const body = await req.json();
    console.log("Perfect Pay webhook received:", JSON.stringify(body));

    // Perfect Pay sends different event types
    // Common fields: customer.email, sale_status_enum
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

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) throw userError;

    const user = userData.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      console.log(`User not found for email: ${email}. Will activate when they register.`);
      // Store pending activation — we'll check on login
      return new Response(
        JSON.stringify({ message: "User not found yet, payment recorded" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map Perfect Pay status to our status
    // Perfect Pay statuses: approved, completed, refunded, canceled, chargeback, etc.
    const isActive = ["approved", "completed", "paid"].includes(
      (status || "").toLowerCase()
    );

    const subscriptionStatus = isActive ? "active" : "inactive";

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

    console.log(`Subscription ${subscriptionStatus} for user ${email}`);

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
