// Sistema de afiliados — captura ?aff=slug na URL, persiste em localStorage
// e resolve os links da Cakto. Os links agora são lidos do banco (tabela
// affiliates), com fallback nos defaults abaixo. Edições no painel admin
// passam a valer assim que a landing for recarregada (cache 24h).

import { supabase } from "@/integrations/supabase/client";

export type PlanKey = "monthly" | "quarterly" | "lifetime";

export interface Affiliate {
  slug: string;
  name: string;
  monthlyUrl: string;
  quarterlyUrl: string;
  lifetimeUrl: string;
}

// Fallback estático — usado se o banco não responder a tempo.
export const AFFILIATES: Record<string, Affiliate> = {
  o: { slug: "o", name: "O", monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=ZsdtBDJP", quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=ZsdtBDJP", lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=TSVMgq3q" },
  u: { slug: "u", name: "U", monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=A73MAj5S", quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=A73MAj5S", lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=KzuwSFCx" },
  l: { slug: "l", name: "L", monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=Lghn3ieU", quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=Lghn3ieU", lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=LEGLH5Bd" },
  e: { slug: "e", name: "E", monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=RSTFakbs", quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=RSTFakbs", lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=eQQiRkDL" },
  d: { slug: "d", name: "D", monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=RSTFakbs", quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=RSTFakbs", lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=eQQiRkDL" },
  z: { slug: "z", name: "Matheus", monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=Lghn3ieU", quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=Lghn3ieU", lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=LEGLH5Bd" },
};

const DEFAULT_MONTHLY = "https://pay.cakto.com.br/6u886t8_849513";
const DEFAULT_QUARTERLY = "https://pay.cakto.com.br/uqn993t";
const DEFAULT_LIFETIME = "https://pay.cakto.com.br/wcv2cko_849541";

const STORAGE_KEY = "axionfly_affiliate";
const DB_CACHE_KEY = "axionfly_affiliates_db";
const TTL_DAYS = 30;

interface StoredAffiliate { slug: string; expiresAt: number; }

let dbAffiliates: Record<string, Affiliate> | null = null;

function readDbCache(): Record<string, Affiliate> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DB_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: Record<string, Affiliate>; ts: number };
    if (Date.now() - parsed.ts > 6 * 60 * 60 * 1000) return null;
    return parsed.data;
  } catch { return null; }
}

export async function loadAffiliatesFromDb(): Promise<void> {
  const cached = readDbCache();
  if (cached) dbAffiliates = cached;
  try {
    const { data, error } = await supabase
      .from("affiliates")
      .select("slug, name, monthly_url, quarterly_url, lifetime_url");
    if (error || !data) return;
    const map: Record<string, Affiliate> = {};
    for (const row of data as any[]) {
      const fb = AFFILIATES[row.slug];
      map[row.slug] = {
        slug: row.slug,
        name: row.name || fb?.name || row.slug,
        monthlyUrl: row.monthly_url || fb?.monthlyUrl || DEFAULT_MONTHLY,
        quarterlyUrl: row.quarterly_url || fb?.quarterlyUrl || DEFAULT_QUARTERLY,
        lifetimeUrl: row.lifetime_url || fb?.lifetimeUrl || DEFAULT_LIFETIME,
      };
    }
    dbAffiliates = map;
    try { localStorage.setItem(DB_CACHE_KEY, JSON.stringify({ data: map, ts: Date.now() })); } catch {}
  } catch {}
}

function getAffiliateBySlug(slug: string): Affiliate | undefined {
  return dbAffiliates?.[slug] || AFFILIATES[slug];
}

export function captureAffiliateFromUrl(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const slug = (params.get("aff") || params.get("ref") || params.get("d") || params.get("e") || params.get("o") || params.get("u") || "").toLowerCase().trim();
    let finalSlug = slug;
    if (!slug) {
      if (params.has("d")) finalSlug = "d";
      else if (params.has("e")) finalSlug = "e";
      else if (params.has("o")) finalSlug = "o";
      else if (params.has("u")) finalSlug = "u";
    }
    if (!finalSlug) return;
    const affiliate = getAffiliateBySlug(finalSlug);
    if (!affiliate) return;
    const data: StoredAffiliate = { slug: affiliate.slug, expiresAt: Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function getActiveAffiliate(): Affiliate | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredAffiliate;
    if (!data?.slug || !data.expiresAt || Date.now() > data.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return getAffiliateBySlug(data.slug) || null;
  } catch { return null; }
}

export function resolveCheckoutUrl(plan: PlanKey): string {
  const aff = getActiveAffiliate();
  if (aff) {
    if (plan === "monthly") return aff.monthlyUrl;
    if (plan === "quarterly") return aff.quarterlyUrl;
    return aff.lifetimeUrl;
  }
  if (plan === "monthly") return DEFAULT_MONTHLY;
  if (plan === "quarterly") return DEFAULT_QUARTERLY;
  return DEFAULT_LIFETIME;
}
