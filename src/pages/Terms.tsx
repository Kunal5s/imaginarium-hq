
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 px-4">
        <section className="py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-4">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
            
            <p className="text-lg mb-4">
              Please read these Terms of Service ("Terms") carefully before using the Imaginarium website and 
              AI image generation service. By accessing or using our service, you agree to be bound by these Terms.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Use of Our Services</h2>
            <p className="text-lg mb-4">
              You must follow any policies made available to you within the Services. You may use our Services 
              only as permitted by law. We may suspend or stop providing our Services to you if you do not 
              comply with our terms or policies or if we are investigating suspected misconduct.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Account Registration</h2>
            <p className="text-lg mb-4">
              To access certain features of the Service, you may be required to register for an account. 
              You agree to provide accurate, current, and complete information during the registration process 
              and to update such information to keep it accurate, current, and complete.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">User Content</h2>
            <p className="text-lg mb-4">
              Our Service allows you to create and generate images using our AI technology. You retain all 
              rights to the content you create. However, by using our Service, you grant us a worldwide, 
              non-exclusive, royalty-free license to use, reproduce, modify, and display the content for 
              the purpose of operating and improving our Services.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Prohibited Uses</h2>
            <p className="text-lg mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Generate content that is illegal, harmful, threatening, abusive, harassing, or defamatory.</li>
              <li>Violate any intellectual property rights of any party.</li>
              <li>Attempt to gain unauthorized access to any portion of the Service.</li>
              <li>Use the Service for any illegal or unauthorized purpose.</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Termination</h2>
            <p className="text-lg mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior 
              notice or liability, for any reason, including if you breach these Terms.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Changes to Terms</h2>
            <p className="text-lg mb-4">
              We may modify these Terms at any time. We will provide notice of any changes by posting the 
              updated Terms on our website. Your continued use of the Service after any such changes 
              constitutes your acceptance of the new Terms.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p className="text-lg mb-4">
              If you have any questions about these Terms, please contact us at legal@imaginarium.com.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
