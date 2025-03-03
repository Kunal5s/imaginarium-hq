
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 px-4">
        <section className="py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">About Us</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-4">
              Welcome to Imaginarium, where cutting-edge artificial intelligence meets creative expression.
              Our platform enables artists, designers, marketers, and enthusiasts to generate beautiful, 
              high-quality images with just a few simple prompts.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
            <p className="text-lg mb-4">
              At Imaginarium, our mission is to democratize digital art creation by making advanced AI image 
              generation technology accessible to everyone. We believe that creativity should not be limited 
              by technical skill or resources, and our platform exists to empower people to bring their 
              imagination to life.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Technology</h2>
            <p className="text-lg mb-4">
              Powered by state-of-the-art AI models, our image generator produces high-quality, unique 
              images based on text descriptions. Our technology understands context, style, and detail, 
              allowing you to create images that perfectly match your vision.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Team</h2>
            <p className="text-lg mb-4">
              Imaginarium was founded by a team of AI researchers, artists, and software engineers passionate 
              about the intersection of technology and creativity. With decades of combined experience in 
              machine learning and digital art, our team is dedicated to pushing the boundaries of what's 
              possible with AI-generated imagery.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Join Our Community</h2>
            <p className="text-lg mb-4">
              We invite you to join our growing community of creators, innovators, and dreamers who are 
              using Imaginarium to transform their ideas into stunning visuals. Whether you're a professional 
              designer or just getting started with digital art, our platform has something to offer you.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
