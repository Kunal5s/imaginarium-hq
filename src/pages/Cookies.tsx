
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 px-4">
        <section className="py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Cookies Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-4">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
            
            <p className="text-lg mb-4">
              This Cookies Policy explains how Imaginarium uses cookies and similar technologies to 
              recognize you when you visit our website. It explains what these technologies are and 
              why we use them, as well as your rights to control our use of them.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">What Are Cookies?</h2>
            <p className="text-lg mb-4">
              Cookies are small data files that are placed on your computer or mobile device when you 
              visit a website. Cookies are widely used by website owners to make their websites work 
              efficiently and provide analytical information.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Types of Cookies We Use</h2>
            <p className="text-lg mb-4">
              We use the following types of cookies:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Essential Cookies:</strong> These cookies are necessary for the website to function 
                properly and cannot be switched off in our systems.
              </li>
              <li>
                <strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic 
                sources so we can measure and improve the performance of our site.
              </li>
              <li>
                <strong>Functional Cookies:</strong> These cookies enable the website to provide enhanced 
                functionality and personalization.
              </li>
              <li>
                <strong>Targeting Cookies:</strong> These cookies may be set through our site by our 
                advertising partners to build a profile of your interests.
              </li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">How to Manage Cookies</h2>
            <p className="text-lg mb-4">
              Most web browsers allow you to control cookies through their settings preferences. However, 
              if you limit the ability of websites to set cookies, you may worsen your overall user 
              experience, as it will no longer be personalized to you.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Changes to This Cookies Policy</h2>
            <p className="text-lg mb-4">
              We may update this Cookies Policy from time to time to reflect changes in technology, 
              regulation, or our business practices. We will notify you of any material changes by 
              posting the new Cookies Policy on our website.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p className="text-lg mb-4">
              If you have questions or concerns about this Cookies Policy, please contact us at 
              privacy@imaginarium.com.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
