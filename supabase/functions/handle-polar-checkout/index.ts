
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Polar } from "npm:@polar-sh/sdk";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const POLAR_ACCESS_TOKEN = Deno.env.get('POLAR_ACCESS_TOKEN');
    
    if (!POLAR_ACCESS_TOKEN) {
      throw new Error("POLAR_ACCESS_TOKEN is not configured");
    }

    const polar = new Polar({
      accessToken: POLAR_ACCESS_TOKEN,
    });

    // Create a checkout session with the provided product ID
    const checkout = await polar.checkouts.create({
      productId: "58e1c9e3-f2ad-48aa-b255-a095d11e05ec",
    });

    return new Response(
      JSON.stringify({ url: checkout.url }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error creating checkout:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    );
  }
});
