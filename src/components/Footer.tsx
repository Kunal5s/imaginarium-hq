
import React from "react";
import { Link } from "react-router-dom";
import { Info, Mail, Shield, Cookie, MoveRight, Github, Twitter, Facebook, Instagram, Crown } from "lucide-react";

const Footer = () => {
  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if we're on the home page
    if (window.location.pathname === '/') {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on homepage, navigate to homepage with pricing section
      window.location.href = '/#pricing';
    }
  };

  return (
    <footer className="bg-black py-12 mt-16 border-t border-red-900/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-red-500">Imaginarium</h3>
            <p className="text-slate-300">
              Transform your ideas into beautiful artwork with our state-of-the-art
              AI image generator.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-red-500">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-red-500 flex items-center gap-2 transition-colors">
                  <MoveRight className="h-4 w-4 text-red-700" />
                  Home
                </Link>
              </li>
              <li>
                <a 
                  href="/#pricing" 
                  className="text-slate-300 hover:text-red-500 flex items-center gap-2 transition-colors cursor-pointer"
                  onClick={scrollToPricing}
                >
                  <Crown className="h-4 w-4 text-red-700" />
                  Pricing
                </a>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-300 hover:text-red-500 flex items-center gap-2 transition-colors">
                  <MoveRight className="h-4 w-4 text-red-700" />
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-300 hover:text-red-500 flex items-center gap-2 transition-colors">
                  <MoveRight className="h-4 w-4 text-red-700" />
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-red-500 flex items-center gap-2 transition-colors">
                  <Info className="h-4 w-4 text-red-700" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-red-500 flex items-center gap-2 transition-colors">
                  <Mail className="h-4 w-4 text-red-700" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-red-500">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-slate-300 hover:text-red-500 flex items-center gap-2 transition-colors">
                  <Shield className="h-4 w-4 text-red-700" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-slate-300 hover:text-red-500 flex items-center gap-2 transition-colors">
                  <Cookie className="h-4 w-4 text-red-700" />
                  Cookies Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-300 hover:text-red-500 flex items-center gap-2 transition-colors">
                  <Shield className="h-4 w-4 text-red-700" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-red-500">Contact Us</h3>
            <address className="not-italic text-slate-300">
              <p>Nandur Gaon</p>
              <p>Nashik 422003</p>
              <p>Email: info@imaginarium.com</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-red-900/20 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Imaginarium. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a 
              href="/#pricing" 
              onClick={scrollToPricing}
              className="text-red-500 hover:text-red-400 flex items-center gap-1"
            >
              <Crown className="h-4 w-4" />
              Upgrade to Premium
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
