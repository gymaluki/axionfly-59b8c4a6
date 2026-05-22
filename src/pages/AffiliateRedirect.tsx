import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { normalizeAffiliateSlug } from "@/lib/affiliates";

const STORAGE_KEY = "affiliate_ref";
const TTL_DAYS = 30;

export default function AffiliateRedirect({ slug: propsSlug }: { slug?: string }) {
  const { slug: paramsSlug } = useParams<{ slug: string }>();
  const slug = propsSlug || paramsSlug;
  const navigate = useNavigate();

  useEffect(() => {
    const affiliateSlug = normalizeAffiliateSlug(slug);

    if (affiliateSlug) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ slug: affiliateSlug, expiresAt: Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000 })
        );
      } catch {
        // ignore
      }
    }
    // Redireciona para a home para que o usuário escolha o plano
    navigate("/", { replace: true });
  }, [slug, navigate]);

  return null;
}
