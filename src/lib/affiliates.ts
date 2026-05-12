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
  l: {
    slug: "l",
    name: "L",
    monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=Lghn3ieU",
    quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=Lghn3ieU",
    lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=LEGLH5Bd",
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
  matheus_n: {
    slug: "n",
    name: "Matheus N",
    monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=Lghn3ieU",
    quarterlyUrl: "https://pay.cakto.com.br/uqn993t?affiliate=Lghn3ieU",
    lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=LEGLH5Bd",
  },
};

// Links padrão (sem afiliado) — caem direto pra conta principal da Cakto.
const DEFAULT_MONTHLY = "https://pay.cakto.com.br/6u886t8_849513";
const DEFAULT_QUARTERLY = "https://pay.cakto.com.br/uqn993t";
const DEFAULT_LIFETIME = "https://pay.cakto.com.br/wcv2cko_849541";

const STORAGE_KEY = "axionfly_affiliate";
const TTL_DAYS = 30;

interface StoredAffiliate {
  slug: string;
  expiresAt: number;
}

/**
 * Lê ?aff= da URL atual e, se for um slug válido, salva em localStorage por 30 dias.
 * Chame uma vez quando a landing page carrega.
 */
export function captureAffiliateFromUrl(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const slug = (params.get("aff") || params.get("ref") || params.get("d") || params.get("e") || params.get("o") || params.get("u") || params.get("s") || "").toLowerCase().trim();
    
    // Se usar ?d=... e não tiver valor, assume que é o slug correspondente
    let finalSlug = slug;
    if (!slug) {
      if (params.has("d")) finalSlug = "d";
      else if (params.has("e")) finalSlug = "e";
      else if (params.has("o")) finalSlug = "o";
      else if (params.has("u")) finalSlug = "u";
      else if (params.has("s")) finalSlug = "s";
    }
    
    // Procura o afiliado pelo slug ou pelo ID da chave (para suportar legados)
    const affiliate = Object.values(AFFILIATES).find(a => a.slug === finalSlug) || AFFILIATES[finalSlug];
    
    if (!affiliate) return;

    const data: StoredAffiliate = {
      slug: affiliate.slug,
      expiresAt: Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignora — localStorage indisponível
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
