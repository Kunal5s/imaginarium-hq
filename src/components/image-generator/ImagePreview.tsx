
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Save, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveImageToGallery } from './utils';

interface ImagePreviewProps {
  generatedImages: string[];
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  isGenerating: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  generatedImages,
  selectedImage,
  setSelectedImage,
  isGenerating
}) => {
  const { toast } = useToast();
  
  // Auto-select first image when generating completes
  useEffect(() => {
    if (generatedImages.length > 0 && !selectedImage) {
      setSelectedImage(generatedImages[0]);
    }
  }, [generatedImages, selectedImage, setSelectedImage]);
  
  // Auto-save images to gallery when they are generated
  useEffect(() => {
    // When new images are generated, save them all to gallery
    if (generatedImages.length > 0) {
      let savedCount = 0;
      generatedImages.forEach(image => {
        const saved = saveImageToGallery(image);
        if (saved) savedCount++;
      });
      
      if (savedCount > 0) {
        toast({
          title: "Images Saved",
          description: `${savedCount} image(s) automatically saved to your gallery`,
        });
      }
    }
  }, [generatedImages, toast]);
  
  const handleSaveToGallery = () => {
    if (!selectedImage) return;
    
    const saved = saveImageToGallery(selectedImage);
    
    if (saved) {
      toast({
        title: "Image Saved",
        description: "Image has been saved to your gallery",
      });
    } else {
      toast({
        title: "Already Saved",
        description: "This image is already in your gallery",
      });
    }
  };

  const downloadImage = async (imageUrl: string, index?: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-generated-image${index !== undefined ? `-${index + 1}` : ''}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your image is downloading",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadAllImages = async () => {
    if (generatedImages.length === 0) return;
    
    toast({
      title: "Downloading Images",
      description: `Downloading ${generatedImages.length} images`,
    });
    
    // Download each image with a slight delay to avoid browser blocking
    generatedImages.forEach((image, index) => {
      setTimeout(() => {
        downloadImage(image, index);
      }, index * 300);
    });
  };

  if (generatedImages.length === 0 && !isGenerating) {
    return (
      <div className="relative aspect-square md:aspect-video rounded-lg border bg-muted/10 backdrop-blur-sm border-primary/10 flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageIcon className="h-12 w-12" />
          <p>Your generated image will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Generated Images</h3>
            <div className="flex gap-2">
              {selectedImage && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleSaveToGallery}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save to Gallery
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => downloadImage(selectedImage)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </>
              )}
              {generatedImages.length > 1 && (
                <Button 
                  variant="outline" 
                  onClick={downloadAllImages}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download All
                </Button>
              )}
            </div>
          </div>
          
          {generatedImages.length > 1 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {generatedImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`relative group aspect-square rounded-lg border overflow-hidden cursor-pointer ${selectedImage === image ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`Generated artwork ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Error loading image ${index}:`, e);
                        // Set a placeholder if image fails to load
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${selectedImage === image ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-white bg-black/40 hover:bg-black/60"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(image, index);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedImage && (
                <div className="relative aspect-square md:aspect-auto md:h-[500px] rounded-lg border overflow-hidden bg-muted/10 backdrop-blur-sm border-primary/10 flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Selected artwork"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error("Error loading selected image:", e);
                      // Set a placeholder if image fails to load
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
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
                onError={(e) => {
                  console.error("Error loading image:", e);
                  // Set a placeholder if image fails to load
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className="absolute bottom-4 right-4">
                <Button 
                  size="icon"
                  variant="outline"
                  className="bg-background/80 backdrop-blur-sm"
                  onClick={() => downloadImage(generatedImages[0])}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
