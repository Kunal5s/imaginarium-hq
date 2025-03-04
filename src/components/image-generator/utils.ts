
import { supabase } from "@/integrations/supabase/client";
import { AI_MODELS } from "./constants";

// Helper function to convert aspect ratio to width and height
export const getWidthHeightFromAspectRatio = (aspectRatio: string): [number, number] => {
  const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
  
  // Base size to maintain reasonable dimensions, max 1024px for any dimension
  const baseSize = 1024;
  
  // Calculate dimensions while maintaining the aspect ratio
  if (widthRatio > heightRatio) {
    const width = baseSize;
    const height = Math.round(baseSize * (heightRatio / widthRatio));
    return [width, height];
  } else {
    const height = baseSize;
    const width = Math.round(baseSize * (widthRatio / heightRatio));
    return [width, height];
  }
};

// Function to generate images using Hugging Face API with enhanced error handling
export const generateImageWithHuggingFace = async (
  prompt: string, 
  model: string, 
  apiKey: string, 
  aspectRatio: string,
  numberOfImages: number = 1,
  imageQuality: number = 7,
  onProgress?: (progress: number) => void
) => {
  try {
    const [width, height] = getWidthHeightFromAspectRatio(aspectRatio);
    
    // Create an array of promises for multiple image generation
    const imagePromises = Array(numberOfImages).fill(0).map(async (_, index) => {
      // Add a slight delay between requests to avoid rate limiting
      if (index > 0) {
        await new Promise(resolve => setTimeout(resolve, 300 * index));
      }
      
      // Calculate appropriate parameters based on model and quality
      const inferenceSteps = getInferenceSteps(model, imageQuality);
      const guidanceScale = getGuidanceScale(model, imageQuality);
      const negativePrompt = getNegativePrompt(model);
      
      // Update progress
      if (onProgress) {
        onProgress(Math.round((index / numberOfImages) * 50)); // First 50% is initialization
      }
      
      // Set a reasonable timeout for the fetch operation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minutes timeout
      
      try {
        console.log(`Attempting to generate image with model: ${model}`);
        
        // Try up to 3 times with exponential backoff
        let response = null;
        let attempt = 0;
        const maxAttempts = 3;
        
        while (attempt < maxAttempts && !response) {
          try {
            if (attempt > 0) {
              console.log(`Retry attempt ${attempt} for model ${model}`);
              await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
            }
            
            response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ 
                inputs: prompt,
                parameters: {
                  width,
                  height,
                  num_inference_steps: inferenceSteps,
                  guidance_scale: guidanceScale,
                  negative_prompt: negativePrompt,
                  num_images_per_prompt: 1, // Generate one at a time to avoid timeout
                }
              }),
              signal: controller.signal
            });
            
            // Check if the response is ok, otherwise try again
            if (!response.ok) {
              const errorData = await response.json().catch(() => null);
              console.log(`Error from model ${model}:`, errorData);
              
              // If model doesn't exist, exit retry loop immediately
              if (
                errorData?.error?.includes("does not exist") || 
                errorData?.error?.includes("Model not found")
              ) {
                throw new Error(`Model ${model} does not exist. Please try a different model.`);
              }
              
              // For busy models or rate limiting, retry
              if (response.status === 429 || response.status === 503 || response.status === 500) {
                response = null; // Reset response to trigger next retry
                attempt++;
                continue;
              }
              
              throw new Error(errorData?.error || `Failed with status ${response.status}`);
            }
          } catch (e) {
            if (attempt === maxAttempts - 1) throw e;
            response = null;
            attempt++;
          }
        }
        
        if (!response || !response.ok) {
          throw new Error(`Failed to generate image with model ${model} after multiple attempts`);
        }
        
        clearTimeout(timeoutId);
        
        // Update progress
        if (onProgress) {
          onProgress(Math.round(50 + ((index + 0.5) / numberOfImages) * 50)); // Second 50% is processing
        }

        const blob = await response.blob();
        
        // Update progress complete
        if (onProgress && index === numberOfImages - 1) {
          onProgress(100);
        }
        
        return URL.createObjectURL(blob);
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    });

    // Try to get as many successful images as possible
    const results = await Promise.allSettled(imagePromises);
    const successfulImages = results
      .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
      .map(result => result.value);
    
    if (successfulImages.length === 0) {
      // If all attempts failed, throw the first error
      const firstError = results.find(result => result.status === 'rejected') as PromiseRejectedResult;
      throw firstError.reason || new Error(`Failed to generate any images with model ${model}`);
    }
    
    return successfulImages;
  } catch (error) {
    console.error("Error generating images:", error);
    throw error;
  }
};

