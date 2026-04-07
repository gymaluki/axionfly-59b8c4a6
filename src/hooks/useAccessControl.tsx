import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAccessControl(user: User | null) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setHasAccess(false);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasAccess(null);

    const checkAccess = async () => {
      try {
        const { data: hasAccessResult, error: accessError } = await supabase
          .rpc("check_user_access", { check_user_id: user.id });

        if (accessError) {
          console.error("Access RPC error:", accessError);
        }

        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("id")
          .eq("email", user.email ?? "")
          .maybeSingle();

        if (adminError) {
          console.error("Admin check error:", adminError);
        }

        if (!isMounted) return;

        const isAdminUser = !!adminData;
        const accessGranted = hasAccessResult === true || isAdminUser;

        setIsAdmin(isAdminUser);
        setHasAccess(accessGranted);
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
  }, [user]);

  return { hasAccess, isAdmin, loading };
}
