'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Search,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Booking {
  id: string;
  user: {
    name: string;
    email: string;
  };
  type: 'FLIGHT' | 'HOTEL' | 'ACTIVITY' | 'PACKAGE';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';
  totalAmount: number;
  createdAt: string;
  trip?: {
    title: string;
    destination: {
      name: string;
    };
  };
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

const AdminBookingsPage = () => {
  const { data: session } = authClient.useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings', statusFilter, typeFilter],
    queryFn: async () => {
      const response = await axiosInstance.get('/booking', {
        params: { 
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          type: typeFilter !== 'ALL' ? typeFilter : undefined,
        },
      });
      return response.data.data as Booking[];
    },
    enabled: (session?.user as any)?.role === 'ADMIN' || (session?.user as any)?.role === 'TRAVEL_AGENT',
  });

  const filteredBookings = bookings?.filter(booking => 
    searchTerm === '' || 
    booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.trip?.destination?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredBookings?.reduce((sum, b) => 
    sum + (b.status === 'CONFIRMED' ? b.totalAmount : 0), 0
  ) || 0;

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase mb-2">
            All Bookings
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
            Monitor Platform Reservations
          </p>
        </div>
        <div className="bg-primary/10 px-6 py-3 rounded-2xl">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Revenue</span>
          <p className="text-2xl font-black text-primary">${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by user or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 pl-12 rounded-xl border-border/60"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'ALL')}>
          <SelectTrigger className="w-[180px] h-14 rounded-xl">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || 'ALL')}>
          <SelectTrigger className="w-[180px] h-14 rounded-xl">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="FLIGHT">Flights</SelectItem>
            <SelectItem value="HOTEL">Hotels</SelectItem>
            <SelectItem value="ACTIVITY">Activities</SelectItem>
            <SelectItem value="PACKAGE">Packages</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings Table */}
      <div className="bg-card border border-border/50 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/5 border-b border-border/50">
              <tr>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  User
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Trip/Destination
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Type
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Amount
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredBookings?.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-secondary/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">{booking.user.name}</p>
                        <p className="text-xs text-muted-foreground">{booking.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {booking.trip ? (
                      <div>
                        <p className="font-bold text-sm text-foreground">{booking.trip.title}</p>
                        <p className="text-xs text-muted-foreground">{booking.trip.destination.name}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold uppercase text-muted-foreground">
                      {booking.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Badge 
                      variant="outline" 
                      className={`${statusConfig[booking.status].color} rounded-full text-[10px] font-black uppercase tracking-wider border`}
                    >
                      <span className="flex items-center space-x-1">
                        {statusConfig[booking.status].icon}
                        <span>{booking.status}</span>
                      </span>
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-black text-foreground">
                      ${booking.totalAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings?.length === 0 && (
          <div className="text-center py-20">
            <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-black mb-2">No bookings found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
