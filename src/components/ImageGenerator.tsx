<lov-code>
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wand2, ImageIcon, Settings2, AlertTriangle, Palette, BookOpen, Save, Grid2X2, Grid3X3, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// AI Models from Hugging Face
const AI_MODELS = [
  { id: "stabilityai/stable-diffusion-xl-base-1.0", name: "Stable Diffusion XL 1.5+", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "4:1", "1:4", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "runwayml/stable-diffusion-v1-5", name: "SD Lightning V2", aspectRatios: ["1:1", "4:3", "3:4", "16:9", "9:16", "2:3", "3:2", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "5:4", "4:5", "16:10", "10:16", "8:5", "5:8", "7:4", "4:7"] },
  { id: "prompthero/openjourney", name: "OpenJourney V4 Pro", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "dreamshaper/dreamshaper-xl", name: "DreamShaper XL Pro", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "segmind/SSD-1B", name: "SDXL Turbo Pro", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "stabilityai/sdxl-turbo", name: "SDXL Turbo", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "dataautogpt3/RealVisXL-V4", name: "RealVisXL V4.0 UHD", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "deepfloyd/IF-I-XL-v1.0", name: "DeepFloyd IF Ultra", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16"] },
  { id: "lllyasviel/sd-controlnet-depth", name: "ControlNet + SDXL", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "playgroundai/playground-v2.5-1024px-aesthetic", name: "Playground V2.5 Ultra", aspectRatios: ["1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "stabilityai/stable-diffusion-3-medium", name: "Stable Diffusion 3 Medium", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "ByteDance/FLUX-1-schnell", name: "FLUX.1-schnell MAX", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
  { id: "PixArt-alpha/PixArt-XL-2-1024-MS", name: "PixArt-Σ Ultra", aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "9:21", "2:1", "1:2", "3:1", "1:3", "16:10", "10:16", "8:5", "5:8"] },
];

// Art Style Categories and Styles
const ART_STYLE_CATEGORIES = [
  {
    name: "Cinematic & Realism",
    styles: [
      "Hyper-Realistic", "Photorealism", "8K Ultra-Realistic", "Hollywood Cinematic",
      "IMAX Film Style", "Movie Poster Art", "Noir Film Aesthetic", "Classic Black & White",
      "Vintage Film Look", "HDR Cinematic"
    ]
  },
  {
    name: "Traditional & Fine Art",
    styles: [
      "Renaissance Oil Painting", "Baroque Masterpiece", "Impressionist Brush Strokes",
      "Watercolor Fantasy", "Detailed Ink Sketch", "Charcoal Drawing", "Pastel Soft Art",
      "Surrealism Dreamlike", "Ukiyo-e Japanese Print", "Fine Art Portrait"
    ]
  },
  {
    name: "Sci-Fi & Fantasy",
    styles: [
      "Sci-Fi Concept Art", "Futuristic Cyberpunk", "Fantasy Epic Painting", "Alien Worlds",
      "Mythological Beasts", "Dark Fantasy Realism", "Dystopian Ruins", "AI Surrealism",
      "Space Odyssey", "Steampunk Illustrations"
    ]
  },
  {
    name: "Digital & Modern",
    styles: [
      "Modern Digital Art", "Abstract Geometric", "3D Isometric", "Low Poly 3D",
      "Holographic Glitch", "Neon Cyber Aesthetic", "Light Painting", "Vaporwave Dreamscape",
      "Metaverse Augmented Reality", "Pixel Art Retro"
    ]
  },
  {
    name: "Gaming & Anime",
    styles: [
      "Advanced Anime", "Anime Cyberpunk", "Dark Manga Noir", "Chibi Kawaii",
      "Cel-Shaded Cartoon", "Video Game Concept", "Fantasy RPG Art", "Game UI Design",
      "Esports Logo Style", "Comic Book Heroic"
    ]
  },
  {
    name: "Nature & Landscape",
    styles: [
      "Mystical Forest Painting", "Underwater Fantasy World", "Majestic Mountain Realism",
      "Cosmic Nebula Art", "Fantasy Waterfalls", "Dreamy Sunset Illustration",
      "Arctic Ice Wilderness", "Alien Planet Terrain", "Desert Mirage Aesthetic",
      "Bioluminescent Jungle"
    ]
  },
  {
    name: "Experimental & Conceptual",
    styles: [
      "AI Dreamscape", "Fractal Art", "Cubism Chaos", "Expressionist Vision",
      "Surreal Collage", "Kaleidoscope Patterns", "Smoke & Ink Fluidity",
      "Optical Illusion Effects", "Datamosh Glitch Aesthetic", "Psychedelic Visionary"
    ]
  },
  {
    name: "Mythical & Ancient",
    styles: [
      "Egyptian Hieroglyphic Art", "Aztec Mythology", "Ancient Greek Fresco",
      "Tribal Symbolism", "Medieval Tapestry", "Samurai Warrior Paintings",
      "Norse Mythology Visuals", "Gothic Architecture Illustrations", "Roman Mosaic Artwork",
      "Celtic Folklore"
    ]
  },
  {
    name: "Futuristic & AI-Generated",
    styles: [
      "AI Hyper-Evolved Creativity", "Quantum Art", "Neural Network Patterns",
      "AI Digital Dystopia", "Techno-Organic Fusion", "Post-Human Concept",
      "Digital Consciousness", "Virtual Reality Art", "AI Universe Generator",
      "Nano-Tech Artworks"
    ]
  }
];

// Function to generate images using Hugging Face API with enhanced error handling
const generateImageWithHuggingFace = async (
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

// Helper function to convert aspect ratio to width and height
const getWidthHeightFromAspectRatio = (aspectRatio: string): [number, number] => {
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

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState("1024x1024");
  const [error, setError] = useState<string | null>(null);
  const [aiModel, setAiModel] = useState("stabilityai/stable-diffusion-xl-base-1.0");
  const [artStyle, setArtStyle] = useState("");
  const [artStylesDialogOpen, setArtStylesDialogOpen] = useState(false);
  const [generationMethod, setGenerationMethod] = useState<"openai" | "huggingface">("huggingface");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [imageQuality, setImageQuality] = useState(7);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Available aspect ratios for the selected model
  const availableAspectRatios = AI_MODELS.find(model => model.id === aiModel)?.aspectRatios || ["1:1"];

  // Set default aspect ratio when model changes
  useEffect(() => {
    if (availableAspectRatios.includes(aspectRatio)) return;
    setAspectRatio(availableAspectRatios[0]);
  }, [aiModel, availableAspectRatios]);

  // Check authentication status
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the image generator",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, toast]);

  // Hugging Face API key
  const huggingFaceApiKey = "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";

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the image generator",
        variant: "destructive",
      });
      return;
    }

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
      if (generationMethod === "openai") {
        const { data, error: supabaseError } = await supabase.functions.invoke('generate-image', {
          body: { 
            prompt: prompt.trim(),
            size: imageSize,
            n: numberOfImages
          }
        });

        if (supabaseError) throw supabaseError;
        
        if (data.error) {
          if (data.errorCode === "BILLING_LIMIT_REACHED") {
            setError("The OpenAI account has reached its billing limit. Please try Hugging Face models instead.");
            throw new Error(data.error);
          } else {
            throw new Error(data.error);
          }
        }
        
        setGeneratedImages([data.imageUrl]);
        setSelectedImage(data.imageUrl);
      } else {
        // Hugging Face API generation
        let enhancedPrompt = prompt.trim();
        if (artStyle) {
          enhancedPrompt = `${enhancedPrompt}, in the style of ${artStyle}, high quality, detailed, 8k resolution`;
        }

        const images = await generateImageWithHuggingFace(
          enhancedPrompt, 
          aiModel, 
          huggingFaceApiKey,
          aspectRatio,
          numberOfImages,
          imageQuality
        );
        
        setGeneratedImages(images);
        if (images.length > 0) {
          setSelectedImage(images[0]);
        }
      }

      toast({
        title: "Success!",
        description: `${numberOfImages} image${numberOfImages > 1 ? 's' : ''} generated successfully.`,
      });
    } catch (error) {
      console.error('Error generating image:', error);
      if (!error.message?.includes("billing_limit_reached")) {
        toast({
          title: "Error",
          description: `Failed to generate image with ${generationMethod === "openai" ? "OpenAI" : "Hugging Face"}. ${error.message}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const selectArtStyle = (style: string) => {
    setArtStyle(style);
    setArtStylesDialogOpen(false);
    toast({
      title: "Art Style Selected",
      description: `Selected style: ${style}`,
    });
  };

  const saveImageToGallery = () => {
    if (!selectedImage) return;
    
    // In a real app, you would save to a database
    // For now, we'll use localStorage as a demonstration
    const savedImages = JSON.parse(localStorage.getItem('generatedImages') || '[]');
    if (!savedImages.includes(selectedImage)) {
      savedImages.push(selectedImage);
      localStorage.setItem('generatedImages', JSON.stringify(savedImages));
      
      toast({
        title: "Image Saved",
        description: "Image has been saved to your gallery",
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
          AI Image Generator Pro
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transform your ideas into stunning visuals with our advanced AI technology.
          Create unique, high-quality images in seconds.
        </p>
      </div>

      {!isAuthenticated && (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to sign in before using the image generator.
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')} 
              className="ml-2"
            >
              Sign In
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={generationMethod}
                onValueChange={(value: "openai" | "huggingface") => setGenerationMethod(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select generation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="huggingface">Hugging Face (Recommended)</SelectItem>
                  <SelectItem value="openai">OpenAI DALL-E</SelectItem>
                </SelectContent>
              </Select>
              
              {generationMethod === "huggingface" && (
                <Select
                  value={aiModel}
                  onValueChange={setAiModel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {generationMethod === "openai" && (
                <Select
                  value={imageSize}
                  onValueChange={setImageSize}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1024x1024">1024 × 1024</SelectItem>
                    <SelectItem value="1024x1792">1024 × 1792</SelectItem>
                    <SelectItem value="1792x1024">1792 × 1024</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generationMethod === "huggingface" && (
                <>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger>
                      <SelectValue placeholder="Aspect Ratio" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      <SelectItem value="1:1">1:1 Square</SelectItem>
                      <SelectItem value="16:9">16:9 Landscape</SelectItem>
                      <SelectItem value="9:16">9:16 Portrait</SelectItem>
                      <SelectItem value="4:3">4:3 Standard</SelectItem>
                      <SelectItem value="3:4">3:4 Portrait</SelectItem>
                      <SelectItem value="3:2">3:2 Photo</SelectItem>
                      <SelectItem value="2:3">2:3 Portrait</SelectItem>
                      <SelectItem value="21:9">21:9 Cinematic</SelectItem>
                      <SelectItem value="9:21">9:21 Tall</SelectItem>
                      <SelectItem value="2:1">2:1 Panorama</SelectItem>
                      <SelectItem value="1:2">1:2 Tall</SelectItem>
                      <SelectItem value="4:5">4:5 Instagram</SelectItem>
                      <SelectItem value="5:4">5:4 Desktop</SelectItem>
                      <SelectItem value="16:10">16:10 Laptop</SelectItem>
                      <SelectItem value="10:16">10:16 Phone</SelectItem>
                      <SelectItem value="8:5">8:5 Widescreen</SelectItem>
                      <SelectItem value="5:8">5:8 Book</SelectItem>
                      <SelectItem value="3:1">3:1 Banner</SelectItem>
                      <SelectItem value="1:3">1:3 Skyscraper</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={numberOfImages.toString()}
                    onValueChange={(value) => setNumberOfImages(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Number of Images" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Image</SelectItem>
                      <SelectItem value="2">2 Images</SelectItem>
                      <SelectItem value="3">3 Images</SelectItem>
                      <SelectItem value="4">4 Images</SelectItem>
                      <SelectItem value="6">6 Images</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
              
              {generationMethod === "huggingface" && (
                <Dialog open={artStylesDialogOpen} onOpenChange={setArtStylesDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto">
                      <Palette className="h-4 w-4 mr-2" />
                      {artStyle ? `Style: ${artStyle}` : "Select Art Style"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Choose an Art Style</DialogTitle>
                      <DialogDescription>
                        Select from over 100 unique AI art styles to enhance your image generation
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Accordion type="single" collapsible className="w-full">
                      {ART_STYLE_CATEGORIES.map((category, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`}>
                          <AccordionTrigger className="text-lg font-medium">
                            {category.name}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {category.styles.map((style, styleIdx) => (
                                <Button 
                                  key={styleIdx} 
                                  variant="outline" 
                                  onClick={() => selectArtStyle(style)}
                                  className="justify-start h-auto py-2 text-sm"
                                >
                                  {style}
                                </Button>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <div className="space-y-2">
              <Input
                placeholder="Describe your imagination in detail... (e.g., 'A magical forest with glowing mushrooms and fairies')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1"
              />
              
              {artStyle && (
                <Badge variant="outline" className="mr-1 mb-1 p-1.5">
                  Style: {artStyle}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setArtStyle("")}
                  >
                    ×
                  </Button>
                </Badge>
              )}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !isAuthenticated}
              className="w-full md:w-auto relative overflow-hidden group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <span className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                {isGenerating ? `Generating ${numberOfImages} image${numberOfImages > 1 ? 's' : ''}...` : `Generate ${numberOfImages} Image${numberOfImages > 1 ? 's' : ''}`}
              </span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Image Quality</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">Low</span>
                    <Slider
                      value={[imageQuality]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => setImageQuality(value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm">High</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Tips for Better Results</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Be detailed in your description</li>
                    <li>Specify lighting, mood, and perspective</li>
                    <li>Combine with art styles for unique results</li>
                    <li>Try different AI models for varying outputs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        {/* Image Results Display */}
        {generatedImages.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium">Generated Images</h3>
              {selectedImage && (
                <Button 
                  variant="outline" 
                  onClick={saveImageToGallery}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save to Gallery
                </Button>
              )}
            </div>
            
            {generatedImages.length > 1 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {generatedImages.map((image, index) => (
                    <div 
                      key={index}
                      className={`relative aspect-square rounded-lg border overflow-hidden ${selectedImage === image ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt={`Generated artwork ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                {selectedImage && (
                  <div className="relative aspect-square md:aspect-auto md:h-[500px] rounded-lg border overflow-hidden bg-muted/10 backdrop-blur-sm border-primary/10 flex items-center justify-center">
                    <img
                      src={selectedImage}
                      alt="Selected artwork"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="relative aspect-square md:aspect-auto md:h-[500px] rounded-lg border overflow-hidden bg-muted/10 backdrop-blur-sm border-primary/10 flex items-center justify-center">
                <img
                  src={generatedImages[0]}
                  alt="Generated artwork"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        )}
        
        {generatedImages.length === 0 && !isGenerating && (
          <div className="relative aspect-square md:aspect-video rounded-lg border bg-muted/10 backdrop-blur-sm border-primary/10 flex items-center justify-center overflow-hidden">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-12 w-12" />
              <p>Your generated image will appear here</p>
            </div>
          </div>
        )}
