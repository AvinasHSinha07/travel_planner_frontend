'use client';

import React from 'react';
import { Send, Sparkles, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const Newsletter = () => {
  return (
    <section className="py-40 bg-background relative overflow-hidden">
      {/* Decorative Brand Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-primary/50 to-transparent" />
      
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[4rem] bg-[#002b42] p-12 md:p-24 overflow-hidden shadow-2xl border border-white/5"
        >
          {/* High-End Texture & Glow */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#edae49]/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-3 mb-8 bg-white/5 px-6 py-2 rounded-full border border-white/10">
              <Sparkles className="w-4 h-4 text-[#edae49]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">The Triplanner Journal</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-white leading-tight">
               WEEKLY <span className="text-[#edae49] italic font-serif">Luxury</span> CURATION.
            </h2>
            
            <p className="text-lg md:text-xl text-white/60 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
              Join 50,000+ elite travelers. Get the world's most exclusive travel guides and secret luxury deals delivered to your inbox.
            </p>

            <form className="relative max-w-xl mx-auto group">
              <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#edae49] transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <Input
                type="email"
                placeholder="Your professional email"
                className="h-20 pl-18 pr-40 rounded-2xl border-white/10 bg-white/5 backdrop-blur-3xl text-lg focus-visible:ring-[#edae49] text-white placeholder:text-white/30 font-medium transition-all"
                required
              />
              <div className="absolute inset-y-2 right-2">
                <Button className="h-16 px-10 rounded-xl text-lg font-black bg-[#edae49] hover:bg-[#edae49]/90 text-[#003d5b] shadow-xl shadow-[#edae49]/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Join Elite
                </Button>
              </div>
            </form>
            
            <p className="mt-8 text-[10px] text-white/30 font-black uppercase tracking-widest">
               Strictly exclusive. Zero spam. One-click unsubscribe.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
