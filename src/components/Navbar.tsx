
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-semibold">
              Imaginarium
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/pricing" className="text-sm hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="/gallery" className="text-sm hover:text-primary transition-colors">
              Gallery
            </a>
            <Button variant="outline" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a
              href="/pricing"
              className="block text-sm hover:text-primary transition-colors"
            >
              Pricing
            </a>
            <a
              href="/gallery"
              className="block text-sm hover:text-primary transition-colors"
            >
              Gallery
            </a>
            <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
