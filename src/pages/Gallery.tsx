
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { downloadImage } from "@/components/image-generator/utils";
import { Progress } from "@/components/ui/progress";

interface GalleryImage {
  url: string;
  timestamp: number;
  expiresAt: number;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState<{[key: string]: string}>({});
  const [percentRemaining, setPercentRemaining] = useState<{[key: string]: number}>({});

  useEffect(() => {
    // Load images from localStorage
    const loadImages = () => {
      const storedImages = localStorage.getItem('gallery');
      if (storedImages) {
        try {
          const parsedImages = JSON.parse(storedImages);
          
          // Filter out expired images
          const validImages = parsedImages.filter((img: GalleryImage) => {
            return img.expiresAt > Date.now();
          });
          
          setImages(validImages);
          
          // If we filtered out expired images, update localStorage
          if (validImages.length !== parsedImages.length) {
            localStorage.setItem('gallery', JSON.stringify(validImages));
          }
        } catch (e) {
          console.error("Error parsing gallery images:", e);
          setImages([]);
        }
      }
    };
    
    loadImages();
    
    // Set up interval to check for expired images
    const interval = setInterval(() => {
      loadImages();
      updateTimeRemaining();
    }, 30000); // Check every 30 seconds
    
    // Update time remaining
    updateTimeRemaining();
    
    return () => clearInterval(interval);
  }, []);
  
  // Update time remaining for each image
  const updateTimeRemaining = () => {
    const times: {[key: string]: string} = {};
    const percents: {[key: string]: number} = {};
    
    images.forEach(image => {
      const now = Date.now();
      const totalDuration = 30 * 60 * 1000; // 30 minutes
      const elapsed = now - image.timestamp;
      const remaining = image.expiresAt - now;
      
      if (remaining <= 0) {
        times[image.url] = "Expired";
        percents[image.url] = 0;
      } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        times[image.url] = `${minutes}m ${seconds}s`;
        
        // Calculate percentage remaining
        const percent = Math.max(0, Math.min(100, (remaining / totalDuration) * 100));
        percents[image.url] = percent;
      }
    });
    
    setTimeRemaining(times);
    setPercentRemaining(percents);
  };
  
  useEffect(() => {
    // Update time remaining every second
    const timer = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(timer);
  }, [images]);

  const handleDownload = async (image: GalleryImage) => {
    setIsDownloading(image.url);
    try {
      const success = await downloadImage(image.url, `ai-image-${Date.now()}`);
      if (success) {
        toast({
          title: "Image downloaded successfully",
        });
      } else {
        throw new Error("Failed to download image");
      }
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(null);
    }
  };
  
  const handleDelete = (image: GalleryImage) => {
    const updatedImages = images.filter(img => img.url !== image.url);
    setImages(updatedImages);
    localStorage.setItem('gallery', JSON.stringify(updatedImages));
    
    toast({
      title: "Image removed from gallery"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            My Gallery
          </h1>
          
          {images.length === 0 ? (
            <Alert className="my-8 bg-black/40 border-gray-700">
              <AlertTitle>No images in your gallery</AlertTitle>
              <AlertDescription>
                Generated images will appear here for 30 minutes. Go to the generator to create some amazing images!
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                Your generated images are stored here temporarily. They will be automatically removed after 30 minutes.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <Card key={index} className="overflow-hidden border-gray-700 bg-black/30 backdrop-blur-sm transition-all hover:border-red-700">
                    <div className="relative aspect-square">
                      <img
                        src={image.url}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 rounded-full opacity-80 hover:opacity-100 bg-black/60"
                          onClick={() => handleDownload(image)}
                          disabled={isDownloading === image.url}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8 rounded-full opacity-80 hover:opacity-100 bg-black/60 hover:bg-red-700/60"
                          onClick={() => handleDelete(image)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Expires in: {timeRemaining[image.url] || 'Calculating...'}</span>
                        </div>
                      </div>
                      <Progress 
                        value={percentRemaining[image.url] || 0} 
                        className="h-1 mt-2"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <div 
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, #ef4444 0%, #991b1b 100%)`,
                            width: `${percentRemaining[image.url] || 0}%`
                          }}
                        />
                      </Progress>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
