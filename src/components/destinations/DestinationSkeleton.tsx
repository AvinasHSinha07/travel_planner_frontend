import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const DestinationSkeleton = () => {
  return (
    <div className="bg-card rounded-[3rem] overflow-hidden border border-border/60 shadow-sm animate-pulse">
      <div className="h-80 bg-secondary/10" />
      <div className="p-8 md:p-10 space-y-4">
        <div className="h-3 w-1/4 bg-secondary/10 rounded-full" />
        <div className="h-8 w-3/4 bg-secondary/10 rounded-xl" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-secondary/10 rounded-full" />
          <div className="h-4 w-5/6 bg-secondary/10 rounded-full" />
        </div>
        <div className="pt-6 border-t border-border/50 flex items-center justify-between">
          <div className="h-6 w-12 bg-secondary/10 rounded-full" />
          <div className="h-6 w-20 bg-secondary/10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default DestinationSkeleton;
