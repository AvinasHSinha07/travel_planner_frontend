'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import DestinationCard from '@/components/destinations/DestinationCard';
import { Search, Compass, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDebounce } from 'use-debounce';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DestinationSkeleton from '@/components/destinations/DestinationSkeleton';

const DestinationsGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);

  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ['destinations', debouncedSearch, category, sortOrder, page],
    queryFn: async () => {
      const response = await axiosInstance.get(`/destination`, {
        params: { 
          searchTerm: debouncedSearch,
          category: category === 'All' ? undefined : category,
          sortBy: 'avgCostPerDay',
          sortOrder: sortOrder,
          page,
          limit: 8
        },
      });
      return response.data;
    },
  });

  const data = response?.data || [];
  const meta = response?.meta;

  const categories = ['All', 'Beach', 'City', 'Mountain', 'Cultural', 'Nature'];

  if (isError) {
    const errorMessage = (error as any)?.message || "We couldn't connect to our destination servers.";
    const isNetworkError = errorMessage.toLowerCase().includes('network error') || errorMessage.toLowerCase().includes('failed to fetch');

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
             <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4">
            {isNetworkError ? "Connection Failed" : "Data Error"}
          </h2>
          <p className="text-muted-foreground font-medium mb-6 leading-relaxed">
            {errorMessage}
          </p>
          <div className="bg-secondary/20 p-4 rounded-2xl mb-8 text-xs font-mono text-left overflow-auto max-h-32 border border-border/50">
            <span className="text-destructive font-bold">Trace:</span> {JSON.stringify(error)}
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="rounded-full px-10 h-16 font-black bg-primary shadow-xl shadow-primary/20 hover:scale-105 transition-all"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header Section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(48,99,142,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px]">World-Class Curation</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-8 leading-tight">
                Curated <span className="text-primary italic font-serif">Destinations</span> <br /> For The Elite.
              </h1>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-2xl group"
            >
              <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Search className="w-6 h-6" />
              </div>
              <Input
                type="text"
                placeholder="Search by city, country or vibe..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // Reset to first page on search
                }}
                className="h-20 pl-18 pr-12 rounded-[2rem] border-border/60 bg-background/50 backdrop-blur-3xl text-xl shadow-2xl shadow-primary/5 focus-visible:ring-primary transition-all text-foreground placeholder:text-muted-foreground/50 font-medium"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 mb-16">
            <div className="flex flex-col space-y-4">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Refine Discovery</span>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setPage(1); // Reset to first page on category change
                    }}
                    className={cn(
                      "px-8 py-3 rounded-2xl text-xs font-black transition-all border uppercase tracking-wider",
                      category === cat 
                        ? "bg-foreground text-background border-foreground shadow-xl shadow-foreground/10" 
                        : "bg-background text-muted-foreground border-border/60 hover:border-primary hover:text-primary"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
 
            <div className="flex items-center space-x-6">
               <div className="flex flex-col space-y-4 w-full sm:w-auto">
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Sort Order</span>
                 <Select value={sortOrder} onValueChange={(val) => {
                   setSortOrder(val || 'asc');
                   setPage(1); // Reset to first page on sort change
                 }}>
                  <SelectTrigger className="w-[240px] h-14 rounded-2xl bg-background border-border/60 font-black text-xs uppercase tracking-widest text-foreground focus:ring-primary shadow-sm">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border/60 rounded-2xl shadow-2xl">
                    <SelectItem value="asc" className="font-bold py-3 uppercase text-[10px] tracking-widest">Price: Low to High</SelectItem>
                    <SelectItem value="desc" className="font-bold py-3 uppercase text-[10px] tracking-widest">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
               </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <DestinationSkeleton key={i} />
              ))}
            </div>
          ) : data?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.map((destination: any) => (
                  <DestinationCard
                    key={destination.id}
                    id={destination.id}
                    name={destination.name}
                    country={destination.country}
                    image={destination.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'}
                    category={destination.category}
                    avgCost={destination.avgCostPerDay}
                    summary={destination.summary}
                  />
                ))}
              </div>

              {/* Pagination */}
              {meta && meta.totalPage > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-20">
                  <Button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    variant="outline"
                    className="rounded-xl h-12 px-6 font-black uppercase text-[10px] tracking-widest border-border/60"
                  >
                    Previous
                  </Button>
                  <div className="flex space-x-2">
                    {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn(
                          "w-12 h-12 rounded-xl font-black text-xs transition-all",
                          page === p 
                            ? "bg-foreground text-background shadow-lg" 
                            : "bg-secondary/10 text-foreground hover:bg-secondary/20"
                        )}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
                    disabled={page === meta.totalPage}
                    variant="outline"
                    className="rounded-xl h-12 px-6 font-black uppercase text-[10px] tracking-widest border-border/60"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-40 bg-secondary/20 rounded-[3rem] border-2 border-dashed border-border">
              <Compass className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2 text-foreground">No destinations found</h3>
              <p className="text-muted-foreground">Try adjusting your search or explore our featured locations.</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setCategory('All');
                  setPage(1);
                }} 
                variant="link" 
                className="mt-4 text-primary font-bold text-lg"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DestinationsGrid;
