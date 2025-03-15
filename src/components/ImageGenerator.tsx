
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
import { Download, DownloadCloud, AlertTriangle, Lock } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  
  const huggingFaceApiKey = "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";

  const [dailyGenerationCount, setDailyGenerationCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [credits, setCredits] = useState(0);
  const FREE_USER_DAILY_LIMIT = 10;
  
  const { toast } = useToast();
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check premium status and credits from Supabase
      const checkPremiumStatus = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('handle-premium', {
            body: { user_id: user.id, operation: 'check' }
          });
          
          if (error) throw error;
          
          if (data?.data) {
            const userStatus = data.data;
            
            // Set premium status
            if (userStatus.premium_status === 'active') {
              setIsPremium(true);
              setCredits(userStatus.credits || 0);
            } else {
              setIsPremium(false);
              setCredits(userStatus.credits || 0);
            }
          }
        } catch (error) {
          console.error("Error checking premium status:", error);
        }
      };
      
      checkPremiumStatus();
      
      // Get daily usage count
      const storedUsage = localStorage.getItem(`image_usage_${user.id}`);
      if (storedUsage) {
        const { count, date } = JSON.parse(storedUsage);
        const today = new Date().toDateString();
        if (date === today) {
          setDailyGenerationCount(count);
        } else {
          localStorage.setItem(`image_usage_${user.id}`, JSON.stringify({ count: 0, date: today }));
          setDailyGenerationCount(0);
        }
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    toast({
      title: "Welcome to our AI Image Generator!",
      description: isAuthenticated 
        ? isPremium 
          ? `Create unlimited images with our premium tools! You have ${credits} credits.`
          : "You can generate up to 10 free images daily. Upgrade to premium for unlimited access!" 
        : "Login to access all features and generate up to 10 free images daily!",
    });
  }, [toast, isAuthenticated, isPremium, credits]);

  const updateUsageCount = () => {
    if (isAuthenticated && user) {
      const newCount = dailyGenerationCount + 1;
      setDailyGenerationCount(newCount);
      localStorage.setItem(`image_usage_${user.id}`, JSON.stringify({
        count: newCount,
        date: new Date().toDateString()
      }));
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to generate images",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!isPremium && dailyGenerationCount >= FREE_USER_DAILY_LIMIT) {
      toast({
        title: "Daily limit reached",
        description: "You've reached your daily limit of 10 free images. Upgrade to Premium for unlimited access!",
        variant: "destructive",
      });
      navigate('/profile');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);
    
    const timeEstimate = Math.min(getEstimatedTime(aiModel, numberOfImages), 50);
    setEstimatedTime(timeEstimate);
    
    try {
      let images: string[] = [];
      
      // If premium user, deduct credits (1 credit per image)
      if (isPremium && credits > 0) {
        const creditsToDeduct = Math.min(numberOfImages, credits);
        
        if (creditsToDeduct < numberOfImages) {
          toast({
            title: "Not enough credits",
            description: `You only have ${credits} credits. Reducing the number of images to generate.`,
            variant: "destructive",
          });
          
          // Adjust the number of images to match available credits
          setNumberOfImages(creditsToDeduct);
        }
      }
      
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
          
          setGenerationMethod("huggingface");
        }
      }
      
      if (generationMethod === "huggingface" || images.length === 0) {
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
          
          if (images.length < numberOfImages) {
            console.log(`Only generated ${images.length}/${numberOfImages} images, attempting to get more...`);
            
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
              numberOfImages,
              imageQuality,
              setGenerationProgress
            );
          } else {
            throw error;
          }
        }
      }
      
      // Update generated images in both state and localStorage with timestamps
      setGeneratedImages(images);
      if (images.length > 0) {
        setSelectedImage(images[0]);
        
        // Save to gallery with timestamps (30 minute expiration)
        const galleryImages = images.map(url => ({
          url,
          timestamp: Date.now(),
          expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes
        }));
        
        // Get existing gallery
        const existingGallery = localStorage.getItem('gallery');
        let gallery = [];
        
        if (existingGallery) {
          try {
            gallery = JSON.parse(existingGallery);
            // Filter out expired images
            gallery = gallery.filter(item => {
              return item.expiresAt > Date.now();
            });
          } catch (e) {
            console.error("Error parsing gallery:", e);
            gallery = [];
          }
        }
        
        // Add new images to gallery
        gallery = [...galleryImages, ...gallery];
        
        // Save updated gallery
        localStorage.setItem('gallery', JSON.stringify(gallery));
      }

      // Update daily usage for non-premium users
      if (!isPremium) {
        updateUsageCount();
      } else if (isPremium && credits > 0) {
        // Deduct credits for premium users
        const creditsUsed = images.length;
        const remainingCredits = Math.max(0, credits - creditsUsed);
        setCredits(remainingCredits);
        
        // Update credits in Supabase
        try {
          await supabase.functions.invoke('handle-premium', {
            body: { 
              user_id: user?.id, 
              operation: 'update_credits',
              credits: remainingCredits
            }
          });
        } catch (error) {
          console.error("Error updating credits:", error);
        }
      }

      toast({
        title: "Success!",
        description: `${images.length} image${images.length > 1 ? 's' : ''} generated successfully.`,
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
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-900 dark:from-red-500 dark:to-red-800 bg-clip-text text-transparent">
          AI Image Generator Pro
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate AI images easily! Just enter your prompt, select an art style, and get high-quality images in under 50 seconds.
          {isAuthenticated ? " Access all premium features with your account." : " Login for more features!"}
        </p>
        
        {isAuthenticated && !isPremium && (
          <div className="text-sm">
            <span className={`font-medium ${dailyGenerationCount >= FREE_USER_DAILY_LIMIT ? "text-red-500" : "text-muted-foreground"}`}>
              Daily generation count: {dailyGenerationCount}/{FREE_USER_DAILY_LIMIT}
            </span>
            {dailyGenerationCount >= FREE_USER_DAILY_LIMIT && (
              <Button
                variant="link"
                onClick={() => navigate('/profile')}
                className="text-red-500 text-sm p-0 h-auto font-medium ml-2"
              >
                Upgrade to Premium
              </Button>
            )}
          </div>
        )}
        
        {!isAuthenticated && (
          <Alert className="bg-red-900/20 border-red-800 max-w-lg mx-auto">
            <Lock className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-500">Login required</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Please login to access all features and generate up to 10 free images daily.
            </AlertDescription>
          </Alert>
        )}
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
        isAuthenticated={isAuthenticated}
        isPremium={isPremium}
        credits={credits}
        dailyGenerationCount={dailyGenerationCount}
      />

      {isGenerating && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Generating images...</span>
            <span>{generationProgress}%</span>
          </div>
          <Progress value={generationProgress} className="h-2 bg-gray-700 dark:bg-gray-800">
            <div className="h-full bg-gradient-to-r from-red-600 to-red-800 rounded-full"></div>
          </Progress>
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
      
      {generatedImages.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button 
            onClick={handleDownloadImage} 
            disabled={!selectedImage || isDownloading}
            className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white"
          >
            <Download className="h-4 w-4" />
            Download Selected Image
          </Button>
          
          {generatedImages.length > 1 && (
            <Button 
              onClick={handleDownloadAllImages} 
              disabled={isDownloading} 
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white"
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