// Model-specific parameter optimization functions
const getInferenceSteps = (model: string, quality: number): number => {
  // Base number of steps by model type
  if (model.includes("sdxl-turbo") || model.includes("SSD-1B") || model.includes("dreamshaper-xl-turbo")) {
    return 20 + (quality * 1.5); // Faster models need fewer steps
  } else if (model.includes("stable-diffusion-3") || model.includes("RealVisXL") || model.includes("google/")) {
    return 35 + (quality * 3); // High-quality models need more steps
  } else {
    return 25 + (quality * 2); // Default for other models
  }
};

const getGuidanceScale = (model: string, quality: number): number => {
  // Customize guidance scale by model type
  if (model.includes("pix2pix") || model.includes("kandinsky")) {
    return 7.0 + (quality * 0.35); // Models that need higher guidance
  } else if (model.includes("openjourney") || model.includes("google/")) {
    return 9.0 + (quality * 0.3); // Midjourney-like needs higher guidance
  } else {
    return 5.5 + (quality * 0.5); // Default for other models
  }
};

const getNegativePrompt = (model: string): string => {
  // Base negative prompt for all models
  const baseNegative = "blurry, distorted, low quality, ugly, duplicate, poorly drawn, low resolution, watermark";
  
  // Add model-specific negatives
  if (model.includes("anime") || model.includes("Animagine")) {
    return `${baseNegative}, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, artist name`;
  } else if (model.includes("RealVisXL") || model.includes("photorealistic")) {
    return `${baseNegative}, deformed, unrealistic, grainy, noisy, unnatural colors, unnatural lighting, overexposed, underexposed`;
  } else {
    return baseNegative;
  }
};

// Function to generate images using OpenAI API via Supabase function
export const generateImageWithOpenAI = async (
  prompt: string,
  size: string,
  numberOfImages: number = 1,
  onProgress?: (progress: number) => void
) => {
  // Start progress at 10%
  if (onProgress) onProgress(10);
  
  const { data, error: supabaseError } = await supabase.functions.invoke('generate-image', {
    body: { 
      prompt: prompt.trim(),
      size: size,
      n: numberOfImages
    }
  });

  // Update progress to 90%
  if (onProgress) onProgress(90);

  if (supabaseError) throw supabaseError;
  
  if (data.error) {
    if (data.errorCode === "BILLING_LIMIT_REACHED") {
      throw new Error("The OpenAI account has reached its billing limit. Please try Hugging Face models instead.");
    } else {
      throw new Error(data.error);
    }
  }
  
  // Complete progress
  if (onProgress) onProgress(100);
  
  return [data.imageUrl];
};

// Function to save an image to gallery
export const saveImageToGallery = (selectedImage: string) => {
  if (!selectedImage) return false;
  
  // In a real app, you would save to a database
  // For now, we'll use localStorage as a demonstration
  const savedImages = JSON.parse(localStorage.getItem('generatedImages') || '[]');
  if (!savedImages.includes(selectedImage)) {
    savedImages.push(selectedImage);
    localStorage.setItem('generatedImages', JSON.stringify(savedImages));
    return true;
  }
  
  return false;
};

// Get estimated time based on model
export const getEstimatedTime = (model: string, numberOfImages: number): number => {
  const modelConfig = AI_MODELS.find(m => m.id === model);
  if (!modelConfig) return 30 * numberOfImages; // Default estimate
  
  return modelConfig.timeEstimate * numberOfImages;
};

// Fallback mechanism to get a working model if the selected one fails
export const getFallbackModel = (failedModel: string): string => {
  // Return a reliable model that's known to work well
  return "stabilityai/stable-diffusion-xl-base-1.0";
};

