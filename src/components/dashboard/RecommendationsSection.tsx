'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { Sparkles, MapPin, Star, TrendingUp, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface Recommendation {
  destinationId: string;
  name: string;
  country: string;
  matchScore: number;
  reason: string;
  bestTimeToVisit: string;
  estimatedCostPerDay: number;
}

const RecommendationsSection = () => {
  const { data: recommendations, isLoading, isError } = useQuery({
    queryKey: ['ai-recommendations'],
    queryFn: async () => {
      const response = await axiosInstance.post('/ai/recommendations');
      return response.data.data as Recommendation[];
    },
  });

  if (isLoading) {
    return (
      <div className="p-10 bg-card border border-border/50 rounded-[3rem] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Architecting recommendations...</p>
      </div>
    );
  }

  if (isError || !recommendations?.length) {
    return null; // Don't show anything if there's an error or no recommendations
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px]">AI-Powered Insights</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase">
            Curated For <span className="text-primary italic font-serif lowercase">You</span>
          </h2>
        </div>
        <Link 
          href="/destinations" 
          className="group flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          <span>Explore All</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.slice(0, 3).map((rec, i) => (
          <motion.div
            key={rec.destinationId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-card border border-border/50 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-primary">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{rec.country}</span>
                  </div>
                  <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{rec.name}</h3>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center space-x-1 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-[10px] font-black">{rec.matchScore}%</span>
                   </div>
                   <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground mt-1">Match Score</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-8 line-clamp-3 italic">
                "{rec.reason}"
              </p>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Best Season</p>
                  <p className="text-[10px] font-black text-foreground uppercase">{rec.bestTimeToVisit}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Avg. Cost</p>
                  <p className="text-[10px] font-black text-foreground uppercase">${rec.estimatedCostPerDay}/day</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RecommendationsSection;
