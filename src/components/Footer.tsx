
import React from "react";
import { Link } from "react-router-dom";
import { Info, Mail, Shield, Cookie, MoveRight, Github, Twitter, Facebook, Instagram, Crown } from "lucide-react";

const Footer = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
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
                  href="#pricing" 
                  className="text-slate-300 hover:text-red-500 flex items-center gap-2 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToPricing();
                  }}
                >
                  <Crown className="h-4 w-4 text-red-700" />
                  Pricing
                </a>
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
              <p>123 AI Street</p>
              <p>Imaginarium City, IC 12345</p>
              <p>Email: info@imaginarium.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-red-900/20 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Imaginarium. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
