
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Crown, Calendar, Clock, Image, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import PayPalSubscription from "@/components/PayPalSubscription";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dailyUsage, setDailyUsage] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [showPayPal, setShowPayPal] = useState(false);

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

    // Check premium status
    const checkPremiumStatus = async () => {
      try {
        const hasSubscription = localStorage.getItem(`premium_${user?.id}`);
        
        if (hasSubscription) {
          setIsPremium(true);
          
          // Get expiry date
          const storedExpiry = localStorage.getItem(`premium_expiry_${user?.id}`);
          if (storedExpiry) {
            const expiryDate = new Date(storedExpiry);
            const now = new Date();
            
            // Check if subscription is expired
            if (expiryDate > now) {
              setExpiryDate(expiryDate.toLocaleDateString());
            } else {
              // Subscription expired
              setIsPremium(false);
              setExpiryDate(null);
              localStorage.removeItem(`premium_${user?.id}`);
              localStorage.removeItem(`premium_expiry_${user?.id}`);
              toast({
                title: "Subscription Expired",
                description: "Your premium plan has expired. Please renew to continue enjoying premium features.",
                variant: "destructive",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
      }
    };

    checkPremiumStatus();
  }, [isAuthenticated, navigate, user, toast]);

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

  const handleSubscriptionComplete = (success: boolean) => {
    if (success) {
      // Update UI to show premium status
      setIsPremium(true);
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);
      setExpiryDate(expiry.toLocaleDateString());
      setShowPayPal(false);
    }
  };

  const handleUpgradeClick = () => {
    setShowPayPal(true);
  };

  const handleCancelUpgrade = () => {
    setShowPayPal(false);
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
                    ? "You're currently on our Premium Plan" 
                    : "Upgrade to Premium for unlimited access"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showPayPal && (
                  <>
                    {isPremium ? (
                      <div className="p-4 bg-red-900/20 rounded-lg border border-red-700">
                        <h3 className="font-medium text-red-400 mb-2">Premium Plan</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your subscription is active until {expiryDate}
                        </p>
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
                          <h3 className="font-medium text-red-400 mb-2">Premium Plan - $30</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            One-time payment for all premium features:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Unlimited image generation</li>
                            <li>Access to all premium models</li>
                            <li>Priority processing</li>
                            <li>Premium support</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </>
                )}

                {showPayPal && (
                  <PayPalSubscription onSubscriptionComplete={handleSubscriptionComplete} />
                )}
              </CardContent>
              <CardFooter>
                {!isPremium && !showPayPal && (
                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                    onClick={handleUpgradeClick}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium - $30 One-time
                  </Button>
                )}
                {showPayPal && (
                  <Button 
                    variant="outline"
                    className="w-full border-gray-700 text-gray-400 hover:bg-gray-900/20 mt-4"
                    onClick={handleCancelUpgrade}
                  >
                    Cancel
                  </Button>
                )}
                {isPremium && (
                  <Button 
                    variant="outline"
                    className="w-full border-red-700 text-red-400 hover:bg-red-900/20"
                  >
                    Manage Subscription
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
