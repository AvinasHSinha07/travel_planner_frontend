'use client';

import React from 'react';
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
  ArrowRight
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
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

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings', session?.user?.id],
    queryFn: async () => {
      const response = await axiosInstance.get('/booking');
      return response.data.data as Booking[];
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: bookings?.length || 0 },
          { label: 'Confirmed', value: bookings?.filter(b => b.status === 'CONFIRMED').length || 0 },
          { label: 'Pending', value: bookings?.filter(b => b.status === 'PENDING').length || 0 },
          { label: 'Total Spent', value: `$${bookings?.reduce((sum, b) => sum + (b.status === 'CONFIRMED' ? b.totalAmount : 0), 0).toLocaleString() || 0}` },
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
      {bookings && bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking, index) => (
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
      ) : (
        <div className="text-center py-20 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-border">
          <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-black mb-2">No bookings yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Your booking history will appear here once you make reservations
          </p>
          <Button className="h-16 px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest">
            Browse Destinations
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
