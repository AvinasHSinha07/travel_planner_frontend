'use client';

import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/lib/axiosInstance';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploadButton } from '@/components/admin/ImageUploadButton';

const STATUSES = ['DRAFT', 'PLANNED', 'BOOKED', 'COMPLETED', 'CANCELLED'] as const;

type TripDetail = {
  id: string;
  userId: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  travelerCount: number;
  galleryImages?: string[];
};

export default function EditTripPage() {
  const params = useParams();
  const id = String(params?.id ?? '');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const sessionRole = (session?.user as { role?: string })?.role ?? 'USER';

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [travelerCount, setTravelerCount] = useState('');
  const [status, setStatus] = useState<string>('DRAFT');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/trip/${id}`);
      return res.data.data as TripDetail | null;
    },
    enabled: !!session?.user?.id && !!id,
  });

  useEffect(() => {
    if (!trip) return;
    setTitle(trip.title);
    setStartDate(trip.startDate.slice(0, 10));
    setEndDate(trip.endDate.slice(0, 10));
    setTotalBudget(String(trip.totalBudget));
    setTravelerCount(String(trip.travelerCount));
    setStatus(trip.status);
    setGalleryImages(Array.isArray(trip.galleryImages) ? trip.galleryImages : []);
  }, [trip]);

  const save = useMutation({
    mutationFn: async () => {
      await axiosInstance.patch(`/trip/${id}`, {
        title: title.trim(),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalBudget: Number(totalBudget) || 0,
        travelerCount: Math.max(1, Number(travelerCount) || 1),
        status,
        galleryImages,
      });
    },
    onSuccess: () => {
      toast.success('Trip updated');
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
      queryClient.invalidateQueries({ queryKey: ['my-trips'] });
      router.push(`/dashboard/trips/${id}`);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Could not update trip';
      toast.error(msg);
    },
  });

  if (!session?.user?.id) {
    return (
      <div className="text-center py-20">
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
        <p className="text-muted-foreground">Trip not found.</p>
        <Link href="/dashboard/trips">
          <Button variant="outline" className="rounded-xl">
            Back to trips
          </Button>
        </Link>
      </div>
    );
  }

  const canEdit =
    trip.userId === session?.user?.id || sessionRole === 'ADMIN';

  if (!canEdit) {
    return (
      <div className="max-w-lg space-y-6">
        <Link href={`/dashboard/trips/${id}`}>
          <Button variant="ghost" className="rounded-xl gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to trip
          </Button>
        </Link>
        <p className="text-muted-foreground">
          Only the traveler who owns this trip or an administrator can edit it. Travel agents can view trips in read-only mode.
        </p>
      </div>
    );
  }

  const canSave =
    title.trim() &&
    startDate &&
    endDate &&
    new Date(endDate) >= new Date(startDate);

  return (
    <div className="max-w-lg space-y-8">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/trips/${id}`}>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-black uppercase tracking-tight">Edit trip</h1>
      </div>

      <div className="space-y-4 rounded-[2rem] border border-border/60 bg-card p-8">
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest">Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest">Start</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest">End</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest">Budget</Label>
            <Input
              type="number"
              min={0}
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest">Travelers</Label>
            <Input
              type="number"
              min={1}
              value={travelerCount}
              onChange={(e) => setTravelerCount(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
        </div>
        <div className="space-y-3">
          <Label className="text-xs font-black uppercase tracking-widest">Trip gallery</Label>
          <p className="text-xs text-muted-foreground">
            Upload photos for this trip. They are stored as URLs after upload.
          </p>
          <ImageUploadButton
            folder="trips"
            label="Add gallery image"
            className="rounded-xl"
            onUploaded={(url) => setGalleryImages((prev) => [...prev, url])}
          />
          {galleryImages.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {galleryImages.map((url) => (
                <div key={url} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-border/60">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    onClick={() => setGalleryImages((prev) => prev.filter((u) => u !== url))}
                    aria-label="Remove image"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v || 'DRAFT')}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          className="w-full h-12 rounded-xl font-black uppercase text-xs"
          disabled={!canSave || save.isPending}
          onClick={() => save.mutate()}
        >
          {save.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}
