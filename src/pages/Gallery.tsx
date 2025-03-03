
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ImageIcon, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Gallery = () => {
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      // For demonstration purposes only - in a real app, this would load from a database
      const localImages = localStorage.getItem('generatedImages');
      if (localImages) {
        setSavedImages(JSON.parse(localImages));
      }
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto pt-24 pb-16 flex items-center justify-center">
          <div className="max-w-md text-center">
            <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-2">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your gallery of generated images.
            </p>
            <Button onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 pb-16">
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
                    <div className="p-4 w-full">
                      <p className="text-white text-sm">Artwork #{index + 1}</p>
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
