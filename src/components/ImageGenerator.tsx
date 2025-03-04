
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import GeneratorForm from "./image-generator/GeneratorForm";
import ImagePreview from "./image-generator/ImagePreview";
import { generateImageWithHuggingFace, generateImageWithOpenAI } from "./image-generator/utils";

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
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  // Updated Hugging Face API key
  const huggingFaceApiKey = "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";

  // No longer check authentication status - it's now free to try!
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Welcome to our AI Image Generator!",
        description: "No sign-up required! Your images will be saved for 30 minutes.",
      });
    }
  }, [isAuthenticated, toast]);

  const handleGenerate = async () => {
    // Remove authentication check
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      let images: string[] = [];
      
      if (generationMethod === "openai") {
        images = await generateImageWithOpenAI(prompt.trim(), imageSize, numberOfImages);
      } else {
        // Hugging Face API generation
        let enhancedPrompt = prompt.trim();
        if (artStyle) {
          enhancedPrompt = `${enhancedPrompt}, in the style of ${artStyle}, high quality, detailed, 8k resolution`;
        }

        images = await generateImageWithHuggingFace(
          enhancedPrompt, 
          aiModel, 
          huggingFaceApiKey,
          aspectRatio,
          numberOfImages,
          imageQuality
        );
      }
      
      setGeneratedImages(images);
      if (images.length > 0) {
        setSelectedImage(images[0]);
      }

      toast({
        title: "Success!",
        description: `${numberOfImages} image${numberOfImages > 1 ? 's' : ''} generated successfully. Available for 30 minutes.`,
      });
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error.message || "Failed to generate image");
      toast({
        title: "Error",
        description: `Failed to generate image: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
          AI Image Generator Pro
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate AI images easily! Just enter your prompt, select an art style, and get high-quality images instantly.
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

      <ImagePreview 
        generatedImages={generatedImages}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default ImageGenerator;
