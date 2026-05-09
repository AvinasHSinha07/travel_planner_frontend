'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  Download, 
  ExternalLink, 
  FileText,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const news = [
  { date: 'May 12, 2026', title: 'Planora.AI Announces $50M Series B to Expand Luxury AI Concierge', source: 'Financial Times' },
  { date: 'Apr 28, 2026', title: 'Why AI is the Newest Must-Have Luxury Travel Accessory', source: 'Vogue Business' },
  { date: 'Apr 05, 2026', title: 'Planora.AI Partners with Leading Eco-Resorts for Sustainable Elite Travel', source: 'Travel + Leisure' },
  { date: 'Mar 15, 2026', title: 'The Future of Travel: How Neural Networks are Crafting Your Next Trip', source: 'Wired' },
];

const PressPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(48,99,142,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Megaphone className="w-5 h-5 text-secondary" />
              <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px]">Planora Press Room</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-8">
              LATEST <span className="text-primary italic font-serif">Stories</span> & <br />NEWS UPDATES.
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
              Stay updated with the latest breakthroughs in AI travel and luxury exploration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Media Kit Download */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-12 bg-[#002b42] rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Official Media Kit</h2>
              <p className="text-white/60 text-lg font-medium max-w-md">
                Download our high-resolution logos, team photos, and brand guidelines for your next story.
              </p>
            </div>
            <Button className="h-18 px-10 rounded-2xl bg-[#edae49] hover:bg-[#edae49]/90 text-[#003d5b] text-lg font-black shadow-xl shadow-[#edae49]/20 transition-all hover:scale-105 shrink-0 relative z-10">
              DOWNLOAD ASSETS (45MB)
              <Download className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-24 bg-secondary/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {news.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-background border border-border/60 rounded-[3rem] hover:border-primary hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3 text-xs font-black text-primary uppercase tracking-[0.2em]">
                    <Calendar className="w-4 h-4" />
                    <span>{item.date}</span>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-3 py-1 bg-secondary/10 rounded-full">
                    {item.source}
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-8 group-hover:text-primary transition-colors leading-tight">
                  "{item.title}"
                </h3>
                <div className="flex items-center text-foreground font-black text-xs uppercase tracking-widest">
                  View Full Article <ExternalLink className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Press Section */}
      <section className="py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-10">
               <FileText className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl font-black mb-8">PRESS CONTACT</h2>
            <p className="text-xl text-muted-foreground font-medium mb-12">
              For media inquiries, interview requests, or partnership opportunities, please contact our global communications team.
            </p>
            <div className="p-8 bg-card border border-border/50 rounded-3xl inline-block">
               <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Global Press Office</p>
               <p className="text-2xl font-black text-primary">press@planora.ai</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default PressPage;
