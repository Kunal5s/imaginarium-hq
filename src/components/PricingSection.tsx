
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PricingSection = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Load Polar checkout script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js';
    script.defer = true;
    script.setAttribute('data-auto-init', '');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Check premium status if user is authenticated
    const checkPremiumStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const { data, error } = await supabase.functions.invoke('handle-premium', {
            body: { user_id: user.id, operation: 'check' }
          });
          
          if (error) throw error;
          
          if (data?.data?.premium_status === 'active') {
            setIsPremium(true);
          } else {
            setIsPremium(false);
          }
        } catch (error) {
          console.error("Error checking premium status:", error);
        }
      }
    };
    
    checkPremiumStatus();
  }, [isAuthenticated, user]);

  // Single premium plan
  const premiumPlan = {
    name: "Premium",
    price: "$30",
    period: "monthly subscription",
    features: [
      "Unlimited image generation",
      "2000 credits monthly",
      "Access to all models",
      "High quality resolution",
      "Priority support",
      "Secure payment processing"
    ],
  };

  // Free plan features
  const freePlan = {
    name: "Free",
    price: "$0",
    features: [
      "10 images per day",
      "Images saved for 30 minutes",
      "Access to basic models",
      "Standard quality", 
      "Basic support"
    ],
  };

  const handleUpgradeClick = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      toast({
        title: "Login Required",
        description: "Please login to upgrade to the premium plan",
      });
      navigate('/login');
    }
    // The actual purchase flow is handled by the Polar checkout button
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-24 sm:py-32 glass-pattern" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Revolutionize Your Creative Process
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Create stunning AI-generated images with our cutting-edge technology
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* Free Plan */}
          <div className="relative flex flex-col p-8 ring-1 ring-muted rounded-3xl backdrop-blur-sm bg-black/40 border border-gray-800">
            <div className="mb-8">
              <h3 className="text-lg font-semibold leading-8">{freePlan.name}</h3>
              <p className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold tracking-tight text-red-500">
                  {freePlan.price}
                </span>
              </p>
            </div>
            <ul className="flex-1 space-y-4">
              {freePlan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-red-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="mt-8 border-red-700 text-red-500 hover:bg-red-900/20"
              onClick={() => navigate('/login')}
            >
              Get Started Free
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="relative flex flex-col p-8 ring-2 ring-red-700 rounded-3xl backdrop-blur-sm bg-black/40 border border-red-800 red-glow">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-sm font-medium tracking-wide text-white bg-red-700 rounded-full">
              Recommended
            </span>
            <div className="mb-8">
              <h3 className="text-lg font-semibold leading-8">{premiumPlan.name}</h3>
              <p className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold tracking-tight text-red-500">
                  {premiumPlan.price}
                </span>
                <span className="text-sm font-semibold leading-6 text-muted-foreground ml-2">
                  {premiumPlan.period}
                </span>
              </p>
            </div>
            <ul className="flex-1 space-y-4">
              {premiumPlan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-red-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            {!isPremium ? (
              <div className="mt-8">
                {isAuthenticated ? (
                  <a 
                    href="https://buy.polar.sh/polar_cl_dVyO7TWk7jaSbsZCewMHxJXCxRXpea4uCibrk2dATxC" 
                    data-polar-checkout 
                    data-polar-checkout-theme="dark"
                    className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-md flex items-center justify-center"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade Now - $30/month
                  </a>
                ) : (
                  <Button
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                    onClick={handleUpgradeClick}
                  >
                    <Crown className="ml-2 h-4 w-4" />
                    Login to Upgrade
                  </Button>
                )}
              </div>
            ) : (
              <Button
                className="mt-8 bg-green-700 hover:bg-green-800"
                disabled
              >
                <Crown className="mr-2 h-4 w-4" />
                Active Premium
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
