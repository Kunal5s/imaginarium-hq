
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
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
        body: { prompt: prompt.trim() }
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
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Generate Images</h2>
        <p className="text-muted-foreground">
          Transform your ideas into stunning visuals with AI
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Describe your imagination..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
          <span className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate"}
          </span>
        </Button>
      </div>

      <div className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden">
        {generatedImage ? (
          <img
            src={generatedImage}
            alt="Generated artwork"
            className="w-full h-full object-contain"
          />
        ) : (
          <p className="text-muted-foreground">Your generated image will appear here</p>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
