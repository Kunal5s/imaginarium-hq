
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We've received your message and will get back to you soon.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 px-4">
        <section className="py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-lg mb-6">
                Have questions about our services? Want to learn more about how 
                Imaginarium can help bring your creative visions to life? We'd love to hear from you.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">
                    123 AI Street<br />
                    Imaginarium City, IC 12345
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">info@imaginarium.com</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">(123) 456-7890</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Hours</h3>
                  <p className="text-muted-foreground">Monday - Friday: 9am - 5pm EST</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-2">Name</label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2">Email</label>
                  <Input id="email" type="email" placeholder="Your email" required />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2">Subject</label>
                  <Input id="subject" placeholder="Message subject" required />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2">Message</label>
                  <textarea
                    id="message"
                    className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>
                
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
