
import { supabase } from "@/integrations/supabase/client";

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
  imageQuality: number = 7
) => {
  try {
    const [width, height] = getWidthHeightFromAspectRatio(aspectRatio);
    
    // Create an array of promises for multiple image generation
    const imagePromises = Array(numberOfImages).fill(0).map(async (_, index) => {
      // Add a slight delay between requests to avoid rate limiting
      if (index > 0) {
        await new Promise(resolve => setTimeout(resolve, 300 * index));
      }
      
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
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
            num_inference_steps: 30 + (imageQuality * 2), // Scale steps with quality
            guidance_scale: 5.5 + (imageQuality * 0.5), // Scale guidance with quality
            negative_prompt: "blurry, distorted, low quality, ugly, duplicate, poorly drawn, low resolution",
          }
        }),
      });

      if (!response.ok) {
        // Try to get error message from response
        try {
          const error = await response.json();
          if (error.error && error.error.includes("does not exist")) {
            throw new Error(`Model ${model} does not exist. Please try a different model.`);
          }
          throw new Error(error.error || `Failed to generate image with model ${model}`);
        } catch (e) {
          throw new Error(`Failed to generate image with model ${model}: ${response.status} ${response.statusText}`);
        }
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    });

    // Return all generated images
    return await Promise.all(imagePromises);
  } catch (error) {
    console.error("Error generating images:", error);
    throw error;
  }
};

// Function to generate images using OpenAI API via Supabase function
export const generateImageWithOpenAI = async (
  prompt: string,
  size: string,
  numberOfImages: number = 1
) => {
  const { data, error: supabaseError } = await supabase.functions.invoke('generate-image', {
    body: { 
      prompt: prompt.trim(),
      size: size,
      n: numberOfImages
    }
  });

  if (supabaseError) throw supabaseError;
  
  if (data.error) {
    if (data.errorCode === "BILLING_LIMIT_REACHED") {
      throw new Error("The OpenAI account has reached its billing limit. Please try Hugging Face models instead.");
    } else {
      throw new Error(data.error);
    }
  }
  
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
