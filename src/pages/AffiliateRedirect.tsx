import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AFFILIATES } from "@/lib/affiliates";

const STORAGE_KEY = "axionfly_affiliate";
const TTL_DAYS = 30;

export default function AffiliateRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const key = (slug || "").toLowerCase().trim();
    if (key && AFFILIATES[key]) {
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
