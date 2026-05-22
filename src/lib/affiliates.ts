// Sistema de afiliados — captura ?aff=slug na URL, persiste em localStorage
// e resolve os links da Cakto com o código de afiliado correto de cada parceiro.

import { supabase } from "@/integrations/supabase/client";

export type PlanKey = "monthly" | "lifetime";

export interface Affiliate {
  slug: string;
  name: string;
  monthlyUrl: string;
  lifetimeUrl: string;
}

interface StoredAffiliate {
  slug: string;
  expiresAt: number;
}

interface DbAffiliateRow {
  slug: string;
  name: string;
  monthly_url: string;
  lifetime_url: string;
}

// Links padrão (sem afiliado) — caem direto pra conta principal da Cakto.
const DEFAULT_MONTHLY = "https://pay.cakto.com.br/6u886t8_849513";
const DEFAULT_LIFETIME = "https://pay.cakto.com.br/wcv2cko_849541";

export const STORAGE_KEY = "affiliate_ref";
export const PLAN_STORAGE_KEY = "selected_plan";
const TTL_DAYS = 30;
const AFFILIATE_CACHE_KEY = "affiliate_cache_v1";
const AFFILIATE_SLUG_ALIASES: Record<string, string> = {
  zk: "m",
  kx: "y",
};

export function normalizeAffiliateSlug(slug?: string | null): string {
  const normalized = (slug || "").trim().toLowerCase();
  return AFFILIATE_SLUG_ALIASES[normalized] || normalized;
}

function mapDbAffiliate(row: DbAffiliateRow): Affiliate {
  return {
    slug: row.slug,
    name: row.name,
    monthlyUrl: row.monthly_url,
    lifetimeUrl: row.lifetime_url,
  };
}

function readAffiliateCache(): Record<string, Affiliate> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(AFFILIATE_CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Affiliate>;
  } catch {
    return {};
  }
}

function writeAffiliateCache(affiliate: Affiliate) {
  if (typeof window === "undefined") return;
  try {
    const current = readAffiliateCache();
    current[affiliate.slug] = affiliate;
    localStorage.setItem(AFFILIATE_CACHE_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

async function fetchAffiliateBySlug(slug: string): Promise<Affiliate | null> {
  const normalized = normalizeAffiliateSlug(slug);
  if (!normalized) return null;

  const cached = readAffiliateCache()[normalized];
  if (cached) return cached;

  const { data, error } = await supabase.rpc("get_affiliate_by_slug", { _slug: normalized });
  if (error || !data?.length) return null;

  const affiliate = mapDbAffiliate(data[0]);
  writeAffiliateCache(affiliate);
  return affiliate;
}

/**
 * Lê ?aff= da URL ou o pathname e, se for um slug válido, salva em localStorage por 30 dias.
 */
export async function captureAffiliateFromUrl(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname.replace(/^\/|\/$/g, "");

    let finalSlug = normalizeAffiliateSlug(params.get("aff"));
    if (!finalSlug) {
      const firstPathSegment = normalizeAffiliateSlug(pathname.split("/")[0]);
      if (firstPathSegment && firstPathSegment !== "auth") {
        finalSlug = firstPathSegment;
      }
    }

    if (!finalSlug) return;

    const affiliate = await fetchAffiliateBySlug(finalSlug);

    if (!affiliate) return;

    const data: StoredAffiliate = {
      slug: affiliate.slug,
      expiresAt: Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function getStoredAffiliateSlug(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredAffiliate;
    if (!data?.slug || !data.expiresAt || Date.now() > data.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return normalizeAffiliateSlug(data.slug);
  } catch {
    return null;
  }
}

export async function getActiveAffiliate(): Promise<Affiliate | null> {
  const slug = getStoredAffiliateSlug();
  if (!slug) return null;
  return fetchAffiliateBySlug(slug);
}

export async function resolveCheckoutUrl(plan: PlanKey, affiliateSlug?: string | null): Promise<string> {
  const slug = affiliateSlug || getStoredAffiliateSlug();
  const aff = slug ? await fetchAffiliateBySlug(slug) : null;

  if (plan === "monthly") return aff?.monthlyUrl || DEFAULT_MONTHLY;
  return aff?.lifetimeUrl || DEFAULT_LIFETIME;
}

export function setSelectedPlan(plan: PlanKey): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAN_STORAGE_KEY, plan);
}

export function getSelectedPlan(): PlanKey | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PLAN_STORAGE_KEY) as PlanKey | null;
}

export function clearAffiliateData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PLAN_STORAGE_KEY);
}
