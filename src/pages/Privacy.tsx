
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 px-4">
        <section className="py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-4">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
            
            <p className="text-lg mb-4">
              At Imaginarium, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website or use our AI 
              image generation service.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
            <p className="text-lg mb-4">
              We may collect information about you in various ways, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Personal Data: Name, email address, and payment information when you register or subscribe.</li>
              <li>Usage Data: How you interact with our website and services.</li>
              <li>Generated Content: Images you create using our platform.</li>
              <li>Cookies and Tracking Technologies: Information about your browsing habits and device.</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-lg mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process transactions and send related information.</li>
              <li>Send administrative information, such as updates to our terms or privacy policy.</li>
              <li>Respond to customer service requests and support needs.</li>
              <li>Monitor usage patterns and analyze trends to enhance user experience.</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Disclosure of Your Information</h2>
            <p className="text-lg mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Service providers who perform services on our behalf.</li>
              <li>Partners with whom we offer co-branded services or promotions.</li>
              <li>Legal authorities when required by law or to protect our rights.</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Your Rights</h2>
            <p className="text-lg mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The right to access and receive a copy of your personal information.</li>
              <li>The right to request correction of incomplete or inaccurate information.</li>
              <li>The right to request deletion of your personal information.</li>
              <li>The right to withdraw consent where we rely on consent as the legal basis for processing.</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p className="text-lg mb-4">
              If you have questions or concerns about this Privacy Policy, please contact us at 
              privacy@imaginarium.com.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
