
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import GeneratorForm from "./image-generator/GeneratorForm";
import ImagePreview from "./image-generator/ImagePreview";
import { 
  generateImageWithHuggingFace, 
  generateImageWithOpenAI, 
  getEstimatedTime,
  getFallbackModel,
  downloadImage,
  downloadAllImages
} from "./image-generator/utils";
import { Progress } from "@/components/ui/progress";
import { AI_MODELS } from "./image-generator/constants";
import { Button } from "@/components/ui/button";
import { Download, DownloadCloud } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState("1024x1024");
  const [error, setError] = useState<string | null>(null);
  const [aiModel, setAiModel] = useState("stabilityai/stable-diffusion-xl-base-1.0");
  const [artStyle, setArtStyle] = useState("");
  const [generationMethod, setGenerationMethod] = useState<"openai" | "huggingface">("huggingface");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [imageQuality, setImageQuality] = useState(7);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  
  // Updated Hugging Face API key
  const huggingFaceApiKey = "hf_GgldukYybURdPGrMDrTWJVCMcuRw";

  // Welcome message
  useEffect(() => {
    toast({
      title: "Welcome to our AI Image Generator!",
      description: "No sign-up required! Your images will be saved for 30 minutes.",
    });
  }, [toast]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);
    
    // Calculate and display estimated time - ensure it's under 50 seconds
    const timeEstimate = Math.min(getEstimatedTime(aiModel, numberOfImages), 50);
    setEstimatedTime(timeEstimate);
    
    // Show toast for long-running generations
    if (timeEstimate > 30) {
      toast({
        title: "Generating your images...",
        description: `This may take up to ${timeEstimate} seconds to create ${numberOfImages} image${numberOfImages > 1 ? 's' : ''}. Please be patient.`,
      });
    }
    
    try {
      let images: string[] = [];
      
      if (generationMethod === "openai") {
        try {
          images = await generateImageWithOpenAI(
            prompt.trim(), 
            imageSize, 
            numberOfImages,
            setGenerationProgress
          );
        } catch (err) {
          console.error("OpenAI generation failed:", err);
          toast({
            title: "OpenAI generation failed",
            description: "Falling back to Hugging Face models.",
            variant: "destructive",
          });
          
          // Switch to Hugging Face as fallback
          setGenerationMethod("huggingface");
        }
      }
      
      // If OpenAI failed or if Hugging Face was selected initially
      if (generationMethod === "huggingface" || images.length === 0) {
        // Hugging Face API generation
        let enhancedPrompt = prompt.trim();
        if (artStyle) {
          enhancedPrompt = `${enhancedPrompt}, in the style of ${artStyle}, high quality, detailed, 8k resolution`;
        }

        try {
          images = await generateImageWithHuggingFace(
            enhancedPrompt, 
            aiModel, 
            huggingFaceApiKey,
            aspectRatio,
            numberOfImages,
            imageQuality,
            setGenerationProgress
          );
          
          // Verify we got the correct number of images
          if (images.length < numberOfImages) {
            console.log(`Only generated ${images.length}/${numberOfImages} images, attempting to get more...`);
            
            // Try to generate more images to reach the requested count
            const remainingCount = numberOfImages - images.length;
            if (remainingCount > 0) {
              const moreImages = await generateImageWithHuggingFace(
                enhancedPrompt, 
                aiModel, 
                huggingFaceApiKey,
                aspectRatio,
                remainingCount,
                imageQuality,
                setGenerationProgress
              );
              
              images = [...images, ...moreImages];
            }
          }
        } catch (error) {
          console.error('Error in primary model, trying fallback:', error);
          
          // If first attempt failed, try with a fallback model
          if (retryCount === 0) {
            setRetryCount(1);
            const fallbackModel = getFallbackModel(aiModel);
            
            toast({
              title: "Trying alternative model",
              description: "The selected model is currently unavailable. Trying a more reliable model.",
            });
            
            images = await generateImageWithHuggingFace(
              enhancedPrompt, 
              fallbackModel, 
              huggingFaceApiKey,
              aspectRatio,
              numberOfImages, // Try to generate the full requested number
              imageQuality,
              setGenerationProgress
            );
          } else {
            throw error; // If fallback also failed, throw the error
          }
        }
      }
      
      setGeneratedImages(images);
      if (images.length > 0) {
        setSelectedImage(images[0]);
      }

      toast({
        title: "Success!",
        description: `${images.length} image${images.length > 1 ? 's' : ''} generated successfully. Available for 30 minutes.`,
      });
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error.message || "Failed to generate image");
      toast({
        title: "Error",
        description: `Failed to generate images. Please try a different model or prompt.`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setEstimatedTime(0);
      setRetryCount(0);
    }
  };
  
  // Handle downloading the selected image
  const handleDownloadImage = async () => {
    if (!selectedImage) return;
    
    setIsDownloading(true);
    try {
      const success = await downloadImage(selectedImage, `ai-image-${Date.now()}`);
      if (success) {
        toast({
          title: "Image downloaded successfully",
        });
      } else {
        throw new Error("Failed to download image");
      }
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Handle downloading all generated images
  const handleDownloadAllImages = async () => {
    if (generatedImages.length === 0) return;
    
    setIsDownloading(true);
    try {
      const success = await downloadAllImages(generatedImages, `ai-images-batch-${Date.now()}`);
      if (success) {
        toast({
          title: "All images downloaded successfully",
        });
      } else {
        throw new Error("Failed to download some images");
      }
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download all images. Please try downloading individually.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
          AI Image Generator Pro
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate AI images easily! Just enter your prompt, select an art style, and get high-quality images in under 50 seconds.
          No sign-up required! Your images will be saved for 30 minutes.
        </p>
      </div>

      <GeneratorForm 
        prompt={prompt}
        setPrompt={setPrompt}
        isGenerating={isGenerating}
        generationMethod={generationMethod}
        setGenerationMethod={setGenerationMethod}
        aiModel={aiModel}
        setAiModel={setAiModel}
        imageSize={imageSize}
        setImageSize={setImageSize}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        numberOfImages={numberOfImages}
        setNumberOfImages={setNumberOfImages}
        imageQuality={imageQuality}
        setImageQuality={setImageQuality}
        artStyle={artStyle}
        setArtStyle={setArtStyle}
        error={error}
        onGenerate={handleGenerate}
      />

      {isGenerating && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Generating images...</span>
            <span>{generationProgress}%</span>
          </div>
          <Progress value={generationProgress} className="h-2" />
          {estimatedTime > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Estimated time: {estimatedTime} seconds. 
              {estimatedTime > 30 && " For highest quality results."}
            </p>
          )}
        </div>
      )}

      <ImagePreview 
        generatedImages={generatedImages}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        isGenerating={isGenerating}
      />
      
      {/* Download buttons */}
      {generatedImages.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button 
            onClick={handleDownloadImage} 
            disabled={!selectedImage || isDownloading}
            className="flex items-center gap-2"
            variant={theme === "dark" ? "outline" : "default"}
          >
            <Download className="h-4 w-4" />
            Download Selected Image
          </Button>
          
          {generatedImages.length > 1 && (
            <Button 
              onClick={handleDownloadAllImages} 
              disabled={isDownloading} 
              className="flex items-center gap-2" 
              variant={theme === "dark" ? "outline" : "secondary"}
            >
              <DownloadCloud className="h-4 w-4" />
              Download All Images
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
