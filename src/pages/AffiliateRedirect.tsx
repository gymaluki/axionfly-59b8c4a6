import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AFFILIATES, resolveCheckoutUrl } from "@/lib/affiliates";

const STORAGE_KEY = "axionfly_affiliate";
const TTL_DAYS = 30;

export default function AffiliateRedirect({ slug: propsSlug }: { slug?: string }) {
  const { slug: paramsSlug } = useParams<{ slug: string }>();
  const slug = propsSlug || paramsSlug;
  const navigate = useNavigate();

  useEffect(() => {
    const key = (slug || "").toLowerCase().trim();
    const affiliate = Object.values(AFFILIATES).find(a => a.slug === key) || AFFILIATES[key];
    
    if (key && affiliate) {
      const affiliateSlug = affiliate.slug;
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ slug: affiliateSlug, expiresAt: Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000 })
        );
      } catch {
        // ignore
      }
    }
    // Redireciona para a home com um parâmetro interno para sinalizar que viemos de um redirecionamento de afiliado
    // Isso evita que a lógica de limpeza na home remova o afiliado recém-salvo.
    // Redireciona para a página de criação de conta com o redirecionamento de pagamento configurado
    const targetUrl = resolveCheckoutUrl("lifetime" as any); // Usamos um plano base para montar a URL
    navigate(`/auth?from_redirect=1&redirect_payment=${encodeURIComponent(targetUrl)}`, { replace: true });
  }, [slug, navigate]);

  return null;
}
