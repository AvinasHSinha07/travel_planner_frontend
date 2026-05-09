'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, Compass, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import axiosInstance from '@/lib/axiosInstance';
import DestinationCard from '@/components/destinations/DestinationCard';
import { useSession } from '@/lib/auth-client';

type DestinationRow = {
  id: string;
  name: string;
  country: string;
  images?: string[];
  category: string;
  avgCostPerDay: number;
  summary: string;
};

const SavedDestinationsPage = () => {
  const { data: session, isPending: sessionLoading } = useSession();

  const { data: savedDestinations = [], isLoading, isError } = useQuery({
    queryKey: ['saved-destinations'],
    queryFn: async () => {
      const response = await axiosInstance.get('/saved-destinations');
      return response.data.data as DestinationRow[];
    },
    enabled: !!session?.user?.id,
  });

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase mb-2">
            Saved Destinations
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
            Sign in to view your bucket list
          </p>
        </div>
        <div className="text-center py-16 bg-secondary/5 rounded-[3rem] border border-border">
          <Link href="/login">
            <Button className="h-14 px-8 rounded-2xl font-black uppercase text-xs tracking-widest">
              Log in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center py-16 rounded-[3rem] border border-destructive/30 bg-destructive/5">
          <p className="text-muted-foreground font-medium">Could not load saved destinations.</p>
          <Link
            href="/destinations"
            className={cn(buttonVariants(), 'mt-6 inline-flex rounded-2xl')}
          >
            Browse destinations
          </Link>
        </div>
      ) : savedDestinations.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {savedDestinations.map((destination: DestinationRow) => (
            <DestinationCard
              key={destination.id}
              id={destination.id}
              name={destination.name}
              country={destination.country}
              image={
                destination.images?.[0] ||
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
              }
              category={destination.category}
              avgCost={destination.avgCostPerDay}
              summary={destination.summary}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-border">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-black mb-2">No saved destinations yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Explore the world and heart your favorite spots to see them here!
          </p>
          <Link href="/destinations">
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
