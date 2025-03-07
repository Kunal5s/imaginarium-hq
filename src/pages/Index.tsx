
import Navbar from "@/components/Navbar";
import HypeSection from "@/components/HypeSection";
import ImageGenerator from "@/components/ImageGenerator";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HypeSection />
        <section id="generator" className="py-12 md:py-24 container mx-auto px-4">
          <ImageGenerator />
        </section>
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
