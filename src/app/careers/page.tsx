'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Heart, 
  Coffee, 
  Globe, 
  Briefcase,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const roles = [
  { title: 'Senior AI Engineer', team: 'Intelligence', location: 'London / Remote', type: 'Full-time' },
  { title: 'Luxury Travel Architect', team: 'Experience', location: 'Tokyo', type: 'Full-time' },
  { title: 'Product Designer', team: 'Design', location: 'San Francisco / Remote', type: 'Full-time' },
  { title: 'Global Concierge Lead', team: 'Operations', location: 'Dubai', type: 'Full-time' },
];

const CareersPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -z-10 blur-[120px]" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Rocket className="w-5 h-5 text-primary" />
              <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Careers at Planora</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-10 leading-[0.9]">
              ENGINEER THE <br />
              <span className="text-primary italic font-serif">Future</span> OF TRAVEL.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
              We're looking for visionaries, artists, and engineers to build the world's first truly intelligent luxury travel platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-24 bg-secondary/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Globe, title: 'Work From Anywhere', desc: 'Our team is global. Work from a beach in Bali or a coffee shop in Paris.' },
              { icon: Heart, title: 'Travel Stipends', desc: 'We believe you should experience what we build. Annual $5k travel budget.' },
              { icon: Coffee, title: 'Luxury Perks', desc: 'From premium equipment to world-class health coverage and wellness programs.' },
            ].map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="p-10 bg-background border border-border rounded-[3rem] shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-8">
                  <perk.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black mb-4">{perk.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {perk.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
            <h2 className="text-4xl font-black tracking-tight uppercase">OPEN POSITIONS</h2>
            <div className="flex space-x-4">
              <span className="text-sm font-bold bg-primary/10 text-primary px-4 py-1 rounded-full">4 Available Roles</span>
            </div>
          </div>

          <div className="space-y-4">
            {roles.map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-card border border-border/60 rounded-[2.5rem] hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-8"
              >
                <div>
                  <h3 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors">{role.title}</h3>
                  <div className="flex items-center space-x-6 text-sm font-black text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center"><Briefcase className="w-4 h-4 mr-2" /> {role.team}</span>
                    <span className="flex items-center"><Globe className="w-4 h-4 mr-2" /> {role.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                   <span className="text-xs font-black text-primary/60 uppercase tracking-widest">{role.type}</span>
                   <Button className="h-14 w-14 rounded-2xl bg-secondary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-all duration-300 p-0">
                      <ArrowRight className="w-6 h-6" />
                   </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Diversity Section */}
      <section className="py-32 bg-[#003d5b] text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(237,174,73,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-8">BUILDING FOR EVERYONE</h2>
            <p className="text-xl text-white/60 font-medium leading-relaxed mb-12">
              Planora.AI is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees. Our travel platform is global, and our team is too.
            </p>
            <Button className="h-18 px-12 rounded-full bg-[#edae49] text-[#003d5b] text-xl font-black shadow-xl shadow-[#edae49]/20 hover:scale-105 transition-all">
              LEARN ABOUT OUR CULTURE
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CareersPage;
