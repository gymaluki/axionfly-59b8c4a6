-- Inserindo vendas simuladas para totalizar aproximadamente 13k
INSERT INTO public.sales (user_id, client_name, amount, description, status, sale_date)
VALUES 
  ('36d0753f-36e9-418f-9160-d35a7c81d597', 'Cliente Alpha', 1400, 'Landing Page Profissional', 'pago', CURRENT_DATE),
  ('36d0753f-36e9-418f-9160-d35a7c81d597', 'Cliente Beta', 1250, 'E-commerce Setup', 'pago', CURRENT_DATE),
  ('36d0753f-36e9-418f-9160-d35a7c81d597', 'Cliente Gamma', 1100, 'Consultoria Digital', 'pago', CURRENT_DATE),
  ('36d0753f-36e9-418f-9160-d35a7c81d597', 'Cliente Delta', 950, 'Site Institucional', 'pago', CURRENT_DATE),
  ('36d0753f-36e9-418f-9160-d35a7c81d597', 'Cliente Epsilon', 1350, 'Gestão de Tráfego', 'pago', CURRENT_DATE),
  ('36d0753f-36e9-418f-9160-d35a7c81d597', 'Cliente Zeta', 800, 'Manutenção Mensal', 'pago', CURRENT_DATE),
  ('36d0753f-36e9-418f-9160-d35a7c81d597', 'Cliente Eta', 1400, 'Projeto UI/UX', 'pago', CURRENT_DATE),
  ('36d0753f-36e9-418f-9160-d35a7c81d597', 'Cliente Theta', 1200, 'Desenvolvimento Web', 'pago', CURRENT_DATE),
  ('36d0753f-36e9-418f-9160-d35a7c81d597', 'Cliente Iota', 1150, 'Automação de Vendas', 'pago', CURRENT_DATE),
  ('36d0753f-36e9-418f-9160-d35a7c81d597', 'Cliente Kappa', 900, 'Design de Logotipo', 'pago', CURRENT_DATE),
  ('36d0753f-36e9-418f-9160-d35a7c81d597', 'Cliente Lambda', 1400, 'App Mobile MVP', 'pago', CURRENT_DATE),
  ('36d0753f-36e9-418f-9160-d35a7c81d597', 'Cliente Mu', 1100, 'SEO Optimization', 'pago', CURRENT_DATE);
-- Total aproximado: 13,000