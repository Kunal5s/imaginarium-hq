
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, size = "1024x1024", n = 1 } = await req.json()
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables')
      throw new Error('OpenAI API key not found')
    }

    console.log('Making request to OpenAI API with prompt:', prompt)

    // Sanitize n parameter to ensure it's within valid range
    const sanitizedN = Math.min(Math.max(1, n), 4); // Ensure n is between 1 and 4
    const requestModel = "dall-e-3"; // Use DALL-E 3 for better quality
    
    const requestBody = {
      model: requestModel,
      prompt,
      n: sanitizedN > 1 ? 1 : sanitizedN, // DALL-E 3 only supports 1 image at a time
      size,
      response_format: 'url',
      quality: "hd", // Request HD quality
    }
    
    console.log('Request body:', JSON.stringify(requestBody))

    // Set timeout for OpenAI API request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
    
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null) || await response.text()
        console.error('OpenAI API error response:', typeof errorData === 'string' ? errorData : JSON.stringify(errorData))
        
        // Check specifically for billing errors
        if (typeof errorData === 'object' && errorData.error?.code === 'billing_hard_limit_reached') {
          return new Response(
            JSON.stringify({ 
              error: "OpenAI account billing limit reached. Please try Hugging Face models instead.",
              errorCode: "BILLING_LIMIT_REACHED"
            }),
            {
              status: 400, // Using 400 instead of 500 for client-side handling
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }
        
        throw new Error(`OpenAI API request failed: ${typeof errorData === 'string' ? errorData : JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      console.log('Successfully generated image with response:', JSON.stringify(data))
      
      if (!data.data?.[0]?.url) {
        console.error('Unexpected response format:', data)
        throw new Error('Invalid response format from OpenAI API')
      }

      return new Response(
        JSON.stringify({ imageUrl: data.data[0].url }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle abort error specially
      if (error.name === 'AbortError') {
        return new Response(
          JSON.stringify({ 
            error: "OpenAI API request timed out. Please try again with a simpler prompt or try Hugging Face models.",
            errorCode: "TIMEOUT"
          }),
          {
            status: 408, // Request Timeout
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
      
      throw error; // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error('Detailed error in generate-image function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
