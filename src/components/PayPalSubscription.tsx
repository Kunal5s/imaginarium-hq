
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// PayPal client ID - this is a public key that can be exposed in the frontend
const PAYPAL_CLIENT_ID = "AVf2GG134Rj0Z92kV4D6EUO5d5ocdrLKTnvD3kBm6XRvP3mRqUNhp8w54tukfk3v17Zqh8WsOEbcovr-";
const PAYPAL_PLAN_ID = "P-5EG23169MJ7776051M7FMS6Q";

interface PayPalSubscriptionProps {
  onSubscriptionComplete: (success: boolean) => void;
}

const PayPalSubscription = ({ onSubscriptionComplete }: PayPalSubscriptionProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadPayPalScript = () => {
    // Remove any existing PayPal scripts first to avoid conflicts
    const existingScripts = document.querySelectorAll('script[src*="paypal.com/sdk/js"]');
    existingScripts.forEach(script => script.remove());
    
    setLoading(true);
    setError(null);
    
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription&components=buttons&currency=USD`;
    script.async = true;
    script.dataset.orderid = Date.now().toString(); // Add unique identifier to prevent caching issues
    
    script.onload = () => {
      console.log("PayPal script loaded successfully");
      setScriptLoaded(true);
      setLoading(false);
    };
    
    script.onerror = () => {
      console.error("Failed to load PayPal script");
      setError("Failed to load PayPal payment system. Please try again later.");
      setLoading(false);
    };
    
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadPayPalScript();
    
    // Cleanup
    return () => {
      // Don't remove script on unmount to prevent flickering on remount
    };
  }, [retryCount]);

  useEffect(() => {
    if (!scriptLoaded || !window.paypal) return;

    const container = document.getElementById('paypal-button-container');
    if (!container) {
      console.error("PayPal container not found");
      return;
    }
    
    // Clear the container first to prevent duplicate buttons
    container.innerHTML = '';
    
    try {
      console.log("Rendering PayPal buttons");
      
      // Render the PayPal button
      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'black',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: function(data, actions) {
          console.log("Creating subscription with plan ID:", PAYPAL_PLAN_ID);
          return actions.subscription.create({
            plan_id: PAYPAL_PLAN_ID
          });
        },
        onApprove: function(data, actions) {
          console.log("Subscription approved:", data);
          
          // Store subscription data in localStorage for demo purposes
          if (user?.id) {
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 30); // 30 day subscription
            
            localStorage.setItem(`premium_${user.id}`, "true");
            localStorage.setItem(`premium_expiry_${user.id}`, expiry.toISOString());
            localStorage.setItem(`subscription_id_${user.id}`, data.subscriptionID || "demo-sub-id");
          }
          
          toast({
            title: "Subscription Activated!",
            description: "Thank you for upgrading to our premium plan!",
          });
          
          onSubscriptionComplete(true);
        },
        onError: function(err) {
          console.error("PayPal Error:", err);
          setError("Payment processing error. Please try again or contact support.");
          toast({
            title: "Subscription Failed",
            description: "There was an error processing your subscription. Please try again.",
            variant: "destructive",
          });
          onSubscriptionComplete(false);
        }
      }).render('#paypal-button-container').catch(err => {
        console.error("Error rendering PayPal buttons:", err);
        setError("Unable to display payment options. Please try again later.");
      });
    } catch (err) {
      console.error("Error setting up PayPal:", err);
      setError("Payment system initialization failed. Please try again later.");
    }
  }, [scriptLoaded, user, toast, onSubscriptionComplete]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading payment options...</p>
        <p className="text-xs text-muted-foreground">This may take a few moments</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive" className="bg-red-950/30 border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment System Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <Button 
          variant="outline" 
          className="w-full border-red-700 text-red-400 hover:bg-red-900/20 mt-2"
          onClick={handleRetry}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry Loading Payment System
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-4 border border-red-700 bg-black/30 backdrop-blur-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Upgrade to Premium - $30 One-time Payment</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Get unlimited image generation, access to all models, and priority support.
        </p>
      </div>
      
      <div className="mb-4 bg-black/40 p-3 rounded-md border border-gray-800">
        <div className="flex items-start gap-2 mb-2">
          <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5" />
          <span className="text-sm">Secure payment with PayPal</span>
        </div>
        <div className="flex items-start gap-2 mb-2">
          <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5" />
          <span className="text-sm">Instant access to premium features</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5" />
          <span className="text-sm">30-day access with no automatic renewal</span>
        </div>
      </div>
      
      <div id="paypal-button-container" className="min-h-[150px] bg-white/5 rounded-md p-2">
        {/* PayPal button will render here */}
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        By subscribing, you agree to our Terms of Service and Privacy Policy
      </p>
    </Card>
  );
};

export default PayPalSubscription;
