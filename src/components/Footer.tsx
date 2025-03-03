
import React from "react";
import { Link } from "react-router-dom";
import { Info, Mail, Shield, Cookie, MoveRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Imaginarium</h3>
            <p className="text-slate-300">
              Transform your ideas into beautiful artwork with our state-of-the-art
              AI image generator.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white flex items-center gap-2">
                  <MoveRight className="h-4 w-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-slate-300 hover:text-white flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-slate-300 hover:text-white flex items-center gap-2">
                  <Cookie className="h-4 w-4" />
                  Cookies Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-300 hover:text-white flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-slate-300">
              <p>123 AI Street</p>
              <p>Imaginarium City, IC 12345</p>
              <p>Email: info@imaginarium.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Imaginarium. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
