'use client';

import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { authClient } from '@/lib/auth-client';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const PIE_COLORS = ['#30638e', '#00798c', '#edae49', '#d1495b', '#6b5b95'];

type AiInsight = {
  insights: string[];
  trends: string[];
  budgetTips: string[];
  summary: string;
};

type DatasetKey = 'user-trips' | 'spending-patterns' | 'destination-trends' | 'booking-analytics';

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

type AgentAnalytics = {
  scope: 'agent';
  summary: {
    totalDestinations: number;
    totalActivities: number;
    totalAccommodations: number;
    totalBookings: number;
    totalRevenue: number;
  };
  monthlySeries: { month: string; bookings: number; revenue: number; newUsers: number }[];
  bookingsByType: { type: string; count: number }[];
};

export default function AdminAnalyticsPage() {
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role;
  const canAccess = role === 'ADMIN' || role === 'TRAVEL_AGENT';
  const [dataset, setDataset] = useState<DatasetKey>('user-trips');

  const insightsMutation = useMutation({
    mutationFn: async (ds: DatasetKey) => {
      const res = await axiosInstance.post('/ai/analyze', { dataset: ds });
      return res.data.data as AiInsight;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => {
      const res = await axiosInstance.get('/analytics/dashboard');
      return res.data.data as PlatformAnalytics | AgentAnalytics;
    },
    enabled: canAccess,
  });

  if (!canAccess) {
    return <p className="text-center py-20 text-muted-foreground">Access denied.</p>;
  }

  if (isLoading || !data || (data.scope !== 'platform' && data.scope !== 'agent')) {
    return (
      <div className="flex justify-center h-96 items-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const isPlatform = data.scope === 'platform';
  const analytics = data;
  
  const barData = analytics.monthlySeries.map((m) => ({
    name: m.month,
    users: m.newUsers,
    bookings: m.bookings,
  }));
  const lineData = analytics.monthlySeries.map((m) => ({
    name: m.month,
    revenue: m.revenue,
  }));
  const pieData = analytics.bookingsByType.map((b, i) => ({
    name: b.type,
    value: b.count,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const stats = isPlatform 
    ? [
        ['Users', (analytics as PlatformAnalytics).summary.totalUsers],
        ['Destinations', (analytics as PlatformAnalytics).summary.totalDestinations],
        ['Bookings', (analytics as PlatformAnalytics).summary.totalBookings],
        ['Revenue', `$${(analytics as PlatformAnalytics).summary.totalRevenue.toLocaleString()}`],
        ['Trips', (analytics as PlatformAnalytics).summary.totalTrips],
        ['Reviews', (analytics as PlatformAnalytics).summary.totalReviews],
        ['Activities', (analytics as PlatformAnalytics).summary.totalActivities],
        ['Stays', (analytics as PlatformAnalytics).summary.totalAccommodations],
      ]
    : [
        ['My Destinations', (analytics as AgentAnalytics).summary.totalDestinations],
        ['My Activities', (analytics as AgentAnalytics).summary.totalActivities],
        ['My Stays', (analytics as AgentAnalytics).summary.totalAccommodations],
        ['My Bookings', (analytics as AgentAnalytics).summary.totalBookings],
        ['Total Revenue', `$${(analytics as AgentAnalytics).summary.totalRevenue.toLocaleString()}`],
      ];

  return (
    <div className="space-y-6 md:space-y-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
          {isPlatform ? 'Platform Analytics' : 'Agency Analytics'}
        </h1>
        <p className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
          {isPlatform ? 'Live aggregates from the database' : 'Business insights for your agency'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map(([label, val]) => (
          <div key={String(label)} className="rounded-xl md:rounded-2xl border border-border/50 bg-card p-4 md:p-5">
            <p className="text-[9px] md:text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</p>
            <p className="text-lg md:text-2xl font-black mt-1">{val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-card border border-border/50 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem]">
          <h3 className="text-base md:text-lg font-black uppercase tracking-widest mb-6 md:mb-8">Monthly signups & bookings</h3>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#001b2b',
                    border: 'none',
                    borderRadius: '1rem',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="users" fill="#30638e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bookings" fill="#edae49" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border/50 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem]">
          <h3 className="text-base md:text-lg font-black uppercase tracking-widest mb-6 md:mb-8">Bookings by type</h3>
          <div className="h-64 md:h-80">
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
        </div>
      </div>

      <div className="bg-card border border-border/50 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem]">
        <h3 className="text-base md:text-lg font-black uppercase tracking-widest mb-6 md:mb-8">Confirmed revenue by month</h3>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#001b2b',
                  border: 'none',
                  borderRadius: '1rem',
                  color: '#fff',
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#edae49" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <section className="rounded-[2rem] md:rounded-[2.5rem] border border-border/50 bg-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
          <div>
            <h2 className="text-lg md:text-xl font-black uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI insights
            </h2>
            <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
              Gemini analysis over live Prisma aggregates (cached 1h on the server)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Select value={dataset} onValueChange={(v) => setDataset(v as DatasetKey)}>
              <SelectTrigger className="w-full sm:w-[260px] rounded-xl h-11 md:h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="user-trips">Trip trends (6 mo)</SelectItem>
                <SelectItem value="spending-patterns">Spending by booking type</SelectItem>
                <SelectItem value="destination-trends">Destination popularity</SelectItem>
                <SelectItem value="booking-analytics">Booking funnel & revenue</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="rounded-xl font-black uppercase text-xs h-11 md:h-12 px-8"
              disabled={insightsMutation.isPending}
              onClick={() => insightsMutation.mutate(dataset)}
            >
              {insightsMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {insightsMutation.isPending ? 'Analyzing...' : 'Generate insights'}
            </Button>
          </div>
        </div>

        {insightsMutation.data && (
          <div className="space-y-6 text-sm">
            <p className="font-bold text-foreground leading-relaxed">{insightsMutation.data.summary}</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                  Insights
                </h4>
                <ul className="space-y-2 list-disc pl-4 text-muted-foreground">
                  {insightsMutation.data.insights.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                  Trends
                </h4>
                <ul className="space-y-2 list-disc pl-4 text-muted-foreground">
                  {insightsMutation.data.trends.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                  Budget tips
                </h4>
                <ul className="space-y-2 list-disc pl-4 text-muted-foreground">
                  {insightsMutation.data.budgetTips.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {insightsMutation.isError && (
          <p className="text-sm text-destructive">Could not load AI insights. Check staff role and API limits.</p>
        )}
      </section>
    </div>
  );
}
