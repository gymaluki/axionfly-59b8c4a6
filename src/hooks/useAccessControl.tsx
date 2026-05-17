import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAccessControl(user: User | null) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkedUserId, setCheckedUserId] = useState<string | null>(null);

  const userId = user?.id ?? null;
  

  useEffect(() => {
    let isMounted = true;

    if (!userId) {
      setHasAccess(false);
      setIsAdmin(false);
      setLoading(false);
      setCheckedUserId(null);
      return;
    }

    // Don't re-check if we already verified this user
    if (checkedUserId === userId && hasAccess !== null) {
      return;
    }

    setLoading(true);

    const checkAccess = async () => {
      try {
        const [accessRes, adminRes] = await Promise.all([
          supabase.rpc("check_user_access", { check_user_id: userId }),
          supabase.rpc("is_admin", { check_user_id: userId }),
        ]);

        if (accessRes.error) {
          console.error("Access RPC error:", accessRes.error);
        }
        if (adminRes.error) {
          console.error("Admin check error:", adminRes.error);
        }

        let hasAccessResult = accessRes.data;
        const adminData = adminRes.data;
        const isAdminUser = adminData === true;

        // Fallback: se o acesso está negado, tenta resgatar pagamento pendente
        // (cobre usuários cujo webhook caiu em pending_payments por causa do
        // bug antigo de paginação no listUsers).
        if (hasAccessResult !== true && !isAdminUser) {
          const claimRes = await supabase.rpc("claim_pending_access" as never);
          if (claimRes.data === true) {
            const recheck = await supabase.rpc("check_user_access", { check_user_id: userId });
            hasAccessResult = recheck.data;
          }
        }

        if (!isMounted) return;

        const accessGranted = hasAccessResult === true || isAdminUser;

        setIsAdmin(isAdminUser);
        setHasAccess(accessGranted);
        setCheckedUserId(userId);
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        console.error("Access check error:", err);
        setIsAdmin(false);
        setHasAccess(false);
        setLoading(false);
      }
    };

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [userId, checkedUserId, hasAccess]);

  return { hasAccess, isAdmin, loading };
}
