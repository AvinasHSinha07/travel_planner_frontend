'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, Play, Compass, Bell, Globe, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-background">
      {/* Background Orbs & Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[60%] h-[80%] bg-primary/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[70%] bg-accent/10 rounded-full blur-[100px]" 
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 xl:col-span-6 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center space-x-2 mb-8 bg-primary/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-primary/20"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-secondary/20 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Join 50k+ Elite Travelers</span>
              </motion.div>
              
              <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black tracking-tight text-foreground leading-[1] mb-8 lg:mb-10">
                AI-CRAFTED <br />
                <span className="text-primary italic font-serif relative">
                  Legendary
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span> <br />
                ESCAPES.
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl font-medium">
                Ditch the generic. <span className="text-foreground font-bold">TRIPLANNERAI</span> orchestrates bespoke journeys tailored to your unique soul, powered by the world's most sophisticated travel AI.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href="/destinations" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-16 sm:h-20 px-10 sm:px-12 rounded-2xl text-lg sm:text-xl font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-300">
                    Plan Your Trip
                    <ArrowRight className="ml-3 w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </Link>
                
                <button className="flex items-center space-x-3 text-foreground font-black group px-6 py-3 rounded-2xl hover:bg-secondary/5 transition-all">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-border flex items-center justify-center bg-background group-hover:scale-110 transition-transform shadow-xl">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-primary ml-1" />
                  </div>
                  <span className="text-[11px] sm:text-xs uppercase tracking-widest">Watch Story</span>
                </button>
              </div>

              {/* Stats / Proof */}
              <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border/50 pt-10">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-foreground">99%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accuracy</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-foreground">24/7</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI Support</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-foreground">150+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Countries</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 xl:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] lg:max-w-none lg:h-[700px]">
              {/* Main Image Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full h-full rounded-[4rem] overflow-hidden shadow-[0_80px_120px_-20px_rgba(0,0,0,0.3)] border-[10px] sm:border-[16px] border-white/10 backdrop-blur-sm"
              >
                <img
                  src="/luxury_travel_hero_background_1778426973244.png"
                  alt="Luxury Travel Experience"
                  className="w-full h-full object-cover transition-transform duration-[5000ms] hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Image Overlay Content */}
                <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-10 right-6 sm:right-10">
                  <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="p-6 sm:p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] text-white"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                       <MapPin className="w-4 h-4 text-accent" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-accent">Amalfi Coast, Italy</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black mb-2 uppercase tracking-tighter">Azure Horizon Villa</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-white/60 font-medium text-xs sm:text-sm">Exclusive AI Recommendation</p>
                      <div className="flex items-center text-accent">
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                style={{ y: y1 }}
                className="absolute -top-10 -right-4 sm:-right-10 z-20 bg-background/80 backdrop-blur-xl p-5 sm:p-8 rounded-[2.5rem] shadow-2xl border border-border/50 flex items-center space-x-5"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                   <Globe className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                   <p className="text-lg sm:text-2xl font-black text-foreground leading-none">Instant</p>
                   <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Translation</p>
                </div>
              </motion.div>

              <motion.div
                style={{ y: y2 }}
                className="absolute -bottom-10 -left-4 sm:-left-12 z-20 bg-primary p-6 sm:p-10 rounded-[3rem] shadow-2xl flex flex-col items-center"
              >
                <Compass className="w-8 h-8 sm:w-12 sm:h-12 text-primary-foreground animate-spin-slow" />
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-primary-foreground/70 mt-3">Smart Scan</span>
              </motion.div>

              {/* Decorative Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-2 border-dashed border-primary/10 rounded-full animate-spin-slow -z-10 hidden lg:block" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

