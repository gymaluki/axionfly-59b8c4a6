// Sistema de afiliados — captura ?aff=slug na URL, persiste em localStorage
// e resolve os links da Cakto com o código de afiliado correto de cada parceiro.

export type PlanKey = "monthly" | "quarterly" | "lifetime";

export interface Affiliate {
  slug: string;          // usado em ?aff=
  name: string;          // nome do afiliado
  monthlyUrl: string;    // link Cakto plano mensal (com ?affiliate=...)
  quarterlyUrl: string;  // link Cakto plano trimestral (com ?affiliate=...)
  lifetimeUrl: string;   // link Cakto plano vitalício (com ?affiliate=...)
}

// Registro central de afiliados. Para adicionar um novo, basta acrescentar aqui.
export const AFFILIATES: Record<string, Affiliate> = {
  jonathan: {
    slug: "o",
    name: "O",
    monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=ZsdtBDJP",
    quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=ZsdtBDJP",
    lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=TSVMgq3q",
  },
  u: {
    slug: "u",
    name: "U",
    monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=A73MAj5S",
    quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=A73MAj5S",
    lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=KzuwSFCx",
  },
  pedro: {
    slug: "e",
    name: "E",
    monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=RSTFakbs",
    quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=RSTFakbs",
    lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=eQQiRkDL",
  },
  diogo: {
    slug: "d",
    name: "D",
    monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=RSTFakbs",
    quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=RSTFakbs",
    lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=eQQiRkDL",
  },
  matheus: {
    slug: "zk",
    name: "Matheus",
    monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=Lghn3ieU",
    quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=Lghn3ieU",
    lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=LEGLH5Bd",
  },
  jv: {
    slug: "jv",
    name: "JV",
    monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=ivzz5ooZ",
    quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=ivzz5ooZ",
    lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=Y36tx3VC",
  },
  yan: {
    slug: "kx",
    name: "Yan",
    monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=QmFRRS9a",
    quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=QmFRRS9a",
    lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=jbK39AUb",
  },
};

// Links padrão (sem afiliado) — caem direto pra conta principal da Cakto.
const DEFAULT_MONTHLY = "https://pay.cakto.com.br/6u886t8_849513";
const DEFAULT_QUARTERLY = "https://pay.cakto.com.br/uqn993t";
const DEFAULT_LIFETIME = "https://pay.cakto.com.br/wcv2cko_849541";

export const STORAGE_KEY = "affiliate_ref";
export const PLAN_STORAGE_KEY = "selected_plan";
const TTL_DAYS = 30;

interface StoredAffiliate {
  slug: string;
  expiresAt: number;
}

/**
 * Lê ?aff= da URL ou o pathname e, se for um slug válido, salva em localStorage por 30 dias.
 */
export function captureAffiliateFromUrl(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname.replace(/^\/|\/$/g, ""); // remove slashes
    
    // 1. Tenta pegar do pathname (ex: /n)
    let finalSlug = pathname.split("/")[0]; // Pega apenas a primeira parte do path
    
    // Lista de slugs conhecidos para evitar capturar caminhos do sistema
    const knownSlugs = Object.values(AFFILIATES).map(a => a.slug);
    const knownKeys = Object.keys(AFFILIATES);
    const allKnown = [...new Set([...knownSlugs, ...knownKeys])];

    if (!allKnown.includes(finalSlug)) {
      // 2. Se não for um slug conhecido no path, tenta nos query params
      const possibleParams = ["aff", "ref", "d", "e", "o", "u", "jv", "y", "zk"];
      finalSlug = "";

      for (const p of possibleParams) {
        const val = params.get(p);
        if (val !== null) {
          finalSlug = val.trim().toLowerCase() || p;
          break;
        }
      }
    }

    if (!finalSlug) return;
    
    const affiliate = Object.values(AFFILIATES).find(a => a.slug === finalSlug) || AFFILIATES[finalSlug];
    
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

/** Retorna o afiliado ativo (se houver e ainda não expirou). */
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
    // Busca o afiliado pelo slug
    return Object.values(AFFILIATES).find(a => a.slug === data.slug) || null;
  } catch {
    return null;
  }
}

/**
 * Resolve o link de checkout final.
 * Se houver afiliado ativo, devolve o link Cakto dele (com ?affiliate=...).
 * Caso contrário, devolve o link padrão.
 */
export function resolveCheckoutUrl(plan: PlanKey, affiliateSlug?: string | null): string {
  // Se passou slug explicitamente, usa ele. Senão, tenta pegar do localStorage.
  const aff = affiliateSlug 
    ? (Object.values(AFFILIATES).find(a => a.slug === affiliateSlug) || AFFILIATES[affiliateSlug])
    : getActiveAffiliate();
  
  let baseUrl = "";
  if (plan === "monthly") baseUrl = aff ? aff.monthlyUrl : DEFAULT_MONTHLY;
  else if (plan === "quarterly") baseUrl = aff ? aff.quarterlyUrl : DEFAULT_QUARTERLY;
  else baseUrl = aff ? aff.lifetimeUrl : DEFAULT_LIFETIME;

  return baseUrl;
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
