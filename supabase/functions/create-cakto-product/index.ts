import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verifica assinatura ativa
    const { data: hasAccess } = await supabase.rpc('check_user_access', { check_user_id: user.id });
    if (!hasAccess) {
      return new Response(JSON.stringify({ error: 'Subscription required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { name, price, description, image_url } = await req.json();

    if (!name || !price) {
      return new Response(JSON.stringify({ error: 'Name and price are required' }), {
        status:400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Buscar credenciais do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('cakto_client_id, cakto_client_secret')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError || !profile?.cakto_client_id || !profile?.cakto_client_secret) {
      return new Response(JSON.stringify({ error: 'Configure suas credenciais Cakto no perfil primeiro.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Obter Token da Cakto
    const tokenResponse = await fetch('https://api.cakto.com.br/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: profile.cakto_client_id,
        client_secret: profile.cakto_client_secret,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(`Cakto Auth Error: ${tokenData.error_description || tokenData.message || 'Unknown error'}`);
    }

    const caktoAccessToken = tokenData.access_token;

    // 2. Criar Produto na Cakto
    // Nota: O endpoint exato e campos podem variar conforme a versão da API da Cakto.
    // Baseado em padrões de APIs similares de checkout.
    const productResponse = await fetch('https://api.cakto.com.br/v1/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${caktoAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        description: description || `Produto gerado automaticamente por AxionFly para ${name}`,
        price: Math.round(parseFloat(price) * 100), // Preço em centavos
        payment_methods: ['pix', 'credit_card', 'boleto'],
        type: 'digital',
        image_url: image_url || null,
      }),
    });

    const productData = await productResponse.json();
    
    if (!productResponse.ok) {
      throw new Error(`Cakto Product Error: ${productData.message || 'Falha ao criar produto'}`);
    }

    // 3. Pegar o link de checkout (geralmente retornado na criação ou requer outro endpoint)
    // Se não retornar direto, podemos precisar buscar as ofertas do produto.
    const checkoutUrl = productData.checkout_url || productData.payment_link || (productData.offers?.[0]?.checkout_url);

    if (!checkoutUrl) {
      // Tentar buscar ofertas se não veio o link
      const offersResponse = await fetch(`https://api.cakto.com.br/v1/products/${productData.id}/offers`, {
        headers: { 'Authorization': `Bearer ${caktoAccessToken}` }
      });
      const offersData = await offersResponse.json();
      const finalUrl = offersData.data?.[0]?.checkout_url || offersData?.[0]?.checkout_url;
      
      return new Response(JSON.stringify({ 
        success: true, 
        product: productData,
        checkout_url: finalUrl 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      product: productData,
      checkout_url: checkoutUrl 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating Cakto product:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});