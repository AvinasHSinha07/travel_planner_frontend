'use client';

import React, { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { motion } from 'framer-motion';
import { 
  Search, 
  LifeBuoy, 
  ShieldCheck, 
  CreditCard, 
  Map, 
  MessageCircle, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const categories = [
  { icon: Map, title: 'Trip Planning', description: 'Learn how to use our AI to craft perfect itineraries.' },
  { icon: CreditCard, title: 'Payments & Pricing', description: 'Everything you need to know about luxury booking fees.' },
  { icon: ShieldCheck, title: 'Safety & Trust', description: 'How we ensure your travel experience is secure.' },
  { icon: MessageCircle, title: 'Concierge Support', description: 'Getting the most out of our 24/7 support team.' },
];

const faqs = [
  { q: "How does the AI create my itinerary?", a: "Planora.AI uses advanced neural networks to analyze millions of data points including climate, local events, and exclusive accessibility to create a bespoke journey tailored to your soul." },
  { q: "Can I modify a generated trip?", a: "Absolutely. Our AI is collaborative. You can adjust preferences, swap destinations, or ask the AI to 'Make it more adventurous' at any time." },
  { q: "What is included in the AI Fee?", a: "For a limited time, our basic AI generation is free. Our Premium Concierge service includes real-time flight tracking and 24/7 priority human assistance." },
  { q: "How do you handle my data?", a: "Your privacy is our priority. We encrypt all travel data and never share your personal preferences with third-party vendors without explicit consent." },
];

const SupportPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(48,99,142,0.1),transparent_70%)] -z-10" />
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-black uppercase tracking-widest text-[10px] mb-8">
              <LifeBuoy className="w-4 h-4" />
              <span>Dedicated Concierge</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
              HOW CAN WE <br /> <span className="text-primary italic font-serif">Assist</span> YOU?
            </h1>
            
            {/* Search Bar */}
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Search className="w-6 h-6" />
              </div>
              <Input
                type="text"
                placeholder="Search topics, tutorials, or safety guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-20 pl-16 pr-8 rounded-[2rem] border-border/60 bg-background/50 backdrop-blur-3xl text-xl shadow-2xl shadow-primary/5 focus-visible:ring-primary transition-all text-foreground font-medium"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-card border border-border/60 rounded-[3rem] hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer"
              >
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                  <item.icon className="w-8 h-8 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-black mb-4">{item.title}</h3>
                <p className="text-muted-foreground font-medium mb-6 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center text-primary font-black text-xs uppercase tracking-widest">
                  Explore <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tight mb-4">FREQUENT QUESTIONS</h2>
              <p className="text-muted-foreground font-medium">Quick answers from the Planora AI experts.</p>
            </div>
            
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="p-8 bg-background border border-border/60 rounded-3xl hover:shadow-lg transition-all"
                >
                  <h4 className="text-lg font-black mb-4 flex items-center">
                    <Sparkles className="w-4 h-4 mr-3 text-accent" />
                    {faq.q}
                  </h4>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto bg-[#002b42] p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
             <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">Still need help?</h2>
             <p className="text-white/60 text-xl font-medium mb-12 max-w-xl mx-auto relative z-10">
               Our elite concierge team is available 24/7 to ensure your luxury travel experience is flawless.
             </p>
             <button className="px-12 h-18 bg-[#edae49] hover:bg-[#edae49]/90 text-[#003d5b] rounded-full text-xl font-black shadow-xl shadow-[#edae49]/20 transition-all hover:scale-105 relative z-10">
               Message Concierge
             </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default SupportPage;
