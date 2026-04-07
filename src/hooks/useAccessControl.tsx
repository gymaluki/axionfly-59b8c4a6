import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAccessControl(user: User | null) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHasAccess(false);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const checkAccess = async () => {
      try {
        // Use the database function that checks both admin and subscription
        const { data: hasAccessResult, error: accessError } = await supabase
          .rpc("check_user_access", { check_user_id: user.id });

        if (accessError) {
          console.error("Access RPC error:", accessError);
        }

        // Check if user is admin (separate query)
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("id")
          .eq("email", user.email ?? "")
          .maybeSingle();

        if (adminError) {
          console.error("Admin check error:", adminError);
        }

        const isAdminUser = !!adminData;
        const accessGranted = hasAccessResult === true || isAdminUser;

        setIsAdmin(isAdminUser);
        setHasAccess(accessGranted);
        setLoading(false);
      } catch (err) {
        console.error("Access check error:", err);
        // On error, still try to not block — default to false
        setHasAccess(false);
        setLoading(false);
      }
    };

    checkAccess();
  }, [user]);

  return { hasAccess, isAdmin, loading };
}
