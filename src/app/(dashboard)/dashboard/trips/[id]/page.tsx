'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/lib/axiosInstance';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Loader2,
  MapPin,
  Share2,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

type ItineraryItem = {
  id: string;
  day: number;
  timeSlot: string;
  title: string;
  description?: string | null;
  location?: string | null;
  type: string;
  estimatedCost?: number | null;
};

type BookingRow = {
  id: string;
  type: string;
  status: string;
  totalAmount: number;
  createdAt: string;
};

type TripDetail = {
  id: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  travelerCount: number;
  galleryImages?: string[];
  destination: {
    id: string;
    name: string;
    country: string;
    images?: string[];
  };
  itineraryItems: ItineraryItem[];
  bookings: BookingRow[];
};

export default function TripDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? '');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [pollQueuedItinerary, setPollQueuedItinerary] = useState(false);

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/trip/${id}`);
      return res.data.data as TripDetail | null;
    },
    enabled: !!session?.user?.id && !!id,
  });

  const byDay = useMemo(() => {
    if (!trip?.itineraryItems?.length) return new Map<number, ItineraryItem[]>();
    const m = new Map<number, ItineraryItem[]>();
    for (const item of trip.itineraryItems) {
      const list = m.get(item.day) ?? [];
      list.push(item);
      m.set(item.day, list);
    }
    return m;
  }, [trip]);

  const sortedDays = useMemo(() => Array.from(byDay.keys()).sort((a, b) => a - b), [byDay]);

  useEffect(() => {
    if (!pollQueuedItinerary || !id) return;
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
    }, 4000);
    const stop = setTimeout(() => setPollQueuedItinerary(false), 120_000);
    return () => {
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, [pollQueuedItinerary, id, queryClient]);

  const aiMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/ai/itinerary/${id}`);
      return res.data.data as { status?: string; jobId?: string };
    },
    onSuccess: (data) => {
      if (data?.status === 'queued') {
        setPollQueuedItinerary(true);
        toast.message('Itinerary generation queued', {
          description: 'We will refresh every few seconds until your plan appears.',
        });
      } else {
        setPollQueuedItinerary(false);
        toast.success('Itinerary updated');
      }
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
    },
    onError: (err: unknown) => {
      const ax = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      const status = ax.response?.status;
      const msg =
        ax.response?.data?.message ||
        (status === 503
          ? 'AI itinerary is temporarily unavailable. Please try again later or add items manually.'
          : 'Could not generate itinerary');
      toast.error(msg);
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const amount = Math.max(trip?.totalBudget ?? 0, 49);
      const res = await axiosInstance.post('/booking', {
        tripId: id,
        type: 'PACKAGE',
        totalAmount: amount,
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
        'Checkout failed';
      toast.error(msg);
    },
  });

  const copyShare = async () => {
    const href = `${window.location.origin}/dashboard/trips/${id}`;
    try {
      await navigator.clipboard.writeText(href);
      toast.success('Trip link copied');
    } catch {
      toast.error('Could not copy link');
    }
  };

  if (!session?.user?.id) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Sign in to view this trip.</p>
        <Link href="/login">
          <Button className="rounded-xl">Log in</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="space-y-4">
        <Button variant="outline" className="rounded-xl" onClick={() => router.push('/dashboard/trips')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <p className="text-muted-foreground">Trip not found or you do not have access.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => router.push('/dashboard/trips')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <Badge className="mb-2 rounded-full text-[10px] font-black uppercase">{trip.status}</Badge>
            <h1 className="text-3xl font-black tracking-tight uppercase">{trip.title}</h1>
            <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium mt-1">
              <MapPin className="w-4 h-4" />
              {trip.destination.name}, {trip.destination.country}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl" onClick={copyShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Link href={`/dashboard/trips/${id}/edit`}>
            <Button variant="outline" className="rounded-xl">
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-border/60 bg-card p-6"
        >
          <Calendar className="w-5 h-5 text-primary mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dates</p>
          <p className="font-bold">
            {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[2rem] border border-border/60 bg-card p-6"
        >
          <Wallet className="w-5 h-5 text-primary mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Budget</p>
          <p className="font-black text-xl">${trip.totalBudget.toLocaleString()}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[2rem] border border-border/60 bg-card p-6"
        >
          <Users className="w-5 h-5 text-primary mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Travelers</p>
          <p className="font-black text-xl">{trip.travelerCount}</p>
        </motion.div>
      </div>

      {trip.galleryImages && trip.galleryImages.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-black uppercase tracking-tight">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {trip.galleryImages.map((src) => (
              <a
                key={src}
                href={src}
                target="_blank"
                rel="noreferrer"
                className="aspect-square rounded-2xl overflow-hidden border border-border/50 bg-muted"
              >
                <img src={src} alt="" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          className="rounded-2xl font-black uppercase text-xs tracking-widest h-12"
          onClick={() => aiMutation.mutate()}
          disabled={aiMutation.isPending}
        >
          {aiMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          Generate AI itinerary
        </Button>
        <Button
          variant="secondary"
          className="rounded-2xl font-black uppercase text-xs tracking-widest h-12"
          onClick={() => checkoutMutation.mutate()}
          disabled={checkoutMutation.isPending}
        >
          {checkoutMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" />
          )}
          Book with Stripe
        </Button>
      </div>

      {aiMutation.isError && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
          <p className="font-black text-destructive mb-1">AI unavailable</p>
          <p className="text-muted-foreground">
            Our itinerary service may be overloaded. Wait a few minutes or edit your plan manually.
          </p>
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight">Itinerary</h2>
        {sortedDays.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border p-10 text-center text-muted-foreground">
            No activities yet. Use AI generate or add items from the API.
          </div>
        ) : (
          <Accordion className="space-y-2">
            {sortedDays.map((day) => (
              <AccordionItem key={day} value={`day-${day}`} className="rounded-2xl border border-border/60 px-4">
                <AccordionTrigger className="font-black uppercase text-sm tracking-widest hover:no-underline">
                  Day {day}
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  {(byDay.get(day) ?? []).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-secondary/10 border border-border/40 p-4 space-y-1"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-black uppercase">
                          {item.timeSlot}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] font-black uppercase">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="font-bold text-foreground">{item.title}</p>
                      {item.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      )}
                      {item.estimatedCost != null && (
                        <p className="text-xs font-bold text-primary">~${item.estimatedCost} / person</p>
                      )}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight">Bookings</h2>
        {!trip.bookings?.length ? (
          <p className="text-muted-foreground text-sm">No bookings linked yet.</p>
        ) : (
          <div className="rounded-[2rem] border border-border/60 divide-y divide-border/50 overflow-hidden">
            {trip.bookings.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-bold">{b.type}</p>
                  <p className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="rounded-full">{b.status}</Badge>
                  <span className="font-black">${b.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
