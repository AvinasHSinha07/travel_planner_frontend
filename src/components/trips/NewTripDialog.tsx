'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type DestinationOption = {
  id: string;
  name: string;
  country: string;
};

type NewTripDialogProps = {
  children?: React.ReactNode;
};

export function NewTripDialog({ children }: NewTripDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [destinationId, setDestinationId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalBudget, setTotalBudget] = useState('2000');
  const [travelerCount, setTravelerCount] = useState('2');

  const { data: destinations = [], isLoading: destLoading } = useQuery({
    queryKey: ['trip-wizard-destinations'],
    queryFn: async () => {
      const res = await axiosInstance.get('/destination');
      return res.data.data as DestinationOption[];
    },
    enabled: open,
  });

  const selectedDest = useMemo(
    () => destinations.find((d) => d.id === destinationId),
    [destinations, destinationId],
  );

  const createTrip = useMutation({
    mutationFn: async () => {
      const payload = {
        destinationId,
        title: title.trim() || `${selectedDest?.name ?? 'Trip'} getaway`,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalBudget: Number(totalBudget) || 0,
        travelerCount: Math.max(1, Number(travelerCount) || 1),
      };
      const res = await axiosInstance.post('/trip', payload);
      return res.data.data as { id: string };
    },
    onSuccess: (data) => {
      toast.success('Trip created');
      queryClient.invalidateQueries({ queryKey: ['my-trips'] });
      setOpen(false);
      setStep(0);
      router.push(`/dashboard/trips/${data.id}`);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Could not create trip';
      toast.error(msg);
    },
  });

  const resetOnOpen = (next: boolean) => {
    setOpen(next);
    if (next) {
      setStep(0);
      setDestinationId('');
      setTitle('');
      setStartDate('');
      setEndDate('');
      setTotalBudget('2000');
      setTravelerCount('2');
    }
  };

  const canNextStep0 = !!destinationId;
  const canSubmit =
    !!destinationId &&
    !!startDate &&
    !!endDate &&
    new Date(endDate) >= new Date(startDate);

  return (
    <Dialog open={open} onOpenChange={resetOnOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="h-14 px-6 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest">
            <Plus className="w-5 h-5 mr-2" />
            New Trip
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-black text-xl uppercase tracking-tight">
            Plan a new trip
          </DialogTitle>
          <DialogDescription>
            {step === 0 ? 'Choose a destination.' : 'Dates, budget, and travelers.'}
          </DialogDescription>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-4 py-2">
            <Label className="text-xs font-black uppercase tracking-widest">Destination</Label>
            {destLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <Select value={destinationId} onValueChange={(v) => setDestinationId(v || '')}>
                <SelectTrigger className="h-14 rounded-xl">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-72">
                  {destinations.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}, {d.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              className="w-full h-12 rounded-xl font-black uppercase text-xs"
              disabled={!canNextStep0}
              onClick={() => setStep(1)}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest">Trip title (optional)</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={selectedDest ? `${selectedDest.name} getaway` : 'My adventure'}
                className="h-12 rounded-xl"
              />
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
                <Label className="text-xs font-black uppercase tracking-widest">Budget (USD)</Label>
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
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl font-black uppercase text-xs"
                disabled={!canSubmit || createTrip.isPending}
                onClick={() => createTrip.mutate()}
              >
                {createTrip.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Create trip'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
