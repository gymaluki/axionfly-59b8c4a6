
CREATE OR REPLACE FUNCTION public.decrement_vaga()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_value integer;
  new_value integer;
  reset_to integer;
BEGIN
  SELECT remaining_slots, initial_slots
    INTO current_value, reset_to
  FROM public.vagas_config
  WHERE singleton = true
  FOR UPDATE;

  IF current_value IS NULL THEN
    RETURN NULL;
  END IF;

  -- Se está em 1 vaga e alguém comprou, reinicia para o valor inicial (ex: 4)
  IF current_value <= 1 THEN
    new_value := COALESCE(reset_to, 4);
  ELSE
    new_value := current_value - 1;
  END IF;

  UPDATE public.vagas_config
  SET remaining_slots = new_value,
      updated_at = now()
  WHERE singleton = true;

  RETURN new_value;
END;
$$;
