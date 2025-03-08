import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Crown, Calendar, Clock, Image, LogOut, Settings, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dailyUsage, setDailyUsage] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

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
    const checkPremiumStatus = () => {
      try {
        const premiumStatus = localStorage.getItem(`premiumStatus`);
        const premiumExpiry = localStorage.getItem(`premiumExpiry`);
        
        if (premiumStatus === "active" && premiumExpiry) {
          const expiryTimestamp = parseInt(premiumExpiry);
          const now = new Date().getTime();
          
          // Check if subscription is expired
          if (expiryTimestamp > now) {
            setIsPremium(true);
            setIsExpired(false);
            
            // Format the expiry date
            const expiryDate = new Date(expiryTimestamp);
            setExpiryDate(expiryDate.toLocaleDateString());
            
            // Calculate time remaining
            const timeRemaining = expiryTimestamp - now;
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            setTimeRemaining(`${days} days and ${hours} hours`);
          } else {
            // Subscription expired
            setIsPremium(false);
            setIsExpired(true);
            setExpiryDate(null);
            localStorage.removeItem(`premiumStatus`);
            
            toast({
              title: "Subscription Expired",
              description: "Your premium plan has expired. Please renew to continue enjoying premium features.",
              variant: "destructive",
            });
          }
        } else if (premiumStatus !== "active") {
          setIsExpired(false);
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
      }
    };

    checkPremiumStatus();
    
    // Check subscription status every minute
    const interval = setInterval(checkPremiumStatus, 60000);
    
    return () => clearInterval(interval);
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

  const handleRenewClick = () => {
    // Redirect to Buy Me a Coffee membership page with return URL
    window.location.href = "https://buymeacoffee.com/ultracinemabookfeed/membership?redirect_to=https://imaginariumtool.netlify.app/success.html";
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
                    ? "You currently have premium access for one week" 
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
                      <h3 className="font-medium text-red-400 mb-2">Premium Plan - ₹2600</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        One-time payment for 1 week of premium features:
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
              </CardContent>
              <CardFooter>
                {!isPremium && (
                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                    onClick={handleRenewClick}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    {isExpired ? 'Renew Premium - ₹2600' : 'Upgrade to Premium - ₹2600'}
                  </Button>
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
