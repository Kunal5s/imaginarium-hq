
import { Button } from "@/components/ui/button";
import { Wand2, Zap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HypeSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-32 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      {/* Red glow effects */}
      <div className="absolute top-20 left-1/3 w-64 h-64 bg-red-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-1/3 w-72 h-72 bg-red-800/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="block bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-2">
              Revolutionizing
            </span>
            <span className="text-white">AI Image Generation</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Create stunning, professional artwork in seconds with our powerful AI technology
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button 
              onClick={() => navigate("/#generator")}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-red-600/20 group transition-all"
              size="lg"
            >
              <Wand2 className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
              Start Creating Now
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate("/gallery")}
              className="border-red-700 text-red-400 hover:bg-red-900/20 px-8 py-6 text-lg rounded-xl"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              View Gallery
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 pt-8">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              <span>Ultra-Fast Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-red-500" />
              <span>Professional Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-red-500" />
              <span>Multiple Styles</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HypeSection;
