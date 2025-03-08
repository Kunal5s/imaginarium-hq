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
    
    // Optimized parameters based on model type for faster generation
    const inferenceSteps = getFastInferenceSteps(model, imageQuality);
    const guidanceScale = getFastGuidanceScale(model, imageQuality);
    const negativePrompt = getNegativePrompt(model);
    
    // Create an array of promises for multiple image generation
    const imagePromises = Array(numberOfImages).fill(0).map(async (_, index) => {
      // Faster parallel requests with minimal delay
      if (index > 0) {
        await new Promise(resolve => setTimeout(resolve, 100 * index));
      }
      
      // Update progress
      if (onProgress) {
        onProgress(Math.round((index / numberOfImages) * 30)); // First 30% is initialization
      }
      
      // Set a reasonable timeout for the fetch operation - reduced for faster experience
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 seconds timeout (reduced from 180s)
      
      try {
        console.log(`Attempting to generate image ${index+1}/${numberOfImages} with model: ${model}`);
        
        // Try up to 2 times with faster backoff (reduced from 3 attempts)
        let response = null;
        let attempt = 0;
        const maxAttempts = 2;
        
        while (attempt < maxAttempts && !response) {
          try {
            if (attempt > 0) {
              console.log(`Retry attempt ${attempt} for model ${model}`);
              // Faster retry with shorter delay
              await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt)));
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
                  seed: Math.floor(Math.random() * 2147483647) // Random seed for variety
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
          onProgress(Math.round(30 + ((index + 0.5) / numberOfImages) * 70)); // Second 70% is processing
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

// New optimized parameter functions for faster generation
const getFastInferenceSteps = (model: string, quality: number): number => {
  // Reduced inference steps for faster generation
  if (model.includes("sdxl-turbo") || model.includes("SSD-1B") || model.includes("dreamshaper-xl-turbo")) {
    return 15 + Math.floor(quality * 0.8); // Faster models need fewer steps
  } else if (model.includes("stable-diffusion-3") || model.includes("RealVisXL") || model.includes("google/")) {
    return 20 + Math.floor(quality * 1.5); // High-quality models with reduced steps
  } else {
    return 18 + Math.floor(quality * 1.2); // Default for other models - faster than before
  }
};

const getFastGuidanceScale = (model: string, quality: number): number => {
  // Optimized guidance scale for faster yet good quality results
  if (model.includes("pix2pix") || model.includes("kandinsky")) {
    return 5.0 + (quality * 0.25); // Models that need higher guidance
  } else if (model.includes("openjourney") || model.includes("google/")) {
    return 6.0 + (quality * 0.2); // Midjourney-like needs higher guidance
  } else {
    return 4.5 + (quality * 0.3); // Default for other models
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
  
  // Handle multiple images returned from updated OpenAI endpoint
  return data.imageUrls || [data.imageUrl]; // Support both formats for backward compatibility
};

// Function to save an image to gallery
export const saveImageToGallery = (selectedImage: string) => {
  if (!selectedImage) return false;
  
  // Get current saved images
  const savedImagesString = localStorage.getItem('generatedImages');
  let savedImages = [];
  
  if (savedImagesString) {
    try {
      const parsed = JSON.parse(savedImagesString);
      
      // Check if using old format (array of strings) or new format (array of objects)
      if (Array.isArray(parsed)) {
        if (parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            // Convert old format to new format
            savedImages = parsed.map(url => ({
              url,
              timestamp: Date.now()
            }));
          } else {
            // Already in new format
            savedImages = parsed;
          }
        }
      }
    } catch (e) {
      console.error("Error parsing saved images:", e);
      savedImages = [];
    }
  }
  
  // Check if image already exists
  const imageExists = savedImages.some(img => 
    typeof img === 'string' ? img === selectedImage : img.url === selectedImage
  );
  
  if (!imageExists) {
    // Add new image with timestamp
    savedImages.push({
      url: selectedImage,
      timestamp: Date.now()
    });
    
    localStorage.setItem('generatedImages', JSON.stringify(savedImages));
    return true;
  }
  
  return false;
};

// Get estimated time based on model - adjusted for faster target time
export const getEstimatedTime = (model: string, numberOfImages: number): number => {
  const modelConfig = AI_MODELS.find(m => m.id === model);
  // Return a more optimistic time estimate (max 50 seconds)
  const baseTime = modelConfig ? Math.min(modelConfig.timeEstimate, 40) : 25;
  return Math.min(baseTime * numberOfImages, 50); // Cap at 50 seconds
};

// Fallback mechanism to get a working model if the selected one fails
export const getFallbackModel = (failedModel: string): string => {
  // Return a fast and reliable model 
  return "stabilityai/sdxl-turbo";
};

// New function to download an image
export const downloadImage = async (imageUrl: string, filename: string = "ai-generated-image") => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Error downloading image:", error);
    return false;
  }
};

// New function to download multiple images
export const downloadAllImages = async (imageUrls: string[], baseName: string = "ai-generated-images") => {
  // Not implemented yet - would need JSZip or similar
  // Since we need to keep this function lightweight, return an array of downloaded status
  const results = await Promise.all(imageUrls.map((url, index) => 
    downloadImage(url, `${baseName}-${index+1}`)
  ));
  
  return results.every(result => result);
};
