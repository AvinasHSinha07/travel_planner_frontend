'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  User, 
  ChevronRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const guides = [
  {
    title: 'The Unspoken Rules of Santorini Luxury',
    excerpt: 'Discover why the most exclusive villas aren\'t on the main road, and how to access the private caldera dining experiences.',
    category: 'Expert Advice',
    author: 'Elena Rodriguez',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57'
  },
  {
    title: 'Kyoto Beyond the Temples',
    excerpt: 'A deep dive into the Gion district\'s hidden tea houses and the secret artisans of the Higashiyama mountains.',
    category: 'Cultural Deep-Dive',
    author: 'Kenji Sato',
    readTime: '15 min read',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e'
  },
  {
    title: 'Patagonian Peaks: A Glacial Odyssey',
    excerpt: 'Why the shoulder season is actually the best time for luxury trekking in the heart of the Torres del Paine.',
    category: 'Adventure',
    author: 'Marco Polo',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd'
  }
];

const TravelGuidesPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(48,99,142,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center space-x-3 mb-6">
              <BookOpen className="w-5 h-5 text-secondary" />
              <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px]">The Planora Journal</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-8">
              INSIDER <span className="text-primary italic font-serif">Knowledge</span> <br />FOR THE ELITE.
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
              Deep dives into the worlds most exclusive locales, curated by our global network of travel architects.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Guide (Large) */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative h-[700px] rounded-[4rem] overflow-hidden group cursor-pointer shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1" 
              className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
              alt="Featured Guide"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-16 left-16 right-16">
              <div className="flex items-center space-x-3 mb-6">
                <span className="px-4 py-2 bg-[#edae49] text-[#003d5b] rounded-full text-[10px] font-black uppercase tracking-widest">Editor's Choice</span>
                <span className="text-white/60 font-black text-[10px] uppercase tracking-widest">May 2026</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 max-w-4xl leading-tight">
                THE ALPS: <span className="italic font-serif">Above</span> THE CLOUDS.
              </h2>
              <p className="text-white/70 text-xl font-medium max-w-2xl mb-10 leading-relaxed">
                Why the new era of high-altitude luxury is focusing on wellness, silence, and the science of pure air.
              </p>
              <Button className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-white/90 text-lg font-black transition-all hover:scale-105">
                READ THE FEATURE
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid of Guides */}
      <section className="py-24 bg-secondary/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Latest Stories</h2>
            <div className="flex items-center space-x-4">
              {['All', 'Culture', 'Luxury', 'Adventure', 'Tips'].map((cat) => (
                <button key={cat} className="px-6 py-2 rounded-full border border-border/50 text-xs font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {guides.map((guide, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative h-80 rounded-[3rem] overflow-hidden mb-8 shadow-xl">
                  <img 
                    src={guide.image} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={guide.title}
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                      {guide.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors leading-tight">
                  {guide.title}
                </h3>
                <p className="text-muted-foreground font-medium mb-8 line-clamp-3 leading-relaxed">
                  {guide.excerpt}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  <div className="flex items-center space-x-3 text-xs font-black text-foreground/60 uppercase tracking-widest">
                    <User className="w-4 h-4 text-primary" />
                    <span>{guide.author}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <Clock className="w-4 h-4" />
                    <span>{guide.readTime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-black mb-8">SUBSCRIBE TO THE JOURNAL</h2>
            <p className="text-xl text-muted-foreground font-medium mb-12">
              Get the worlds most exclusive travel insights delivered to your inbox once a month. No spam, just pure inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow h-16 px-8 rounded-2xl bg-secondary/10 border-border/50 focus:border-primary outline-none text-lg font-medium"
              />
              <Button className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                JOIN NOW
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TravelGuidesPage;
