'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/lib/axiosInstance';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import {
  MapPin,
  Calendar,
  DollarSign,
  Star,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { SaveDestinationHeart } from '@/components/destinations/SaveDestinationHeart';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUploadButton } from '@/components/admin/ImageUploadButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ReviewRow = {
  id: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  user: { name: string; avatar?: string | null };
};

const DestinationDetailsPage = () => {
  const { id } = useParams();
  const destId = String(id ?? '');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImageUrls, setReviewImageUrls] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const { data: destination, isLoading } = useQuery({
    queryKey: ['destination', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/destination/${id}`);
      return response.data.data;
    },
  });

  const { data: reviewPayload, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', destId, reviewPage],
    queryFn: async () => {
      const res = await axiosInstance.get(`/review/${destId}`, {
        params: { page: reviewPage, limit: 8 },
      });
      return res.data.data as {
        items: ReviewRow[];
        meta: { total: number; page: number; limit: number; totalPages: number };
      };
    },
    enabled: !!destId,
  });

  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!destination) throw new Error('Missing destination');
      const res = await axiosInstance.post('/booking', {
        destinationId: destId,
        type: 'PACKAGE',
        totalAmount: Math.max((destination.avgCostPerDay || 0) * 7, 99),
      });
      return res.data.data as { checkoutUrl?: string; url?: string };
    },
    onSuccess: (data) => {
      const target = data.checkoutUrl || data.url;
      if (target) window.location.href = target;
      else toast.error('No checkout URL returned');
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Checkout could not start';
      toast.error(msg);
    },
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      await axiosInstance.post('/review', {
        destinationId: destId,
        rating: reviewRating,
        comment: reviewComment.trim(),
        images: reviewImageUrls.length ? reviewImageUrls : undefined,
      });
    },
    onSuccess: () => {
      toast.success('Review saved');
      setReviewComment('');
      setReviewImageUrls([]);
      refetchReviews();
      queryClient.invalidateQueries({ queryKey: ['reviews', destId] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Could not submit review';
      toast.error(msg);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-6">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
          <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-xs">Curating Experience...</p>
        </div>
      </div>
    );
  }

  const fallbackImages = [
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'
  ];

  const images = [...(destination.images || []), ...fallbackImages].slice(0, 5);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Premium Hero Gallery */}
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px] md:h-[700px]">
            {/* Main Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedImage(0)}
              className="md:col-span-2 relative rounded-[3rem] overflow-hidden cursor-pointer group shadow-2xl"
            >
              <img
                src={images[0]}
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                alt={destination.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="absolute bottom-10 left-10">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em]">Main Feature</span>
              </div>
              <div className="absolute top-8 right-8 z-10">
                <SaveDestinationHeart destinationId={destination.id} />
              </div>
            </motion.div>

            {/* Side Grid */}
            <div className="hidden md:grid md:col-span-2 grid-cols-2 grid-rows-2 gap-4">
              {images.slice(1, 5).map((img: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => setSelectedImage(i + 1)}
                  className="relative rounded-[2.5rem] overflow-hidden cursor-pointer group shadow-xl"
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={`Gallery ${i + 1}`}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  {i === 2 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-black text-xl">+{images.length - 3} Photos</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Info Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Main Content (Left) */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-[2px] bg-primary" />
                  <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">{destination.country}</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-10 leading-[0.9]">
                  {destination.name.toUpperCase()}
                </h1>

                <div className="flex flex-wrap gap-6 mb-16">
                   <div className="flex items-center space-x-3 px-6 py-3 bg-secondary/5 rounded-2xl border border-border/50">
                     <Calendar className="w-5 h-5 text-secondary" />
                     <span className="font-bold text-sm">Best in {destination.bestSeason}</span>
                   </div>
                   <div className="flex items-center space-x-3 px-6 py-3 bg-secondary/5 rounded-2xl border border-border/50">
                     <Star className="w-5 h-5 text-accent fill-accent" />
                     <span className="font-bold text-sm">4.9 Explorer Rating</span>
                   </div>
                   <div className="flex items-center space-x-3 px-6 py-3 bg-secondary/5 rounded-2xl border border-border/50">
                     <Sparkles className="w-5 h-5 text-primary" />
                     <span className="font-bold text-sm">Luxury {destination.category}</span>
                   </div>
                </div>

                <div className="space-y-12 mb-20">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-6 flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      The Experience
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                      {destination.description}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-8 flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      Exclusive Advantages
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        'Bespoke AI-Crafted Daily Itinerary',
                        'Elite Concierge Priority Access',
                        'Private Transport & Transfers',
                        'Luxury Suite Reservations',
                        'Curated Cultural Masterclasses',
                        '24/7 Premium Support'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center space-x-4 group">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                            <CheckCircle2 className="w-5 h-5 text-primary group-hover:text-white" />
                          </div>
                          <span className="text-lg font-bold text-foreground/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar (Right) */}
            <div className="lg:col-span-4">
              <div className="sticky top-32">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#002b42] text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                  
                  <h3 className="text-3xl font-black mb-8 relative z-10">RESERVE <br />EXPERIENCE</h3>
                  
                  <div className="space-y-8 mb-12 relative z-10">
                    <div className="flex justify-between items-center pb-6 border-b border-white/10">
                      <span className="text-white/60 font-bold uppercase tracking-widest text-xs">Starting Cost</span>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-black">${destination.avgCostPerDay}</span>
                        <span className="text-[10px] text-white/40">/ person</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 font-bold uppercase tracking-widest text-xs">AI Concierge</span>
                      <span className="text-accent font-black tracking-widest text-xs uppercase">Premium Included</span>
                    </div>
                  </div>

                  <div className="space-y-3 relative z-10">
                    <Button
                      type="button"
                      className="w-full h-16 rounded-2xl bg-[#edae49] hover:bg-[#edae49]/90 text-[#003d5b] text-lg font-black shadow-xl shadow-[#edae49]/20"
                      onClick={() => bookMutation.mutate()}
                      disabled={bookMutation.isPending || !session?.user}
                    >
                      {bookMutation.isPending ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="mr-2 w-5 h-5" />
                          Book package (Stripe)
                        </>
                      )}
                    </Button>
                    <Link href="/dashboard/trips" className="block">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-14 rounded-2xl border-white/30 text-white bg-white/5 hover:bg-white/10"
                      >
                        Plan full trip
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    {!session?.user && (
                      <p className="text-center text-[10px] text-white/50 font-bold">
                        Log in to complete checkout
                      </p>
                    )}
                  </div>

                  <p className="text-center text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mt-8">
                    Strictly Limited Availability
                  </p>
                </motion.div>

                {/* Secondary Info */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-6 bg-card border border-border/50 rounded-3xl text-center">
                     <DollarSign className="w-6 h-6 text-primary mx-auto mb-3" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Currency</p>
                     <p className="font-black">{destination.currency || 'USD'}</p>
                  </div>
                  <div className="p-6 bg-card border border-border/50 rounded-3xl text-center">
                     <MapPin className="w-6 h-6 text-primary mx-auto mb-3" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</p>
                     <p className="font-black">Remote</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/10 border-t border-border/40">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Traveler reviews</h2>
          <p className="text-muted-foreground text-sm font-medium mb-10">
            {reviewPayload?.meta.total ?? 0} reviews · Page {reviewPayload?.meta.page ?? 1} of{' '}
            {reviewPayload?.meta.totalPages ?? 1}
          </p>

          {session?.user ? (
            <div className="rounded-[2rem] border border-border/60 bg-card p-8 mb-12 space-y-4">
              <h3 className="font-black uppercase text-sm tracking-widest">Write a review</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Rating</Label>
                  <Select
                    value={String(reviewRating)}
                    onValueChange={(v) => setReviewRating(Number(v) || 5)}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {[5, 4, 3, 2, 1].map((r) => (
                        <SelectItem key={r} value={String(r)}>
                          {r} stars
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Comment</Label>
                  <Textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="min-h-[100px] rounded-xl"
                    placeholder="Share what stood out about this destination..."
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">
                    Review photos (optional)
                  </Label>
                  <ImageUploadButton
                    folder="reviews"
                    label="Upload photo"
                    className="rounded-xl"
                    onUploaded={(url) => setReviewImageUrls((prev) => [...prev, url])}
                  />
                  {reviewImageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {reviewImageUrls.map((url) => (
                        <div
                          key={url}
                          className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border/60"
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            onClick={() =>
                              setReviewImageUrls((prev) => prev.filter((u) => u !== url))
                            }
                            aria-label="Remove photo"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Button
                className="rounded-xl font-black uppercase text-xs h-12"
                disabled={!reviewComment.trim() || submitReview.isPending}
                onClick={() => submitReview.mutate()}
              >
                {submitReview.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit review'}
              </Button>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border p-8 mb-12 text-center text-muted-foreground">
              <Link href="/login">
                <Button className="rounded-xl font-black uppercase text-xs">Log in to review</Button>
              </Link>
            </div>
          )}

          <div className="space-y-6">
            {(reviewPayload?.items ?? []).map((r) => (
              <div
                key={r.id}
                className="rounded-[2rem] border border-border/50 bg-background p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <p className="font-black">{r.user.name}</p>
                  <div className="flex items-center gap-1 text-accent">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{r.comment}</p>
                {r.images?.length ? (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {r.images.map((src) => (
                      <a
                        key={src}
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-20 h-20 rounded-xl overflow-hidden border border-border/50"
                      >
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                ) : null}
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            {!reviewPayload?.items?.length && (
              <p className="text-muted-foreground text-center py-8">No reviews yet — be the first.</p>
            )}
          </div>

          {reviewPayload && reviewPayload.meta.totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-10">
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={reviewPage <= 1}
                onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={reviewPage >= reviewPayload.meta.totalPages}
                onClick={() => setReviewPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal / Gallery Overlay */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-10 right-10 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative max-w-6xl w-full h-full flex items-center justify-center"
            >
               <img
                src={images[selectedImage]}
                className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl"
                alt="Enlarged Gallery"
              />
              
              {/* Navigation */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
                  }}
                  className="w-20 h-20 rounded-full bg-white/5 pointer-events-auto flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
                  }}
                  className="w-20 h-20 rounded-full bg-white/5 pointer-events-auto flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
};

export default DestinationDetailsPage;
