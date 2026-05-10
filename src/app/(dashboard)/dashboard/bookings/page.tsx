'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CreditCard, 
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  ArrowRight,
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
import { Badge } from '@/components/ui/badge';

interface Booking {
  id: string;
  type: 'FLIGHT' | 'HOTEL' | 'ACTIVITY' | 'PACKAGE';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';
  totalAmount: number;
  createdAt: string;
  trip?: {
    title: string;
    destination: {
      name: string;
      country: string;
    };
  };
  stripeSessionId?: string;
}

type StaffBookingResponse = {
  items: Booking[];
  meta?: { page: number; limit: number; total: number; totalPage: number };
};

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  PENDING: { 
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', 
    icon: <Clock className="w-3 h-3" /> 
  },
  CONFIRMED: { 
    color: 'bg-green-500/10 text-green-600 border-green-500/20', 
    icon: <CheckCircle2 className="w-3 h-3" /> 
  },
  CANCELLED: { 
    color: 'bg-red-500/10 text-red-600 border-red-500/20', 
    icon: <XCircle className="w-3 h-3" /> 
  },
  REFUNDED: { 
    color: 'bg-gray-500/10 text-gray-600 border-gray-500/20', 
    icon: <RefreshCw className="w-3 h-3" /> 
  },
};

const typeLabels: Record<string, string> = {
  FLIGHT: 'Flight Booking',
  HOTEL: 'Hotel Reservation',
  ACTIVITY: 'Activity Booking',
  PACKAGE: 'Travel Package',
};

const MyBookingsPage = () => {
  const { data: session } = authClient.useSession();

  // Filter & Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [status, setStatus] = useState<string>('ALL');
  const [type, setType] = useState<string>('ALL');
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ['my-bookings', session?.user?.id, debouncedSearch, status, type, page],
    queryFn: async () => {
      const res = await axiosInstance.get('/booking', {
        params: {
          searchTerm: debouncedSearch,
          status: status === 'ALL' ? undefined : status,
          type: type === 'ALL' ? undefined : type,
          page,
          limit: 10
        }
      });
      return res.data;
    },
    enabled: !!session?.user?.id,
  });

  const bookingItems = response?.data as Booking[] || [];
  const meta = response?.meta;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground uppercase mb-2">
          My Bookings
        </h1>
        <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
          Track Your Reservations & Payments
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search bookings..." 
            className="pl-10 h-12 rounded-xl"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div>
          <Select value={status} onValueChange={(val) => {
            setStatus(val);
            setPage(1);
          }}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={type} onValueChange={(val) => {
            setType(val);
            setPage(1);
          }}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="FLIGHT">Flight</SelectItem>
              <SelectItem value="HOTEL">Hotel</SelectItem>
              <SelectItem value="ACTIVITY">Activity</SelectItem>
              <SelectItem value="PACKAGE">Package</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: bookingItems.length },
          { label: 'Confirmed', value: bookingItems.filter((b) => b.status === 'CONFIRMED').length },
          { label: 'Pending', value: bookingItems.filter((b) => b.status === 'PENDING').length },
          {
            label: 'Total Spent',
            value: `$${bookingItems
              .reduce((sum, b) => sum + (b.status === 'CONFIRMED' ? b.totalAmount : 0), 0)
              .toLocaleString()}`,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border/50 p-6 rounded-[2rem]"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">
              {stat.label}
            </p>
            <p className="text-3xl font-black text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : bookingItems.length > 0 ? (
        <>
          <div className="space-y-4">
            {bookingItems.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border/50 rounded-[2.5rem] p-6 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left: Booking Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-black text-foreground">
                        {typeLabels[booking.type]}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`${statusConfig[booking.status].color} rounded-full text-[10px] font-black uppercase tracking-wider border`}
                      >
                        <span className="flex items-center space-x-1">
                          {statusConfig[booking.status].icon}
                          <span>{booking.status}</span>
                        </span>
                      </Badge>
                    </div>
                    {booking.trip && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {booking.trip.title} • {booking.trip.destination.name}, {booking.trip.destination.country}
                      </p>
                    )}
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Amount
                    </p>
                    <p className="text-2xl font-black text-foreground">
                      ${booking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="w-12 h-12 rounded-xl"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </>
      ) : (
        <div className="text-center py-20 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-border">
          <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-black mb-2">No bookings found</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {searchTerm || status !== 'ALL' || type !== 'ALL' 
              ? "Try adjusting your filters to find what you're looking for." 
              : "Your booking history will appear here once you make reservations."}
          </p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setStatus('ALL');
              setType('ALL');
              setPage(1);
            }}
            variant="outline" 
            className="h-16 px-8 rounded-2xl font-black uppercase text-xs tracking-widest"
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && meta && meta.totalPage > 1 && (
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
    </div>
  );
};

export default MyBookingsPage;
