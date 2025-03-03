
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wand2, ImageIcon, Settings2, AlertTriangle, Palette, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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

// AI Models from Hugging Face
const AI_MODELS = [
  { id: "stabilityai/stable-diffusion-xl-base-1.0", name: "Stable Diffusion XL 1.5+" },
  { id: "runwayml/stable-diffusion-v1-5", name: "SD Lightning V2" },
  { id: "prompthero/openjourney", name: "OpenJourney V4 Pro" },
  { id: "dreamshaper/dreamshaper-xl", name: "DreamShaper XL Pro" },
  { id: "segmind/SSD-1B", name: "SDXL Turbo Pro" },
  { id: "stabilityai/sdxl-turbo", name: "SDXL Turbo" },
  { id: "dataautogpt3/RealVisXL-V4", name: "RealVisXL V4.0 UHD" },
  { id: "deepfloyd/IF-I-XL-v1.0", name: "DeepFloyd IF Ultra" },
  { id: "lllyasviel/sd-controlnet-depth", name: "ControlNet + SDXL" },
  { id: "playgroundai/playground-v2.5-1024px-aesthetic", name: "Playground V2.5 Ultra" },
  { id: "julibrain/photoreal", name: "JuliBrain Photoreal" },
  { id: "PixArt-alpha/PixArt-XL-2-1024-MS", name: "PixArt-Σ Ultra" },
  { id: "ByteDance/FLUX-1-schnell", name: "FLUX.1-schnell MAX" },
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

// Function to generate images using Hugging Face API
const generateImageWithHuggingFace = async (prompt: string, model: string, apiKey: string) => {
  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate image with Hugging Face API");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState("1024x1024");
  const [error, setError] = useState<string | null>(null);
  const [aiModel, setAiModel] = useState("stabilityai/stable-diffusion-xl-base-1.0");
  const [artStyle, setArtStyle] = useState("");
  const [artStylesDialogOpen, setArtStylesDialogOpen] = useState(false);
  const [generationMethod, setGenerationMethod] = useState<"openai" | "huggingface">("huggingface");
  const { toast } = useToast();

  // Hugging Face API key
  const huggingFaceApiKey = "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";

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
    
    try {
      if (generationMethod === "openai") {
        const { data, error: supabaseError } = await supabase.functions.invoke('generate-image', {
          body: { 
            prompt: prompt.trim(),
            size: imageSize
          }
        });

        if (supabaseError) throw supabaseError;
        
        if (data.error) {
          if (data.errorCode === "BILLING_LIMIT_REACHED") {
            setError("The OpenAI account has reached its billing limit. Please contact the administrator to update the billing settings.");
            throw new Error(data.error);
          } else {
            throw new Error(data.error);
          }
        }
        
        setGeneratedImage(data.imageUrl);
      } else {
        // Hugging Face API generation
        let enhancedPrompt = prompt.trim();
        if (artStyle) {
          enhancedPrompt = `${enhancedPrompt}, in the style of ${artStyle}`;
        }

        const imageUrl = await generateImageWithHuggingFace(enhancedPrompt, aiModel, huggingFaceApiKey);
        setGeneratedImage(imageUrl);
      }

      toast({
        title: "Success!",
        description: "Your image has been generated.",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      if (!error.message?.includes("billing_limit_reached")) {
        toast({
          title: "Error",
          description: "Failed to generate image. Please try again.",
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

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          AI Image Generator
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transform your ideas into stunning visuals with our advanced AI technology.
          Create unique, high-quality images in seconds.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
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
          
          <Input
            placeholder="Describe your imagination in detail..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1"
          />

          <div className="flex flex-col md:flex-row gap-4">
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

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full md:w-auto relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 opacity-0 group-hover:opacity-10 transition-opacity" />
              <span className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Image"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative aspect-square md:aspect-video rounded-lg border bg-muted/10 backdrop-blur-sm border-primary/10 flex items-center justify-center overflow-hidden">
        {generatedImage ? (
          <img
            src={generatedImage}
            alt="Generated artwork"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-12 w-12" />
            <p>Your generated image will appear here</p>
          </div>
        )}
        {isGenerating && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin">
                <Settings2 className="h-8 w-8" />
              </div>
              <p className="text-sm">Generating your image...</p>
            </div>
          </div>
        )}
      </div>

      {generationMethod === "huggingface" && (
        <div className="text-sm text-muted-foreground text-center">
          <p>Powered by Hugging Face's AI models. Select from 13 different AI models and 100+ art styles.</p>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
