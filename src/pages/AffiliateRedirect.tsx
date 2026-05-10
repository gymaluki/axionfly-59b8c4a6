import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AFFILIATES } from "@/lib/affiliates";

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
          JSON.stringify({ slug: key, expiresAt: Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000 })
        );
      } catch {
        // ignore
      }
    }
    navigate("/", { replace: true });
  }, [slug, navigate]);

  return null;
}
