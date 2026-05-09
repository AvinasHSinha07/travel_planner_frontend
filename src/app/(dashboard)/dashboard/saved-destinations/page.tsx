'use client';

import React from 'react';
import { Heart, MapPin, Loader2, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const SavedDestinationsPage = () => {
  // This would typically fetch from an API
  const savedDestinations: any[] = [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground uppercase mb-2">
          Saved Destinations
        </h1>
        <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
          Your Personal Travel Bucket List
        </p>
      </div>

      {savedDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mapping would go here */}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-border">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-black mb-2">No saved destinations yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Explore the world and heart your favorite spots to see them here!
          </p>
          <Link href="/dashboard">
            <Button className="h-16 px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest">
              <Compass className="w-5 h-5 mr-2" />
              Discover Places
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedDestinationsPage;
