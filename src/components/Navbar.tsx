
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Image, Menu, User, Crown, Home, Info, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-gray-800"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Image className="h-6 w-6 text-red-500" />
          <span className="font-bold text-xl">Imaginarium</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="flex space-x-1">
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/") && "bg-accent"
                  )}
                >
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/gallery">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/gallery") && "bg-accent"
                  )}
                >
                  Gallery
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/about">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/about") && "bg-accent"
                  )}
                >
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/contact">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/contact") && "bg-accent"
                  )}
                >
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <Link to="/profile">
              <Button variant="outline" size="sm" className="hidden md:flex border-red-700 text-red-400 hover:bg-red-900/20">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="hidden md:flex border-red-700 text-red-400 hover:bg-red-900/20">
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-background border-l border-gray-800">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                    <Image className="h-5 w-5 text-red-500" />
                    <span className="font-bold text-lg">Imaginarium</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={closeMenu}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Link to="/" onClick={closeMenu}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        isActive("/") && "bg-accent"
                      )}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Button>
                  </Link>
                  
                  <Link to="/gallery" onClick={closeMenu}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        isActive("/gallery") && "bg-accent"
                      )}
                    >
                      <Image className="mr-2 h-4 w-4" />
                      Gallery
                    </Button>
                  </Link>
                  
                  <Link to="/about" onClick={closeMenu}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        isActive("/about") && "bg-accent"
                      )}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      About
                    </Button>
                  </Link>
                  
                  <Link to="/contact" onClick={closeMenu}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        isActive("/contact") && "bg-accent"
                      )}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-800">
                  {isAuthenticated ? (
                    <Link to="/profile" onClick={closeMenu}>
                      <Button
                        variant="default"
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                      >
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/login" onClick={closeMenu}>
                      <Button
                        variant="default"
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
