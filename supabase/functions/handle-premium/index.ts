
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check if this is a webhook request from Polar
    const url = new URL(req.url);
    if (url.pathname.endsWith('/webhook')) {
      return handlePolarWebhook(req);
    }

    const { user_id, operation } = await req.json()
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create a Supabase client with the service role key (from environment variable)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    let result

    if (operation === 'activate') {
      // Set user as premium and add 2000 credits
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({ 
          credits: 2000,
          premium_status: 'active',
          premium_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        })
        .eq('id', user_id)
        .select()

      if (error) throw error
      result = { message: "Premium activated successfully", data }
    } 
    else if (operation === 'check') {
      // Check premium status
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('premium_status, premium_expiry, credits')
        .eq('id', user_id)
        .single()

      if (error) throw error
      
      // Check if premium has expired
      if (data.premium_status === 'active' && data.premium_expiry) {
        const expiryDate = new Date(data.premium_expiry)
        if (expiryDate < new Date()) {
          // Premium has expired, update status
          await supabaseAdmin
            .from('users')
            .update({ premium_status: 'expired' })
            .eq('id', user_id)
          
          data.premium_status = 'expired'
        }
      }
      
      result = { data }
    }
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function handlePolarWebhook(req: Request) {
  try {
    // Verify the Polar webhook signature (if applicable)
    // For production, you should verify the request is actually from Polar
    
    const payload = await req.json();
    console.log('Received webhook payload:', payload);
    
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Process different webhook event types
    const eventType = payload.type;
    
    if (eventType === 'checkout.session.completed') {
      // Handle successful checkout
      const userId = payload.data.client_reference_id; // Assuming you pass the user ID as client_reference_id
      
      if (!userId) {
        throw new Error('User ID not found in webhook payload');
      }
      
      // Activate premium for the user
      const { error } = await supabaseAdmin
        .from('users')
        .update({ 
          credits: 2000,
          premium_status: 'active',
          premium_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      console.log(`Premium activated for user ${userId}`);
    }
    
    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}
