'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Search, Star, Trash2 } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type AdminReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string; email: string };
  destination: { name: string; country: string };
};

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const role = (session?.user as { role?: string } | undefined)?.role;
  const staff = role === 'ADMIN' || role === 'TRAVEL_AGENT';

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', page, searchTerm],
    queryFn: async () => {
      const res = await axiosInstance.get('/review/admin/all', {
        params: { page, limit: 20, search: searchTerm || undefined },
      });
      return res.data as {
        data: AdminReview[];
        meta: { total: number; page: number; limit: number; totalPage: number };
      };
    },
    enabled: staff,
  });

  const remove = useMutation({
    mutationFn: async (reviewId: string) => {
      await axiosInstance.delete(`/review/${reviewId}`);
    },
    onSuccess: () => {
      toast.success('Review removed');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
    onError: () => toast.error('Could not delete review'),
  });

  if (!staff) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Staff access required.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center h-96 items-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const items = data?.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground uppercase mb-2">
          Review moderation
        </h1>
        <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
          Search, audit, and remove public reviews
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="h-14 pl-12 rounded-xl"
          />
        </div>
        <Button
          variant="outline"
          className="h-14 rounded-xl"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })}
        >
          Refresh
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/5 border-b border-border/50">
              <tr>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  User
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Destination
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Rating
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Comment
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {items.map((rev, index) => (
                <motion.tr
                  key={rev.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-secondary/5"
                >
                  <td className="py-4 px-6 align-top">
                    <p className="font-bold text-sm">{rev.user.name}</p>
                    <p className="text-xs text-muted-foreground">{rev.user.email}</p>
                  </td>
                  <td className="py-4 px-6 align-top text-sm font-medium">
                    {rev.destination.name}
                    <span className="text-muted-foreground block text-xs">{rev.destination.country}</span>
                  </td>
                  <td className="py-4 px-6 align-top">
                    <Badge variant="outline" className="rounded-full gap-1">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      {rev.rating}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 align-top max-w-md">
                    <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                      {rev.comment}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {new Date(rev.createdAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 px-6 align-top">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-xl"
                      disabled={remove.isPending}
                      onClick={() => remove.mutate(rev.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No reviews match your filters.</div>
        )}
      </div>

      {data && data.meta.totalPage > 1 && (
        <div className="flex justify-center gap-3">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="self-center text-sm text-muted-foreground">
            Page {data?.meta?.page} / {data?.meta?.totalPage}
          </span>
          <Button
            variant="outline"
            disabled={page >= data.meta.totalPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
