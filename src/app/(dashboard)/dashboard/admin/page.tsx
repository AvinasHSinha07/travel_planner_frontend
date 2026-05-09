'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users,
  Map,
  CreditCard,
  TrendingUp,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Link from 'next/link';

const PIE_COLORS = ['#30638e', '#00798c', '#edae49', '#d1495b', '#6b5b95'];

type PlatformAnalytics = {
  scope: 'platform';
  summary: {
    totalUsers: number;
    totalDestinations: number;
    totalBookings: number;
    totalTrips: number;
    totalReviews: number;
    totalActivities: number;
    totalAccommodations: number;
    totalRevenue: number;
  };
  monthlySeries: { month: string; bookings: number; revenue: number; newUsers: number }[];
  bookingsByType: { type: string; count: number }[];
};

const AdminDashboardPage = () => {
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role;
  const staff = role === 'ADMIN' || role === 'TRAVEL_AGENT';

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics-dashboard'],
    queryFn: async () => {
      const response = await axiosInstance.get('/analytics/dashboard');
      return response.data.data as PlatformAnalytics;
    },
    enabled: staff,
  });

  if (!staff) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        You do not have access to this dashboard.
      </div>
    );
  }

  if (isLoading || !analytics || analytics.scope !== 'platform') {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const stats = analytics.summary;
  const monthlyData = analytics.monthlySeries.map((m) => ({
    name: m.month,
    users: m.newUsers,
    bookings: m.bookings,
    revenue: m.revenue,
  }));

  const bookingTypeData = analytics.bookingsByType.map((b, i) => ({
    name: b.type,
    value: b.count,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const pieData =
    bookingTypeData.length > 0
      ? bookingTypeData
      : [{ name: 'No bookings yet', value: 1, color: '#88888840' }];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
            Platform overview & analytics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="px-4 py-2 bg-primary/10 text-primary text-xs font-black uppercase tracking-wider rounded-full">
            {role === 'ADMIN' ? 'Admin access' : 'Travel agent'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            trend: '+12%',
            trendUp: true,
            href: '/dashboard/admin/users',
          },
          {
            label: 'Destinations',
            value: stats.totalDestinations,
            icon: Map,
            trend: '+5%',
            trendUp: true,
            href: '/dashboard/admin/destinations',
          },
          {
            label: 'Total Bookings',
            value: stats.totalBookings,
            icon: CreditCard,
            trend: '+18%',
            trendUp: true,
            href: '/dashboard/admin/bookings',
          },
          {
            label: 'Revenue (confirmed)',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            trend: '+8%',
            trendUp: true,
            href: '/dashboard/admin/analytics',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={stat.href}>
              <div className="bg-card border border-border/50 p-8 rounded-[2.5rem] hover:shadow-lg transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                    <stat.icon className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest ${
                      stat.trendUp ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    <span>{stat.trend}</span>
                    {stat.trendUp ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-foreground">{stat.value}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border/50 p-8 rounded-[2.5rem]">
          <h3 className="text-lg font-black uppercase tracking-widest mb-8">Monthly activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#888888', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 10, fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#001b2b',
                    border: 'none',
                    borderRadius: '1rem',
                    color: '#fff',
                  }}
                  itemStyle={{
                    color: '#edae49',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '10px',
                  }}
                />
                <Bar dataKey="users" fill="#30638e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bookings" fill="#edae49" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border/50 p-8 rounded-[2.5rem]">
          <h3 className="text-lg font-black uppercase tracking-widest mb-8">Booking distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#001b2b',
                    border: 'none',
                    borderRadius: '1rem',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {bookingTypeData.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {bookingTypeData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border/50 p-8 rounded-[2.5rem]">
        <h3 className="text-lg font-black uppercase tracking-widest mb-8">Revenue trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#edae49" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#edae49" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888888', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 10, fontWeight: 700 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#001b2b',
                  border: 'none',
                  borderRadius: '1rem',
                  color: '#fff',
                }}
                itemStyle={{
                  color: '#edae49',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  fontSize: '10px',
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#edae49"
                strokeWidth={4}
                dot={{ fill: '#edae49', strokeWidth: 0, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/admin/users">
          <Button
            variant="outline"
            className="w-full h-20 rounded-2xl font-black uppercase text-xs tracking-widest"
          >
            <Users className="w-5 h-5 mr-3" />
            Manage Users
          </Button>
        </Link>
        <Link href="/dashboard/admin/destinations">
          <Button
            variant="outline"
            className="w-full h-20 rounded-2xl font-black uppercase text-xs tracking-widest"
          >
            <Map className="w-5 h-5 mr-3" />
            Manage Destinations
          </Button>
        </Link>
        <Link href="/dashboard/admin/bookings">
          <Button
            variant="outline"
            className="w-full h-20 rounded-2xl font-black uppercase text-xs tracking-widest"
          >
            <CreditCard className="w-5 h-5 mr-3" />
            View All Bookings
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
