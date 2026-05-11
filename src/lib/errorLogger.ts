import { supabase } from "@/integrations/supabase/client";

let installed = false;
let recentMessages = new Map<string, number>();

async function report(payload: {
  level?: string;
  message: string;
  stack?: string;
  source?: string;
  context?: Record<string, unknown>;
}) {
  try {
    // Dedup: ignore same message within 5s
    const key = (payload.level || "error") + "::" + payload.message.slice(0, 200);
    const now = Date.now();
    const last = recentMessages.get(key) || 0;
    if (now - last < 5000) return;
    recentMessages.set(key, now);
    if (recentMessages.size > 100) recentMessages.clear();

    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("system_errors").insert([{
      level: payload.level || "error",
      message: payload.message.slice(0, 2000),
      stack: payload.stack?.slice(0, 4000) ?? null,
      source: payload.source ?? null,
      url: typeof window !== "undefined" ? window.location.href : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      user_id: user?.id ?? null,
      user_email: user?.email ?? null,
      context: payload.context ?? null,
    }]);
  } catch {
    // silently ignore — never crash the app from the logger
  }
}

export function installErrorLogger() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener("error", (e) => {
    report({
      level: "error",
      message: e.message || "Unknown window error",
      stack: e.error?.stack,
      source: e.filename,
    });
  });

  window.addEventListener("unhandledrejection", (e) => {
    const reason: any = e.reason;
    const msg = typeof reason === "string"
      ? reason
      : reason?.message || JSON.stringify(reason)?.slice(0, 500) || "Unhandled promise rejection";
    report({
      level: "error",
      message: msg,
      stack: reason?.stack,
      source: "unhandledrejection",
    });
  });

  // Capture console.error
  const origErr = console.error;
  console.error = (...args: unknown[]) => {
    try {
      const msg = args
        .map((a) => (typeof a === "string" ? a : a instanceof Error ? a.message : JSON.stringify(a)))
        .join(" ")
        .slice(0, 1000);
      // skip noisy React dev warnings
      if (!/^Warning:/.test(msg)) {
        report({ level: "error", message: msg, source: "console.error" });
      }
    } catch {}
    origErr.apply(console, args as []);
  };
}

export const reportError = report;
