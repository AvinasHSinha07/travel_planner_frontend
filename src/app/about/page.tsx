'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Sparkles, 
  Rocket, 
  Users, 
  Heart,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Luxury Hero Section */}
      <section className="relative pt-48 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(237,174,73,0.05),transparent_50%)]" />
        <div className="container mx-auto px-6">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-[2px] bg-primary" />
                <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Our Origin Story</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-10 leading-[0.9]">
                REDEFINING THE <br />
                <span className="text-primary italic font-serif">Art</span> OF EXPLORATION.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl mb-12">
                Planora.AI was born from a simple realization: in an era of infinite choices, true luxury lies in perfect curation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-secondary/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative rounded-[4rem] overflow-hidden shadow-2xl h-[600px]"
            >
              <img 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800" 
                className="w-full h-full object-cover"
                alt="Mission"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003d5b]/80 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <h3 className="text-3xl font-black text-white mb-4 italic font-serif">The Human-AI Synergy</h3>
                <p className="text-white/70 text-lg font-medium">We blend cutting-edge neural networks with elite human expertise to create travel that breathes.</p>
              </div>
            </motion.div>

            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-black mb-8">OUR MISSION</h2>
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  To eliminate the stress of planning and replace it with the wonder of discovery. We believe that every traveler deserves a journey that is as unique as their own signature.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-background border border-border rounded-3xl shadow-sm hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-black mb-2">Excellence</h4>
                  <p className="text-sm text-muted-foreground font-medium">We never settle for "good enough." Only the extraordinary makes the cut.</p>
                </div>
                <div className="p-8 bg-background border border-border rounded-3xl shadow-sm hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-black mb-2">Sustainability</h4>
                  <p className="text-sm text-muted-foreground font-medium">Luxury shouldn't cost the Earth. We prioritize eco-conscious elite stays.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Team (Mock) */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">The Minds Behind Planora</span>
            <h2 className="text-5xl font-black tracking-tight">MEET THE VISIONARIES</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: 'Alexander Vance', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
              { name: 'Elena Rodriguez', role: 'Chief Travel Architect', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
              { name: 'Julian Chen', role: 'Head of AI Engineering', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative h-[450px] rounded-[3rem] overflow-hidden mb-6">
                  <img 
                    src={member.image} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    alt={member.name}
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl font-black mb-2">{member.name}</h3>
                <p className="text-primary font-bold text-xs uppercase tracking-widest">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-[#003d5b] text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Destinations', value: '1,200+' },
              { label: 'AI Plans Generated', value: '450K+' },
              { label: 'Happy Travelers', value: '85K+' },
              { label: 'Luxury Partners', value: '300+' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-5xl md:text-7xl font-black mb-4 text-[#edae49]">{stat.value}</p>
                <p className="text-white/50 font-black uppercase tracking-widest text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutPage;
