
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ImageIcon, Trash2, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SavedImage {
  url: string;
  timestamp: number;
}

const Gallery = () => {
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // 30 minutes in milliseconds
  const EXPIRY_TIME = 30 * 60 * 1000;
  
  useEffect(() => {
    // Load images from localStorage
    loadSavedImages();
    
    // Set up interval to check for expired images every minute
    const interval = setInterval(() => {
      removeExpiredImages();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const loadSavedImages = () => {
    const localImages = localStorage.getItem('generatedImages');
    if (localImages) {
      try {
        // Check if the stored data is in the new format (with timestamps)
        const parsedData = JSON.parse(localImages);
        
        if (Array.isArray(parsedData) && typeof parsedData[0] === 'string') {
          // Old format - convert to new format with current timestamp
          const currentTime = Date.now();
          const formattedImages = parsedData.map(url => ({
            url,
            timestamp: currentTime
          }));
          
          localStorage.setItem('generatedImages', JSON.stringify(formattedImages));
          setSavedImages(formattedImages);
        } else {
          // New format with timestamps
          setSavedImages(parsedData);
        }
        
        // Remove any expired images
        removeExpiredImages();
      } catch (error) {
        console.error("Error parsing saved images:", error);
        setSavedImages([]);
      }
    }
  };
  
  const removeExpiredImages = () => {
    const currentTime = Date.now();
    const updatedImages = savedImages.filter(image => {
      return currentTime - image.timestamp < EXPIRY_TIME;
    });
    
    if (updatedImages.length !== savedImages.length) {
      localStorage.setItem('generatedImages', JSON.stringify(updatedImages));
      setSavedImages(updatedImages);
      
      if (savedImages.length > 0 && updatedImages.length === 0) {
        toast({
          title: "Images Expired",
          description: "All images have expired (30-minute limit reached)",
        });
      }
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

  const getTimeRemaining = (timestamp: number) => {
    const currentTime = Date.now();
    const elapsed = currentTime - timestamp;
    const remaining = Math.max(0, EXPIRY_TIME - elapsed);
    
    // Convert to minutes and seconds
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
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
              View all your AI-generated images in one place (available for 30 minutes)
            </p>
          </div>

          {savedImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedImages.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden border border-border group relative">
                  <img 
                    src={image.url} 
                    alt={`Generated artwork ${index + 1}`} 
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full flex justify-between items-center">
                      <div className="flex items-center space-x-1 text-white text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{getTimeRemaining(image.timestamp)}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white bg-black/40 hover:bg-black/60"
                          onClick={() => downloadImage(image.url, index)}
                        >
                          <Download className="h-4 w-4 mr-1" />
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
