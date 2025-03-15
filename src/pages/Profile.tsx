
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Crown, Calendar, Clock, Image, LogOut, Settings, AlertTriangle, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dailyUsage, setDailyUsage] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Get daily usage from localStorage
    const storedUsage = localStorage.getItem(`image_usage_${user?.id}`);
    if (storedUsage) {
      const { count } = JSON.parse(storedUsage);
      setDailyUsage(count);
    }

    // Check premium status from Supabase
    const checkPremiumStatus = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('handle-premium', {
          body: { user_id: user?.id, operation: 'check' }
        });
        
        if (error) throw error;
        
        if (data?.data) {
          const userStatus = data.data;
          
          // Check if premium is active
          if (userStatus.premium_status === 'active' && userStatus.premium_expiry) {
            setIsPremium(true);
            setIsExpired(false);
            
            // Format the expiry date
            const expiryDate = new Date(userStatus.premium_expiry);
            setExpiryDate(expiryDate.toLocaleDateString());
            
            // Calculate time remaining
            const timeRemaining = new Date(userStatus.premium_expiry).getTime() - new Date().getTime();
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            setTimeRemaining(`${days} days and ${hours} hours`);
            setCredits(userStatus.credits || 0);
          } else if (userStatus.premium_status === 'expired') {
            setIsPremium(false);
            setIsExpired(true);
            setExpiryDate(null);
            setCredits(userStatus.credits || 0);
            
            toast({
              title: "Subscription Expired",
              description: "Your premium plan has expired. Please renew to continue enjoying premium features.",
              variant: "destructive",
            });
          } else {
            setIsPremium(false);
            setIsExpired(false);
            setCredits(userStatus.credits || 0);
          }
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();
    
    // Check subscription status every minute
    const interval = setInterval(checkPremiumStatus, 60000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate, user, toast]);

  useEffect(() => {
    // Load Polar checkout script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js';
    script.defer = true;
    script.setAttribute('data-auto-init', '');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            My Profile
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <Card className="col-span-1 border-gray-700 bg-black/30 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-center mt-4">{user?.email}</CardTitle>
                <CardDescription className="text-center">
                  {isPremium ? (
                    <Badge className="bg-red-700 text-white">Premium User</Badge>
                  ) : (
                    <Badge variant="outline" className="border-red-700 text-red-400">Free User</Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Joined {new Date().toLocaleDateString()}</span>
                </div>
                {isPremium && expiryDate && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Premium until {expiryDate}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <Image className="w-4 h-4 text-muted-foreground" />
                  <span>Generated {dailyUsage} images today</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span>Credits: {credits}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full border-red-700 text-red-400 hover:bg-red-900/20"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-700 text-gray-400 hover:bg-gray-900/20"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </CardFooter>
            </Card>

            {/* Subscription Details */}
            <Card className="col-span-1 md:col-span-2 border-gray-700 bg-black/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-red-500" />
                  Subscription
                </CardTitle>
                <CardDescription>
                  {isPremium 
                    ? "You currently have premium access" 
                    : "Upgrade to Premium for unlimited access"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isExpired && (
                  <Alert variant="destructive" className="bg-red-950/30 border-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Subscription Expired</AlertTitle>
                    <AlertDescription>
                      Your premium plan has expired. Please renew to continue enjoying premium features.
                    </AlertDescription>
                  </Alert>
                )}
              
                {isPremium ? (
                  <div className="p-4 bg-red-900/20 rounded-lg border border-red-700">
                    <h3 className="font-medium text-red-400 mb-2">Premium Plan</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Your subscription is active until {expiryDate}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Time remaining: {timeRemaining}
                    </p>
                    <div className="mb-4 p-3 bg-green-900/20 rounded border border-green-700">
                      <h4 className="font-medium text-green-400 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Credits: {credits}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        You have {credits} credits to use for image generation
                      </p>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Unlimited image generation</li>
                      <li>Access to all premium models</li>
                      <li>Priority processing</li>
                      <li>Premium support</li>
                    </ul>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-black/40 rounded-lg border border-gray-700">
                      <h3 className="font-medium text-gray-300 mb-2">Free Plan</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Your current plan includes:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>10 images per day</li>
                        <li>Access to basic models</li>
                        <li>Standard quality</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-red-900/20 rounded-lg border border-red-700">
                      <h3 className="font-medium text-red-400 mb-2">Premium Plan - $30/month</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Monthly subscription with premium features:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Unlimited image generation</li>
                        <li>2000 credits monthly</li>
                        <li>Access to all premium models</li>
                        <li>Priority processing</li>
                        <li>Premium support</li>
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                {!isPremium && (
                  <a 
                    href="https://buy.polar.sh/polar_cl_dVyO7TWk7jaSbsZCewMHxJXCxRXpea4uCibrk2dATxC" 
                    data-polar-checkout 
                    data-polar-checkout-theme="dark"
                    className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-md flex items-center justify-center"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    {isExpired ? 'Renew Premium - $30/month' : 'Upgrade to Premium - $30/month'}
                  </a>
                )}
                {isPremium && (
                  <Button 
                    variant="outline"
                    className="w-full border-red-700 text-red-400 hover:bg-red-900/20"
                    disabled
                  >
                    Active Subscription
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
