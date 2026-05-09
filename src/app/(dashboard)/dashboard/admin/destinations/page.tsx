'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Map, 
  Search,
  Plus,
  Loader2,
  Edit3,
  Trash2,
  MoreHorizontal,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Destination {
  id: string;
  name: string;
  country: string;
  category: string;
  avgCostPerDay: number;
  rating: number;
  isFeatured: boolean;
  createdAt: string;
}

const DestinationsManagementPage = () => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [aiCategorizing, setAiCategorizing] = useState(false);
  const [newDestination, setNewDestination] = useState({
    name: '',
    country: '',
    description: '',
    summary: '',
    category: '',
    avgCostPerDay: '',
    bestSeason: '',
    currency: 'USD',
  });

  const { data: destinations, isLoading } = useQuery({
    queryKey: ['admin-destinations', searchTerm],
    queryFn: async () => {
      const response = await axiosInstance.get('/destination', {
        params: { searchTerm },
      });
      return response.data.data as Destination[];
    },
    enabled: (session?.user as any)?.role === 'ADMIN' || (session?.user as any)?.role === 'TRAVEL_AGENT',
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof newDestination) => {
      const response = await axiosInstance.post('/destination', {
        ...data,
        avgCostPerDay: parseFloat(data.avgCostPerDay),
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Destination created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-destinations'] });
      setIsCreateDialogOpen(false);
      setNewDestination({
        name: '',
        country: '',
        description: '',
        summary: '',
        category: '',
        avgCostPerDay: '',
        bestSeason: '',
        currency: 'USD',
      });
    },
    onError: () => {
      toast.error('Failed to create destination');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/destination/${id}`);
    },
    onSuccess: () => {
      toast.success('Destination deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-destinations'] });
    },
  });

  const aiCategorizeMutation = useMutation({
    mutationFn: async (destinationData: { name: string; description: string }) => {
      const response = await axiosInstance.post('/ai/categorize', destinationData);
      return response.data.data;
    },
    onSuccess: (data) => {
      setNewDestination(prev => ({
        ...prev,
        category: data.categories[0] || prev.category,
      }));
      toast.success(`AI suggests: ${data.categories.join(', ')}`);
      setAiCategorizing(false);
    },
    onError: () => {
      toast.error('AI categorization failed');
      setAiCategorizing(false);
    },
  });

  const handleAICategorize = () => {
    if (!newDestination.name || !newDestination.description) {
      toast.error('Please enter name and description first');
      return;
    }
    setAiCategorizing(true);
    aiCategorizeMutation.mutate({
      name: newDestination.name,
      description: newDestination.description,
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newDestination);
  };

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
            Destinations
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
            Manage Platform Destinations
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 pl-12 rounded-xl border-border/60"
            />
          </div>
          <Button 
            className="h-14 px-6 rounded-xl bg-primary font-black uppercase text-xs tracking-widest"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations?.map((destination, index) => (
          <motion.div
            key={destination.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-border/50 rounded-[2rem] p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Map className="w-6 h-6 text-primary" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500"
                    onClick={() => deleteMutation.mutate(destination.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h3 className="text-xl font-black text-foreground mb-1">{destination.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{destination.country}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="rounded-full text-[10px] font-black uppercase">
                {destination.category}
              </Badge>
              {destination.isFeatured && (
                <Badge className="bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase">
                  Featured
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-muted-foreground text-xs uppercase">Cost/Day</span>
                <p className="font-black">${destination.avgCostPerDay}</p>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground text-xs uppercase">Rating</span>
                <p className="font-black">⭐ {destination.rating.toFixed(1)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="rounded-3xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black text-2xl">Add New Destination</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create a new destination for the platform
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreate} className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Name</Label>
                <Input
                  value={newDestination.name}
                  onChange={(e) => setNewDestination(prev => ({ ...prev, name: e.target.value }))}
                  className="h-14 rounded-xl"
                  placeholder="Destination name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Country</Label>
                <Input
                  value={newDestination.country}
                  onChange={(e) => setNewDestination(prev => ({ ...prev, country: e.target.value }))}
                  className="h-14 rounded-xl"
                  placeholder="Country"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest">Description</Label>
              <Textarea
                value={newDestination.description}
                onChange={(e) => setNewDestination(prev => ({ ...prev, description: e.target.value }))}
                className="rounded-xl min-h-[100px]"
                placeholder="Detailed description..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest">Summary</Label>
              <Input
                value={newDestination.summary}
                onChange={(e) => setNewDestination(prev => ({ ...prev, summary: e.target.value }))}
                className="h-14 rounded-xl"
                placeholder="Short summary (1-2 sentences)"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-black uppercase tracking-widest">Category</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-black uppercase text-primary"
                    onClick={handleAICategorize}
                    disabled={aiCategorizing || !newDestination.name || !newDestination.description}
                  >
                    {aiCategorizing ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1" />
                    )}
                    AI Auto-Tag
                  </Button>
                </div>
                <Input
                  value={newDestination.category}
                  onChange={(e) => setNewDestination(prev => ({ ...prev, category: e.target.value }))}
                  className="h-14 rounded-xl"
                  placeholder="e.g., Beach, Cultural"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Avg Cost/Day ($)</Label>
                <Input
                  type="number"
                  value={newDestination.avgCostPerDay}
                  onChange={(e) => setNewDestination(prev => ({ ...prev, avgCostPerDay: e.target.value }))}
                  className="h-14 rounded-xl"
                  placeholder="150"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Best Season</Label>
                <Input
                  value={newDestination.bestSeason}
                  onChange={(e) => setNewDestination(prev => ({ ...prev, bestSeason: e.target.value }))}
                  className="h-14 rounded-xl"
                  placeholder="e.g., May-October"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Currency</Label>
                <Input
                  value={newDestination.currency}
                  onChange={(e) => setNewDestination(prev => ({ ...prev, currency: e.target.value }))}
                  className="h-14 rounded-xl"
                  placeholder="USD"
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button 
                type="button"
                variant="outline" 
                className="flex-1 h-14 rounded-xl font-black uppercase text-xs tracking-widest"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 h-14 rounded-xl bg-primary font-black uppercase text-xs tracking-widest"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                )}
                Create Destination
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DestinationsManagementPage;
