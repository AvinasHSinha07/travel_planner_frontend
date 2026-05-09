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
  ArrowDownRight
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
  Cell
} from 'recharts';
import Link from 'next/link';

const AdminDashboardPage = () => {
  const { data: session } = authClient.useSession();

  // Fetch admin stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await axiosInstance.get('/user/dashboard-stats');
      return response.data.data;
    },
    enabled: (session?.user as any)?.role === 'ADMIN',
  });

  // Sample chart data - ideally these would also come from an analytics endpoint
  const monthlyData = [
    { name: 'Jan', users: 45, bookings: 28, revenue: (stats?.totalRevenue || 0) * 0.1 },
    { name: 'Feb', users: 52, bookings: 35, revenue: (stats?.totalRevenue || 0) * 0.15 },
    { name: 'Mar', users: 48, bookings: 42, revenue: (stats?.totalRevenue || 0) * 0.12 },
    { name: 'Apr', users: 65, bookings: 55, revenue: (stats?.totalRevenue || 0) * 0.2 },
    { name: 'May', users: 72, bookings: 48, revenue: (stats?.totalRevenue || 0) * 0.18 },
    { name: 'Jun', users: 85, bookings: 62, revenue: (stats?.totalRevenue || 0) * 0.25 },
  ];

  const bookingTypeData = [
    { name: 'Flights', value: 35, color: '#30638e' },
    { name: 'Hotels', value: 28, color: '#00798c' },
    { name: 'Activities', value: 22, color: '#edae49' },
    { name: 'Packages', value: 15, color: '#d1495b' },
  ];

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
            Platform Overview & Analytics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="px-4 py-2 bg-primary/10 text-primary text-xs font-black uppercase tracking-wider rounded-full">
            Admin Access
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Users', 
            value: stats?.totalUsers || 0, 
            icon: Users,
            trend: '+12%',
            trendUp: true,
            href: '/dashboard/admin/users'
          },
          { 
            label: 'Destinations', 
            value: stats?.totalDestinations || 0, 
            icon: Map,
            trend: '+5%',
            trendUp: true,
            href: '/dashboard/admin/destinations'
          },
          { 
            label: 'Total Bookings', 
            value: stats?.totalBookings || 0, 
            icon: CreditCard,
            trend: '+18%',
            trendUp: true,
            href: '/dashboard/admin/bookings'
          },
          { 
            label: 'Revenue (YTD)', 
            value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, 
            icon: TrendingUp,
            trend: '+8%',
            trendUp: true,
            href: '#'
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
                  <div className={`flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest ${
                    stat.trendUp ? "text-emerald-500" : "text-rose-500"
                  }`}>
                    <span>{stat.trend}</span>
                    {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Activity */}
        <div className="bg-card border border-border/50 p-8 rounded-[2.5rem]">
          <h3 className="text-lg font-black uppercase tracking-widest mb-8">Monthly Activity</h3>
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
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888888', fontSize: 10, fontWeight: 700 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#001b2b', 
                    border: 'none', 
                    borderRadius: '1rem', 
                    color: '#fff' 
                  }}
                  itemStyle={{ 
                    color: '#edae49', 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    fontSize: '10px' 
                  }}
                />
                <Bar dataKey="users" fill="#30638e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bookings" fill="#edae49" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Types */}
        <div className="bg-card border border-border/50 p-8 rounded-[2.5rem]">
          <h3 className="text-lg font-black uppercase tracking-widest mb-8">Booking Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {bookingTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#001b2b', 
                    border: 'none', 
                    borderRadius: '1rem', 
                    color: '#fff' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {bookingTypeData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-bold text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-card border border-border/50 p-8 rounded-[2.5rem]">
        <h3 className="text-lg font-black uppercase tracking-widest mb-8">Revenue Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#edae49" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#edae49" stopOpacity={0}/>
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
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888888', fontSize: 10, fontWeight: 700 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#001b2b', 
                  border: 'none', 
                  borderRadius: '1rem', 
                  color: '#fff' 
                }}
                itemStyle={{ 
                  color: '#edae49', 
                  fontWeight: 900, 
                  textTransform: 'uppercase', 
                  fontSize: '10px' 
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

      {/* Quick Actions */}
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
