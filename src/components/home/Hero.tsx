'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, Compass, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary/10 via-primary/5 to-transparent -z-10" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center space-x-3 mb-8 bg-secondary/5 px-6 py-3 rounded-2xl border border-border/50">
                <Bell className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Get the best travel deals first</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9] mb-10">
                READY FOR YOUR <br />
                <span className="text-primary italic font-serif">Next</span> <br />
                ADVENTURE?
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-xl font-medium">
                Experience the pinnacle of AI-driven travel planning. <span className="text-foreground font-bold">TRIPLANNERAI</span> crafts bespoke, high-end itineraries that transform ordinary trips into legendary escapes.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
                <Link href="/destinations" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-20 px-12 rounded-2xl text-xl font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-300">
                    Explore Now
                    <Compass className="ml-3 w-6 h-6" />
                  </Button>
                </Link>
                
                <button className="flex items-center space-x-4 text-foreground font-black group px-6 py-3 rounded-2xl hover:bg-secondary/5 transition-all">
                  <div className="w-14 h-14 rounded-full border-2 border-border flex items-center justify-center bg-background group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current text-primary ml-1" />
                  </div>
                  <span className="text-lg uppercase tracking-widest text-[11px]">The Experience</span>
                </button>
              </div>

              {/* Trusted By / Social Proof */}
              <div className="mt-20 pt-10 border-t border-border/50 flex flex-wrap items-center gap-10 opacity-40 grayscale">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Trusted by Elite Travelers</span>
                <div className="flex items-center space-x-8">
                   <div className="h-6 w-24 bg-foreground/20 rounded-full" />
                   <div className="h-6 w-32 bg-foreground/20 rounded-full" />
                   <div className="h-6 w-28 bg-foreground/20 rounded-full" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              {/* Main Luxury Image Card */}
              <div className="relative rounded-[4rem] overflow-hidden shadow-[0_60px_100px_rgba(48,99,142,0.2)] border-[12px] border-white/5 bg-background group">
                <img
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
                  alt="Adventure"
                  className="w-full aspect-[4/5] object-cover transition-transform duration-[4000ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003d5b]/90 via-transparent to-transparent" />
                
                {/* Floating Content Overlay */}
                <div className="absolute bottom-12 left-8 right-8">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="p-8 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] text-white"
                  >
                    <div className="flex items-center space-x-2 mb-4">
                       <Sparkles className="w-4 h-4 text-[#edae49]" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#edae49]">Curated Experience</span>
                    </div>
                    <h3 className="text-3xl font-black mb-2">Glacial Expeditions</h3>
                    <p className="text-white/60 font-medium text-sm">Discover the untouched serenity of the Swiss Alps with our AI-guided luxury treks.</p>
                  </motion.div>
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-12 -left-12 bg-background p-8 rounded-[3rem] shadow-2xl border border-border/50 z-20"
              >
                 <div className="flex flex-col items-center">
                    <span className="text-3xl font-black text-primary">24/7</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">AI Concierge</span>
                 </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-10 -right-10 bg-[#edae49] p-8 rounded-[3rem] shadow-2xl z-20"
              >
                 <div className="flex flex-col items-center">
                    <ArrowRight className="w-8 h-8 text-[#003d5b]" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#003d5b] mt-2">Next Destination</span>
                 </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
