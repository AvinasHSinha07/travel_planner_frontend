'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Hero from '@/components/home/Hero';
import Statistics from '@/components/home/Statistics';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import Newsletter from '@/components/home/Newsletter';
import { Sparkles, Shield, Zap, Globe, Compass, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: 'AI Itinerary Genius',
      description: 'Generate complete, day-by-day travel plans in seconds based on your personal interests.',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'bg-[#edae49]'
    },
    {
      title: 'Global Concierge',
      description: 'Access 24/7 support and real-time travel alerts anywhere in the world.',
      icon: <Globe className="w-6 h-6" />,
      color: 'bg-[#30638e]'
    },
    {
      title: 'Verified Luxury',
      description: 'Every accommodation and activity is hand-picked and verified for quality.',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-[#00798c]'
    },
    {
      title: 'Instant Booking',
      description: 'One-click checkout for flights, hotels, and experiences with zero hassle.',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-[#d1495b]'
    },
    {
      title: 'Hidden Gems',
      description: 'Our AI discovers unique, off-the-beaten-path locations that search engines miss.',
      icon: <Compass className="w-6 h-6" />,
      color: 'bg-[#003d5b]'
    },
    {
      title: 'Tailored for You',
      description: 'The more you travel, the better our AI understands your unique preferences.',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-primary'
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <Hero />

      <Statistics />

      {/* Features Section */}
      <section className="py-40 bg-secondary/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Engineered Excellence</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-foreground">
                THE FUTURE OF <span className="text-primary italic font-serif">Travel</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                Stop spending weeks planning. Let our advanced neural networks do the heavy lifting so you can focus on the extraordinary.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-background/50 backdrop-blur-xl border border-border/50 p-12 rounded-[3.5rem] hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-10 text-white shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-500`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <Testimonials />

      <FAQ />

      <Newsletter />

      {/* Final Call to Adventure (CTA) */}
      <section className="py-40 relative overflow-hidden bg-background">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#002b42] rounded-[5rem] p-16 md:p-32 text-center relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)]"
          >
            {/* High-End Accents */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <span className="text-[#edae49] font-black uppercase tracking-[0.5em] text-[10px] mb-8 block">Your Journey Starts Here</span>
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-10 leading-[0.9]">
                READY FOR THE <br /> <span className="text-[#edae49] italic font-serif">Extraordinary?</span>
              </h2>
              <p className="text-white/60 text-xl md:text-2xl mb-16 font-medium max-w-2xl mx-auto leading-relaxed">
                Join thousands of elite travelers using <span className="text-white font-bold">TRIPLANNERAI</span> to discover the world in a whole new dimension.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-20 px-16 rounded-2xl bg-[#edae49] hover:bg-[#edae49]/90 text-[#003d5b] text-xl font-black shadow-2xl shadow-[#edae49]/20 hover:scale-105 transition-all">
                    Create My First Plan
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </Link>
                <button className="text-white font-black uppercase tracking-widest text-xs hover:text-[#edae49] transition-colors px-8 py-4">
                  View Success Stories
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
