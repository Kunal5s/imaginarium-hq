
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, ImageIcon } from "lucide-react";
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
            {selectedImage && (
              <Button 
                variant="outline" 
                onClick={handleSaveToGallery}
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
    </div>
  );
};

export default ImagePreview;
