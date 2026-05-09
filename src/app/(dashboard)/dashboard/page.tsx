'use client';

import React from 'react';
import { 
  Map, 
  TrendingUp, 
  CreditCard, 
  Users,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Calendar,
  Bell
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { authClient } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const data = [
  { name: 'Jan', trips: 4 },
  { name: 'Feb', trips: 7 },
  { name: 'Mar', trips: 5 },
  { name: 'Apr', trips: 12 },
  { name: 'May', trips: 8 },
  { name: 'Jun', trips: 15 },
];

const DashboardOverview = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userRole = (user as any)?.role || 'USER';

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axiosInstance.get('/user/dashboard-stats');
      return response.data.data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const statConfig = userRole === 'ADMIN' ? [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, trend: '+5%', up: true },
    { label: 'Destinations', value: stats?.totalDestinations || 0, icon: Compass, trend: '+2', up: true },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: Calendar, trend: '+12%', up: true },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: CreditCard, trend: '+8%', up: true },
  ] : [
    { label: 'My Itineraries', value: stats?.totalTrips || 0, icon: Map, trend: 'Active', up: true },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: Calendar, trend: 'Confirmed', up: true },
    { label: 'Notifications', value: stats?.totalNotifications || 0, icon: Bell, trend: 'Unread', up: true },
    { label: 'Total Spent', value: `$${(stats?.totalSpent || 0).toLocaleString()}`, icon: CreditCard, trend: 'USD', up: true },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-4xl font-black tracking-tight text-foreground uppercase mb-2">
          Welcome Back, {user?.name?.split(' ')[0] || 'Captain'}
        </h1>
        <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
          {userRole === 'ADMIN' ? 'Global Platform Oversight' : 'Your Global Expedition Dashboard'}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statConfig.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-card border border-border/50 rounded-[2.5rem] hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                 <stat.icon className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <div className={cn("flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest", stat.up ? "text-emerald-500" : "text-rose-500")}>
                <span>{stat.trend}</span>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-foreground">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-8 p-10 bg-card border border-border/50 rounded-[3.5rem]">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black uppercase tracking-widest">
                {userRole === 'ADMIN' ? 'Platform Velocity' : 'Travel Velocity'}
              </h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                {userRole === 'ADMIN' ? 'Global System Activity' : 'Monthly Expedition Frequency'}
              </p>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#30638e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#30638e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#888888', fontSize: 10, fontWeight: 900}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#888888', fontSize: 10, fontWeight: 900}} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#001b2b', border: 'none', borderRadius: '1rem', color: '#fff' }}
                  itemStyle={{ color: '#edae49', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="trips" 
                  stroke="#30638e" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorTrips)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-4 space-y-8">
           <div className="p-8 bg-[#002b42] text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-2xl font-black mb-6 relative z-10">AI CONCIERGE <br />AVAILABLE</h3>
              <p className="text-white/60 text-sm font-medium mb-8 relative z-10">Your next high-end expedition is ready to be architected.</p>
              <button className="w-full h-16 bg-[#edae49] hover:bg-[#edae49]/90 text-[#003d5b] rounded-2xl text-sm font-black shadow-xl shadow-[#edae49]/20 transition-all hover:scale-[1.02]">
                 START PLANNING
              </button>
           </div>

           <div className="p-8 bg-card border border-border/50 rounded-[3rem]">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6">Recent Status</h3>
              <div className="space-y-6">
                {[
                  { name: 'System Status', value: 'Optimal', type: 'Success' },
                  { name: 'Active Sessions', value: '24', type: 'Neutral' },
                  { name: 'API Latency', value: '12ms', type: 'Neutral' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground">{item.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.value}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">{item.type}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
