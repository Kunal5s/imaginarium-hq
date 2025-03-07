
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
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
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Load the PayPal script
    const loadPayPalScript = () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        setLoading(false);
      };
      script.onerror = () => {
        setError("Failed to load PayPal script. Please try again later.");
        setLoading(false);
      };
      document.body.appendChild(script);
    };

    loadPayPalScript();

    // Cleanup
    return () => {
      const paypalScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (paypalScript) {
        paypalScript.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (scriptLoaded && window.paypal) {
      // Render the PayPal button
      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'black',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: function(data: any, actions: any) {
          return actions.subscription.create({
            plan_id: PAYPAL_PLAN_ID
          });
        },
        onApprove: function(data: any, actions: any) {
          // In a real application, this would make a backend API call
          // to verify and activate the subscription
          console.log("Subscription successful:", data);
          
          // Store subscription data in localStorage for demo purposes
          // In a real app, this would be stored in a database
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
        onError: function(err: any) {
          console.error("PayPal Error:", err);
          toast({
            title: "Subscription Failed",
            description: "There was an error processing your subscription. Please try again.",
            variant: "destructive",
          });
          onSubscriptionComplete(false);
        }
      }).render('#paypal-button-container');
    }
  }, [scriptLoaded, user, toast, onSubscriptionComplete]);

  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading payment options...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
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
      
      <div id="paypal-button-container" className="min-h-[150px]"></div>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        By subscribing, you agree to our Terms of Service and Privacy Policy
      </p>
    </Card>
  );
};

export default PayPalSubscription;
