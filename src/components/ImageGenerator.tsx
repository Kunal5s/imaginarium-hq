
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wand2, ImageIcon, Settings2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState("1024x1024");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt: prompt.trim(),
          size: imageSize
        }
      });

      if (error) throw error;
      
      setGeneratedImage(data.imageUrl);
      toast({
        title: "Success!",
        description: "Your image has been generated.",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Describe your imagination in detail..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1"
          />
          <Select
            value={imageSize}
            onValueChange={setImageSize}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1024x1024">1024 × 1024</SelectItem>
              <SelectItem value="1024x1792">1024 × 1792</SelectItem>
              <SelectItem value="1792x1024">1792 × 1024</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
    </div>
  );
};

export default ImageGenerator;
