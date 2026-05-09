'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DestinationCardProps {
  id: string;
  name: string;
  country: string;
  image: string;
  category: string;
  avgCost: number;
  summary: string;
}

const DestinationCard = ({ id, name, country, image, category, avgCost, summary }: DestinationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-card rounded-[3rem] overflow-hidden border border-border/60 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Category Badge */}
        <div className="absolute top-6 left-6">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3 text-accent" />
            <span>{category}</span>
          </div>
        </div>

        {/* Floating Price Tag */}
        <div className="absolute bottom-6 right-6">
          <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl shadow-xl shadow-primary/20 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-black flex items-center space-x-1">
            <span className="text-xs opacity-70">$</span>
            <span className="text-lg">{avgCost}</span>
            <span className="text-[10px] opacity-70 ml-1">/DAY</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 md:p-10 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-primary">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">{country}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-black">4.9</span>
          </div>
        </div>

        <h3 className="text-3xl font-black tracking-tight text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <p className="text-muted-foreground text-base leading-relaxed mb-8 line-clamp-3 font-medium">
          {summary}
        </p>

        <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Starting From</span>
            <span className="text-xl font-black text-foreground">${avgCost * 7}</span>
          </div>
          
          <Link href={`/destinations/${id}`}>
            <Button className="h-14 w-14 rounded-2xl bg-secondary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-all duration-300 p-0 shadow-sm">
              <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
