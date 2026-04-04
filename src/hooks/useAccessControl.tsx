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
        // Check if user is admin
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("id")
          .eq("email", user.email ?? "")
          .maybeSingle();

        if (adminData) {
          setIsAdmin(true);
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Check if user has active subscription
        const { data: subData } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", user.id)
          .maybeSingle();

        setHasAccess(subData?.status === "active");
        setLoading(false);
      } catch (err) {
        console.error("Access check error:", err);
        setHasAccess(false);
        setLoading(false);
      }
    };

    checkAccess();
  }, [user]);

  return { hasAccess, isAdmin, loading };
}
