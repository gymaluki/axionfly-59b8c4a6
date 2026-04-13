INSERT INTO public.subscriptions (user_id, status, plan, payment_provider)
VALUES
  ('1bd1cf20-f6ff-4e81-99b2-789232bdc1f3', 'active', 'lifetime', 'manual'),
  ('370d4813-c196-4138-8284-c914d3dce8fd', 'active', 'lifetime', 'manual'),
  ('a87c6188-c9d7-461a-ba67-97729bb3325e', 'active', 'lifetime', 'manual'),
  ('8b1cd002-4410-4914-8e73-be8cc1112bc7', 'active', 'lifetime', 'manual'),
  ('996321ef-bacb-4905-b5a0-35541351ea26', 'active', 'lifetime', 'manual'),
  ('c2b48f83-f010-4d0f-820d-e7c0802e389d', 'active', 'lifetime', 'manual'),
  ('34f8b854-c101-4388-b4a0-89cc21c68cd8', 'active', 'lifetime', 'manual')
ON CONFLICT (user_id) DO UPDATE SET status = 'active', plan = 'lifetime', updated_at = now();