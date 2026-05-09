'use client';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const SAVED_IDS_KEY = ['saved-destination-ids'] as const;
const SAVED_LIST_KEY = ['saved-destinations'] as const;

type SaveDestinationHeartProps = {
  destinationId: string;
  className?: string;
  size?: 'sm' | 'md';
};

export function SaveDestinationHeart({
  destinationId,
  className,
  size = 'md',
}: SaveDestinationHeartProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const userId = session?.user?.id;

  const { data: savedIds = [], isLoading: idsLoading } = useQuery({
    queryKey: SAVED_IDS_KEY,
    queryFn: async () => {
      const res = await axiosInstance.get('/saved-destinations/ids');
      return res.data.data as string[];
    },
    enabled: !!userId,
  });

  const isSaved = savedIds.includes(destinationId);

  const mutation = useMutation({
    mutationFn: async () => {
      const ids = queryClient.getQueryData<string[]>(SAVED_IDS_KEY) ?? [];
      const currentlySaved = ids.includes(destinationId);
      if (currentlySaved) {
        await axiosInstance.delete(`/saved-destinations/${destinationId}`);
      } else {
        await axiosInstance.post('/saved-destinations', { destinationId });
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: SAVED_IDS_KEY });
      const previousIds = queryClient.getQueryData<string[]>(SAVED_IDS_KEY);
      const list = previousIds ?? [];
      const wasSaved = list.includes(destinationId);
      const next = wasSaved ? list.filter((id) => id !== destinationId) : [...list, destinationId];
      queryClient.setQueryData(SAVED_IDS_KEY, next);

      let previousList: unknown[] | undefined;
      await queryClient.cancelQueries({ queryKey: SAVED_LIST_KEY });
      const fullList = queryClient.getQueryData<unknown[]>(SAVED_LIST_KEY);
      if (fullList && wasSaved) {
        previousList = fullList;
        const asDests = fullList as { id: string }[];
        queryClient.setQueryData(
          SAVED_LIST_KEY,
          asDests.filter((d) => d.id !== destinationId),
        );
      }

      return { previousIds, previousList };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previousIds !== undefined) {
        queryClient.setQueryData(SAVED_IDS_KEY, ctx.previousIds);
      }
      if (ctx?.previousList !== undefined) {
        queryClient.setQueryData(SAVED_LIST_KEY, ctx.previousList);
      }
      toast.error('Could not update saved destinations. Try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_IDS_KEY });
      queryClient.invalidateQueries({ queryKey: SAVED_LIST_KEY });
    },
  });

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const btnSize = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (sessionLoading) return;
    if (!userId) {
      toast.message('Sign in to save destinations', {
        action: {
          label: 'Log in',
          onClick: () => router.push('/login'),
        },
      });
      return;
    }
    mutation.mutate();
  };

  const showLoading = !!userId && (idsLoading || mutation.isPending);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={showLoading}
      aria-label={isSaved ? 'Remove from saved' : 'Save destination'}
      className={cn(
        btnSize,
        'rounded-full flex items-center justify-center backdrop-blur-md border transition-all',
        'bg-white/15 border-white/25 text-white hover:bg-white/25',
        isSaved && 'bg-primary/90 border-primary text-primary-foreground',
        showLoading && 'opacity-60 cursor-wait',
        className,
      )}
    >
      <Heart
        className={cn(iconSize, isSaved && 'fill-current')}
      />
    </button>
  );
}
