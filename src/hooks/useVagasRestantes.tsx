import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useVagasRestantes(fallback = 4) {
  const [vagas, setVagas] = useState<number>(fallback);

  useEffect(() => {
    let mounted = true;

    const fetchVagas = async () => {
      const { data } = await supabase
        .from("vagas_config")
        .select("remaining_slots")
        .limit(1)
        .maybeSingle();
      if (mounted && data && typeof data.remaining_slots === "number") {
        setVagas(data.remaining_slots);
      }
    };

    fetchVagas();

    const channel = supabase
      .channel(`vagas_config_changes_${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vagas_config" },
        (payload) => {
          const next = (payload.new as { remaining_slots?: number })?.remaining_slots;
          if (typeof next === "number") setVagas(next);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return vagas;
}
