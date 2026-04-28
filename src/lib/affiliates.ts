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
    slug: "jonathan",
    name: "Jonathan Ferreira",
    monthlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=ZsdtBDJP",
    quarterlyUrl: "https://pay.cakto.com.br/6u886t8_849513?affiliate=ZsdtBDJP", // TODO: substituir pelo link trimestral oficial
    lifetimeUrl: "https://pay.cakto.com.br/wcv2cko_849541?affiliate=TSVMgq3q",
  },
};

// Links padrão (sem afiliado) — caem direto pra conta principal da Cakto.
const DEFAULT_MONTHLY = "https://pay.cakto.com.br/6u886t8_849513";
const DEFAULT_QUARTERLY = "https://pay.cakto.com.br/6u886t8_849513"; // TODO: substituir pelo link trimestral oficial
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
    const slug = (params.get("aff") || params.get("ref") || "").toLowerCase().trim();
    if (!slug || !AFFILIATES[slug]) return;

    const data: StoredAffiliate = {
      slug,
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
    return AFFILIATES[data.slug] || null;
  } catch {
    return null;
  }
}

/**
 * Resolve o link de checkout final.
 * Se houver afiliado ativo, devolve o link Cakto dele (com ?affiliate=...).
 * Caso contrário, devolve o link padrão.
 */
export function resolveCheckoutUrl(plan: "monthly" | "lifetime"): string {
  const aff = getActiveAffiliate();
  if (aff) return plan === "monthly" ? aff.monthlyUrl : aff.lifetimeUrl;
  return plan === "monthly" ? DEFAULT_MONTHLY : DEFAULT_LIFETIME;
}
