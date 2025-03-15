
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wand2, Palette, Settings2, AlertTriangle, Crown, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { AI_MODELS } from './constants';
import ArtStyleSelector from './ArtStyleSelector';

interface GeneratorFormProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  isGenerating: boolean;
  generationMethod: "openai" | "huggingface";
  setGenerationMethod: React.Dispatch<React.SetStateAction<"openai" | "huggingface">>;
  aiModel: string;
  setAiModel: React.Dispatch<React.SetStateAction<string>>;
  imageSize: string;
  setImageSize: React.Dispatch<React.SetStateAction<string>>;
  aspectRatio: string;
  setAspectRatio: React.Dispatch<React.SetStateAction<string>>;
  numberOfImages: number;
  setNumberOfImages: React.Dispatch<React.SetStateAction<number>>;
  imageQuality: number;
  setImageQuality: React.Dispatch<React.SetStateAction<number>>;
  artStyle: string;
  setArtStyle: React.Dispatch<React.SetStateAction<string>>;
  error: string | null;
  onGenerate: () => Promise<void>;
  isAuthenticated?: boolean;
  isPremium?: boolean;
  credits?: number;
  dailyGenerationCount?: number;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({
  prompt,
  setPrompt,
  isGenerating,
  generationMethod,
  setGenerationMethod,
  aiModel,
  setAiModel,
  imageSize,
  setImageSize,
  aspectRatio,
  setAspectRatio,
  numberOfImages,
  setNumberOfImages,
  imageQuality,
  setImageQuality,
  artStyle,
  setArtStyle,
  error,
  onGenerate,
  isAuthenticated = false,
  isPremium = false,
  credits = 0,
  dailyGenerationCount = 0
}) => {
  const navigate = useNavigate();

  // Available aspect ratios for the selected model
  const availableAspectRatios = AI_MODELS.find(model => model.id === aiModel)?.aspectRatios || ["1:1"];

  // Set default aspect ratio when model changes
  useEffect(() => {
    if (availableAspectRatios.includes(aspectRatio)) return;
    setAspectRatio(availableAspectRatios[0]);
  }, [aiModel, availableAspectRatios, aspectRatio, setAspectRatio]);

  // Load Polar checkout script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js';
    script.defer = true;
    script.setAttribute('data-auto-init', '');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const FREE_USER_DAILY_LIMIT = 10;
  const isLimitReached = !isPremium && dailyGenerationCount >= FREE_USER_DAILY_LIMIT;

  return (
    <div className="w-full space-y-4">
      {error && (
        <Alert variant="destructive" className="my-4 border-red-500 bg-red-900/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isAuthenticated && isPremium && (
        <Alert className="my-4 border-green-500 bg-green-900/20">
          <Crown className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">Premium Active</AlertTitle>
          <AlertDescription className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2 text-green-400" />
            <span>You have {credits} credits remaining</span>
          </AlertDescription>
        </Alert>
      )}

      {isAuthenticated && !isPremium && isLimitReached && (
        <Alert variant="destructive" className="my-4 border-red-500 bg-red-900/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Daily Limit Reached</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>You've reached your daily limit of 10 free images.</p>
            <a
              href="https://buy.polar.sh/polar_cl_dVyO7TWk7jaSbsZCewMHxJXCxRXpea4uCibrk2dATxC"
              data-polar-checkout
              data-polar-checkout-theme="dark"
              className="inline-block px-4 py-2 mt-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-md flex items-center justify-center w-full sm:w-auto"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Premium - $30/month
            </a>
          </AlertDescription>
        </Alert>
      )}

      {!isAuthenticated && (
        <Alert className="my-4 border-red-500 bg-red-900/20">
          <Crown className="h-4 w-4" />
          <AlertTitle>Login for More Features</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col space-y-2">
              <span>Create up to 10 free images daily with a free account.</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full sm:w-auto border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => navigate('/login')}
              >
                Login Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid grid-cols-2 bg-black/40">
          <TabsTrigger value="generate" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">Generate</TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">Advanced Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={generationMethod}
                onValueChange={(value: "openai" | "huggingface") => setGenerationMethod(value)}
              >
                <SelectTrigger className="border-gray-700 bg-black/20">
                  <SelectValue placeholder="Select generation method" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="huggingface">Hugging Face (Top-Quality Models)</SelectItem>
                  <SelectItem value="openai">OpenAI DALL-E</SelectItem>
                </SelectContent>
              </Select>
              
              {generationMethod === "huggingface" && (
                <Select
                  value={aiModel}
                  onValueChange={setAiModel}
                >
                  <SelectTrigger className="border-gray-700 bg-black/20">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto bg-gray-900 border-gray-700">
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
                  <SelectTrigger className="border-gray-700 bg-black/20">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
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
                    <SelectTrigger className="border-gray-700 bg-black/20">
                      <SelectValue placeholder="Aspect Ratio" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto bg-gray-900 border-gray-700">
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
                      <SelectItem value="4:1">4:1 Ultra-Wide</SelectItem>
                      <SelectItem value="1:4">1:4 Ultra-Tall</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={numberOfImages.toString()}
                    onValueChange={(value) => setNumberOfImages(parseInt(value))}
                  >
                    <SelectTrigger className="border-gray-700 bg-black/20">
                      <SelectValue placeholder="Number of Images" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="1">1 Image</SelectItem>
                      <SelectItem value="2">2 Images</SelectItem>
                      <SelectItem value="3">3 Images</SelectItem>
                      <SelectItem value="4">4 Images</SelectItem>
                      <SelectItem value="6">6 Images</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <ArtStyleSelector artStyle={artStyle} setArtStyle={setArtStyle} />
                </>
              )}
            </div>
            
            <div className="space-y-2">
              <Input
                placeholder="Describe your imagination in detail... (e.g., 'A magical forest with glowing mushrooms and fairies')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 border-gray-700 bg-black/20"
              />
            </div>

            <Button
              onClick={onGenerate}
              disabled={isGenerating || isLimitReached || !isAuthenticated}
              className="w-full md:w-auto relative overflow-hidden group bg-gradient-to-r from-red-600 to-red-900 hover:from-red-700 hover:to-red-950"
            >
              <span className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                {isGenerating ? `Generating ${numberOfImages} image${numberOfImages > 1 ? 's' : ''}...` : `Generate ${numberOfImages} Image${numberOfImages > 1 ? 's' : ''}`}
              </span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card className="border-gray-700 bg-black/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-red-500">Image Quality</h3>
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
                  <h3 className="text-lg font-medium mb-2 text-red-500">Tips for Better Results</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Be detailed in your description</li>
                    <li>Specify lighting, mood, and perspective</li>
                    <li>Combine with art styles for unique results</li>
                    <li>Try different AI models for varying outputs</li>
                  </ul>
                </div>
                
                {!isPremium && (
                  <div className="bg-red-900/20 p-4 rounded-lg mt-4 border border-red-700">
                    <h3 className="text-lg font-medium mb-2 text-red-400">Premium Plan - $30/month</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Unlock exclusive features with secure payment:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Unlimited image generation</li>
                      <li>2000 credits monthly</li>
                      <li>Access to exclusive premium models</li>
                      <li>Higher resolution outputs</li>
                      <li>Priority processing</li>
                    </ul>
                    <a
                      href="https://buy.polar.sh/polar_cl_dVyO7TWk7jaSbsZCewMHxJXCxRXpea4uCibrk2dATxC"
                      data-polar-checkout
                      data-polar-checkout-theme="dark"
                      className="mt-3 w-full px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-md flex items-center justify-center"
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade Now - $30/month
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeneratorForm;
