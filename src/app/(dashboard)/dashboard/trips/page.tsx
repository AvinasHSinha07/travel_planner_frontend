'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Map, 
  Plus, 
  Calendar, 
  ArrowRight, 
  Loader2,
  MoreHorizontal,
  Trash2,
  Edit3,
  ExternalLink,
  Search
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authClient } from '@/lib/auth-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { NewTripDialog } from '@/components/trips/NewTripDialog';
import { toast } from 'sonner';

interface Trip {
  id: string;
  title: string;
  destination: {
    name: string;
    country: string;
    images: string[];
  };
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'PLANNED' | 'BOOKED' | 'COMPLETED' | 'CANCELLED';
  totalBudget: number;
  travelerCount: number;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-500',
  PLANNED: 'bg-blue-500',
  BOOKED: 'bg-green-500',
  COMPLETED: 'bg-purple-500',
  CANCELLED: 'bg-red-500',
};

const MyTripsPage = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role;
  const [deleteTripId, setDeleteTripId] = useState<string | null>(null);

  // Filter & Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [status, setStatus] = useState<string>('ALL');
  const [page, setPage] = useState(1);

  const canDeleteTrip =
    role === 'USER' || role === 'ADMIN' || role === 'TRAVEL_AGENT';

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['my-trips', session?.user?.id, debouncedSearch, status, page],
    queryFn: async () => {
      const res = await axiosInstance.get('/trip', {
        params: {
          searchTerm: debouncedSearch,
          status: status === 'ALL' ? undefined : status,
          page,
          limit: 6
        }
      });
      return res.data;
    },
    enabled: !!session?.user?.id,
  });

  const trips = response?.data as Trip[] || [];
  const meta = response?.meta;

  const handleDelete = async (tripId: string) => {
    try {
      await axiosInstance.delete(`/trip/${tripId}`);
      setDeleteTripId(null);
      refetch();
      toast.success('Trip deleted');
    } catch (error) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to delete trip';
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase mb-1 md:mb-2">
            My Itineraries
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px] md:text-xs">
            Manage Your Travel Plans
          </p>
        </div>
        <NewTripDialog />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search trips..." 
            className="pl-10 h-12 rounded-xl"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={status} onValueChange={(val) => {
            setStatus(val);
            setPage(1);
          }}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PLANNED">Planned</SelectItem>
              <SelectItem value="BOOKED">Booked</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : trips.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card border border-border/50 rounded-[2.5rem] overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trip.destination?.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'}
                    alt={trip.destination?.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`${statusColors[trip.status]} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full`}>
                      {trip.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/trips/${trip.id}`)}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/trips/${trip.id}/edit`)}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Trip
                        </DropdownMenuItem>
                        {canDeleteTrip && (
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => setDeleteTripId(trip.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Destination Name */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-black">{trip.destination?.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                      {trip.destination?.country}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-muted-foreground text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Budget
                      </p>
                      <p className="text-lg font-black text-foreground">
                        ${trip.totalBudget.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Travelers
                      </p>
                      <p className="text-lg font-black text-foreground">
                        {trip.travelerCount}
                      </p>
                    </div>
                  </div>

                  <Link href={`/dashboard/trips/${trip.id}`}>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-xl font-black uppercase text-xs tracking-widest"
                    >
                      View Itinerary
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPage > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl px-4"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={page === p ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPage(p)}
                    className="w-10 h-10 rounded-xl font-black"
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
                disabled={page === meta.totalPage}
                className="rounded-xl px-4"
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-border">
          <Map className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-black mb-2">No itineraries found</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {searchTerm || status !== 'ALL' 
              ? "Try adjusting your filters to find what you're looking for." 
              : "Start planning your next adventure by creating a new trip."}
          </p>
          {!searchTerm && status === 'ALL' && (
            <NewTripDialog>
              <Button className="h-16 px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest">
                <Plus className="w-5 h-5 mr-2" />
                Plan Your First Trip
              </Button>
            </NewTripDialog>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTripId} onOpenChange={() => setDeleteTripId(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-black text-xl">Delete Trip</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete this trip? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-4 mt-4">
            <Button 
              variant="outline" 
              className="flex-1 h-14 rounded-xl font-black uppercase text-xs tracking-widest"
              onClick={() => setDeleteTripId(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1 h-14 rounded-xl font-black uppercase text-xs tracking-widest"
              onClick={() => deleteTripId && handleDelete(deleteTripId)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyTripsPage;
