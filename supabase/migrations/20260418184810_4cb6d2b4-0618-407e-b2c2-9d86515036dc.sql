-- Garantir que o trigger de criação de perfil existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Garantir que o trigger de ativação de pagamento pendente existe
DROP TRIGGER IF EXISTS on_auth_user_activate_payment ON auth.users;
CREATE TRIGGER on_auth_user_activate_payment
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.activate_pending_payment();