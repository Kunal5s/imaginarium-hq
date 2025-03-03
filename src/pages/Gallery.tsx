
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ImageIcon } from "lucide-react";

const Gallery = () => {
  const [savedImages, setSavedImages] = useState<string[]>([]);
  
  // This would be enhanced in a real application to pull from a database
  useEffect(() => {
    // For demonstration purposes only - in a real app, this would load from a database
    const localImages = localStorage.getItem('generatedImages');
    if (localImages) {
      setSavedImages(JSON.parse(localImages));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 pb-16">
        <section className="py-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your Generated Artwork
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              View all your AI-generated images in one place
            </p>
          </div>

          {savedImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedImages.map((imageUrl, index) => (
                <div key={index} className="rounded-lg overflow-hidden border border-border">
                  <img 
                    src={imageUrl} 
                    alt={`Generated artwork ${index + 1}`} 
                    className="w-full aspect-square object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="h-16 w-16 mb-4 opacity-30" />
              <h3 className="text-xl font-medium mb-2">No images yet</h3>
              <p className="text-center max-w-md">
                Generate some amazing artwork using our AI Image Generator and they'll appear here.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
