
import Navbar from "@/components/Navbar";
import ImageGenerator from "@/components/ImageGenerator";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24">
        <section className="py-12 md:py-24">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Create Stunning Images with AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your ideas into beautiful artwork with our state-of-the-art
              AI image generator
            </p>
          </div>
          <ImageGenerator />
        </section>
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
