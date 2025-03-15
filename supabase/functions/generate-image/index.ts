
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
    const { prompt, size = "1024x1024", n = 1, model, aspectRatio, artStyle } = await req.json()
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    const huggingFaceApiKey = Deno.env.get('HUGGINGFACE_API_KEY') || "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"

    // Function to generate image with Hugging Face
    const generateWithHuggingFace = async (prompt, model, aspectRatio, quality = 7) => {
      console.log(`Generating image with Hugging Face: Model ${model}, Aspect ratio ${aspectRatio}`)
      
      // Parse aspect ratio for width and height
      let width = 1024;
      let height = 1024;
      
      if (aspectRatio && aspectRatio !== "1:1") {
        const [w, h] = aspectRatio.split(":");
        const ratio = parseInt(w) / parseInt(h);
        
        if (ratio > 1) {
          width = 1024;
          height = Math.round(width / ratio);
        } else {
          height = 1024;
          width = Math.round(height * ratio);
        }
      }
      
      // Enhance prompt with art style if provided
      let enhancedPrompt = prompt;
      if (artStyle) {
        enhancedPrompt = `${prompt}, in the style of ${artStyle}, high quality, detailed, 8k resolution`;
      }
      
      // Adjust API parameters based on model
      const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
      const payload = {
        inputs: enhancedPrompt,
        parameters: {
          width: width,
          height: height,
          num_inference_steps: 20 + (quality * 5),
          guidance_scale: 7.5,
          negative_prompt: "blurry, bad quality, distorted, disfigured, low resolution"
        }
      };
      
      console.log(`Making request to ${apiUrl} with payload:`, JSON.stringify(payload));
      
      // Get image from Hugging Face
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${huggingFaceApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      // Handle error if the model is not ready or other issues
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Hugging Face API error: ${response.status} - ${errorText}`);
        
        // If model is loading, return special error
        if (errorText.includes("loading") || errorText.includes("currently loading")) {
          throw new Error(`Model is still loading. Please try again in a moment. (${model})`);
        }
        
        throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
      }
      
      // Convert the binary response to base64
      const buffer = await response.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      return `data:image/jpeg;base64,${base64}`;
    };

    if (!openAIApiKey && generationMethod === "openai") {
      console.error('OpenAI API key not found in environment variables')
      throw new Error('OpenAI API key not found')
    }

    console.log('Making request to generate image with prompt:', prompt)
    
    // Determine if we're using OpenAI or Hugging Face
    const generationMethod = model ? "huggingface" : "openai";
    
    if (generationMethod === "huggingface") {
      try {
        // Generate multiple images in parallel if needed
        const imagePromises = [];
        const sanitizedN = Math.min(Math.max(1, n), 6); // Limit to 6 images max
        
        for (let i = 0; i < sanitizedN; i++) {
          imagePromises.push(generateWithHuggingFace(prompt, model, aspectRatio));
        }
        
        const results = await Promise.all(imagePromises);
        console.log(`Successfully generated ${results.length} images with Hugging Face`);
        
        return new Response(
          JSON.stringify({ imageUrls: results }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('Error generating with Hugging Face:', error);
        throw error;
      }
    } else {
      // Sanitize n parameter to ensure it's within valid range (1-4)
      const sanitizedN = Math.min(Math.max(1, n), 4);
      
      // For DALL-E 3, we need to make multiple requests since it only supports 1 image at a time
      if (sanitizedN > 1) {
        const imageUrls = [];
        const totalRequests = sanitizedN;
        
        // Make multiple requests in parallel
        const requests = Array.from({ length: totalRequests }).map(async (_, i) => {
          try {
            const requestBody = {
              model: "dall-e-3",
              prompt,
              n: 1, // DALL-E 3 only supports 1 image at a time
              size,
              response_format: 'url',
              quality: "standard", // Use standard quality for faster generation
            }
            
            console.log(`Making request ${i+1}/${totalRequests}:`, JSON.stringify(requestBody));
            
            const response = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            });
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => null) || await response.text();
              console.error(`Request ${i+1} failed:`, typeof errorData === 'string' ? errorData : JSON.stringify(errorData));
              return null;
            }
            
            const data = await response.json();
            if (data.data?.[0]?.url) {
              return data.data[0].url;
            }
            return null;
          } catch (error) {
            console.error(`Request ${i+1} error:`, error);
            return null;
          }
        });
        
        const results = await Promise.all(requests);
        const validUrls = results.filter(url => url !== null);
        
        if (validUrls.length === 0) {
          throw new Error("Failed to generate any images");
        }
        
        console.log(`Successfully generated ${validUrls.length} images`);
        
        return new Response(
          JSON.stringify({ imageUrls: validUrls }), // Return array of URLs
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      } else {
        // Single image request (original flow)
        const requestModel = "dall-e-3";
        
        const requestBody = {
          model: requestModel,
          prompt,
          n: 1,
          size,
          response_format: 'url',
          quality: "standard", // Use standard quality for faster generation
        }
        
        console.log('Request body:', JSON.stringify(requestBody))
    
        // Set timeout for OpenAI API request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 50000); // 50 second timeout
        
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
            JSON.stringify({ imageUrls: [data.data[0].url] }), // Consistent response format with array
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
      }
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
