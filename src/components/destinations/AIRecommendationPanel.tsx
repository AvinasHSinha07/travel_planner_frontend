'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';

interface Recommendation {
  destinationId: string;
  name: string;
  country: string;
  matchScore: number;
  reason: string;
  bestTimeToVisit: string;
  estimatedCostPerDay: number;
}

const AIRecommendationPanel = () => {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['ai-recommendations', userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await axiosInstance.post('/ai/recommendations');
      return response.data.data as Recommendation[];
    },
    enabled: !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  if (!userId) {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[2.5rem] p-8 border border-primary/10">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-black uppercase tracking-widest">AI Recommendations</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-6">
          Sign in to get personalized destination recommendations based on your travel preferences.
        </p>
        <Link href="/login">
          <Button className="w-full rounded-xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[2.5rem] p-8 border border-primary/10">
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-black uppercase tracking-widest">AI Recommendations</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-background/50 rounded-2xl p-4 h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[2.5rem] p-8 border border-primary/10">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-black uppercase tracking-widest">AI Recommendations</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          Set your travel preferences in your profile to get AI-powered destination recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[2.5rem] p-8 border border-primary/10">
      <div className="flex items-center space-x-2 mb-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-black uppercase tracking-widest">AI Recommendations</h3>
      </div>
      <p className="text-muted-foreground text-sm mb-6">
        Personalized picks based on your preferences
      </p>

      <div className="space-y-4">
        {recommendations.slice(0, 5).map((rec, index) => (
          <motion.div
            key={rec.destinationId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/destinations/${rec.destinationId}`}>
              <div className="group bg-background/50 hover:bg-background rounded-2xl p-4 transition-all cursor-pointer border border-transparent hover:border-primary/20">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-black text-foreground group-hover:text-primary transition-colors">
                      {rec.name}
                    </h4>
                    <div className="flex items-center space-x-1 text-muted-foreground text-xs">
                      <MapPin className="w-3 h-3" />
                      <span>{rec.country}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 bg-primary/10 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    <span className="text-xs font-black text-primary">{rec.matchScore}%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {rec.reason}
                </p>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>Best: {rec.bestTimeToVisit}</span>
                  <span>${rec.estimatedCostPerDay}/day</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <Link href="/destinations">
        <Button 
          variant="ghost" 
          className="w-full mt-6 text-primary font-black uppercase text-xs tracking-widest hover:bg-primary/10"
        >
          View All Destinations
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
};

export default AIRecommendationPanel;
