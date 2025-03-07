
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

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dailyUsage, setDailyUsage] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

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

    // Simulate premium status check (in a real app, this would come from a database)
    // For demo purposes, we'll just randomly assign premium status
    const checkPremiumStatus = async () => {
      try {
        // This would be a real API call in production
        const hasSubscription = localStorage.getItem(`premium_${user?.id}`);
        
        if (hasSubscription) {
          setIsPremium(true);
          // Set expiry date (for demo - 30 days from today)
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 30);
          setExpiryDate(expiry.toLocaleDateString());
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
      }
    };

    checkPremiumStatus();
  }, [isAuthenticated, navigate, user]);

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

  const handleUpgrade = () => {
    // For demo purposes, let's just set premium status in localStorage
    localStorage.setItem(`premium_${user?.id}`, "true");
    
    // Set expiry date (30 days from today)
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    
    setIsPremium(true);
    setExpiryDate(expiry.toLocaleDateString());
    
    toast({
      title: "Premium Activated!",
      description: "Thank you for upgrading to our premium plan!",
    });
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
                {isPremium ? (
                  <>
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
                  </>
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
              </CardContent>
              <CardFooter>
                {!isPremium && (
                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                    onClick={handleUpgrade}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium - $30 One-time
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
