'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Globe, 
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const safetyFeatures = [
  { 
    icon: Lock, 
    title: 'Data Integrity', 
    content: 'We use military-grade encryption to protect your travel preferences and personal data. Your itineraries are private by default and only accessible by you and your designated travel partners.' 
  },
  { 
    icon: ShieldCheck, 
    title: 'Verified Partners', 
    content: 'Every villa, resort, and activity in our database undergoes a multi-step verification process to ensure they meet the Planora.AI standard of excellence and safety.' 
  },
  { 
    icon: Globe, 
    title: 'Global Monitoring', 
    content: 'Our AI continuously monitors global travel advisories, local news, and weather patterns in real-time, proactively alerting you if your planned experience might be affected.' 
  },
  { 
    icon: Users, 
    title: 'Community Trust', 
    content: 'A community of over 10,000 elite travelers helps maintain high standards through rigorous post-travel reviews and real-time safety reporting.' 
  },
];

const SafetyPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -z-10 blur-[120px]" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-primary/10">
               <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
              OUR <span className="text-primary italic font-serif">Trust</span> COMMITMENT
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
              At Planora.AI, safety isn't just a feature—it's the bedrock of every luxury experience we craft.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {safetyFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="p-12 bg-card border border-border/60 rounded-[3.5rem] hover:border-primary/40 hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex items-start space-x-8">
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-6">{feature.title}</h3>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                      {feature.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-24 bg-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-background p-16 md:p-24 rounded-[4rem] border border-border shadow-2xl relative overflow-hidden">
             <div className="absolute top-10 left-10 opacity-5">
               <Sparkles className="w-40 h-40" />
             </div>
             
             <div className="relative z-10">
               <h2 className="text-3xl font-black uppercase tracking-widest mb-12">Planora Safety Standards</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 {[
                   'Zero-tolerance for unverified activity listings',
                   'End-to-end encryption for all traveler communication',
                   'Proactive AI rerouting during travel disruptions',
                   'Dedicated 24/7 emergency response protocols',
                   'Strict background checks for all private transport partners',
                   'Insurance integration with world-class providers'
                 ].map((item, i) => (
                   <div key={i} className="flex items-center space-x-5">
                     <CheckCircle2 className="w-6 h-6 text-primary" />
                     <span className="text-xl font-bold text-foreground/80">{item}</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default SafetyPage;
