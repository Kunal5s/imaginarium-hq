
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Gallery = () => {
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Load images from localStorage
    loadSavedImages();
  }, []);
  
  const loadSavedImages = () => {
    const localImages = localStorage.getItem('generatedImages');
    if (localImages) {
      setSavedImages(JSON.parse(localImages));
    }
  };
  
  const handleDeleteImage = (indexToDelete: number) => {
    const updatedImages = savedImages.filter((_, index) => index !== indexToDelete);
    localStorage.setItem('generatedImages', JSON.stringify(updatedImages));
    setSavedImages(updatedImages);
    
    toast({
      title: "Image Deleted",
      description: "The image has been removed from your gallery",
    });
  };

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-generated-image-${index + 1}.png`;
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 pb-16 px-4">
        <section className="py-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Your Generated Artwork
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              View all your AI-generated images in one place
            </p>
          </div>

          {savedImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedImages.map((imageUrl, index) => (
                <div key={index} className="rounded-lg overflow-hidden border border-border group relative">
                  <img 
                    src={imageUrl} 
                    alt={`Generated artwork ${index + 1}`} 
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full flex justify-between items-center">
                      <p className="text-white text-sm">Artwork #{index + 1}</p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white bg-black/40 hover:bg-black/60"
                          onClick={() => downloadImage(imageUrl, index)}
                        >
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white bg-red-500/40 hover:bg-red-500/60"
                          onClick={() => handleDeleteImage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="h-16 w-16 mb-4 opacity-30" />
              <h3 className="text-xl font-medium mb-2">No images yet</h3>
              <p className="text-center max-w-md mb-6">
                Generate some amazing artwork using our AI Image Generator and they'll appear here.
              </p>
              <Button onClick={() => navigate("/")}>
                Create Images
              </Button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
