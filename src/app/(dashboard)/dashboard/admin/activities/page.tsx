'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import axiosInstance from '@/lib/axiosInstance';
import { authClient } from '@/lib/auth-client';
import { ServerDataTable } from '@/components/admin/ServerDataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { ImageUploadButton } from '@/components/admin/ImageUploadButton';

type ActivityRow = {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  duration: string;
  location?: string | null;
  images?: string[];
  destination: { id: string; name: string; country: string };
};

type DestinationOpt = { id: string; name: string; country: string };

const emptyForm = {
  destinationId: '',
  name: '',
  description: '',
  type: '',
  price: '',
  duration: '',
  location: '',
  images: '' as string,
};

export default function AdminActivitiesPage() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role;
  const canAccess = role === 'ADMIN' || role === 'TRAVEL_AGENT';

  const [destinationFilter, setDestinationFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 400);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 15 });
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editRow, setEditRow] = useState<ActivityRow | null>(null);
  const [form, setForm] = useState(emptyForm);

  const rawSortId = sorting[0]?.id ?? 'createdAt';
  const sortDesc = sorting[0]?.desc ?? true;
  const sortId = ['name', 'price', 'createdAt', 'rating', 'type'].includes(rawSortId)
    ? rawSortId
    : 'createdAt';

  const { data: destinations = [] } = useQuery({
    queryKey: ['admin-activity-destinations'],
    queryFn: async () => {
      const res = await axiosInstance.get('/destination');
      return res.data.data as DestinationOpt[];
    },
    enabled: canAccess,
  });

  const { data: listResult, isLoading } = useQuery({
    queryKey: [
      'admin-activities',
      destinationFilter,
      debouncedSearch,
      pagination.pageIndex,
      pagination.pageSize,
      sortId,
      sortDesc,
    ],
    queryFn: async () => {
      const res = await axiosInstance.get('/activity', {
        params: {
          destinationId: destinationFilter || undefined,
          search: debouncedSearch || undefined,
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          sortBy: sortId,
          sortOrder: sortDesc ? 'desc' : 'asc',
          isManagement: 'true',
        },
      });
      return res.data as {
        data: ActivityRow[];
        meta: { total: number; totalPage: number };
      };
    },
    enabled: canAccess,
  });

  const items = listResult?.data ?? [];
  const pageCount = listResult?.meta?.totalPage ?? 1;

  const createMut = useMutation({
    mutationFn: async () => {
      const images = form.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      await axiosInstance.post('/activity', {
        destinationId: form.destinationId,
        name: form.name,
        description: form.description,
        type: form.type,
        price: Number(form.price) || 0,
        duration: form.duration,
        location: form.location || undefined,
        images: images.length ? images : undefined,
      });
    },
    onSuccess: () => {
      toast.success('Activity created');
      setCreateOpen(false);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Create failed');
    },
  });

  const updateMut = useMutation({
    mutationFn: async () => {
      if (!editRow) return;
      const images = form.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      await axiosInstance.patch(`/activity/${editRow.id}`, {
        destinationId: form.destinationId || undefined,
        name: form.name,
        description: form.description,
        type: form.type,
        price: Number(form.price) || 0,
        duration: form.duration,
        location: form.location || undefined,
        images: images.length ? images : undefined,
      });
    },
    onSuccess: () => {
      toast.success('Activity updated');
      setEditRow(null);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Update failed');
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/activity/${id}`);
    },
    onSuccess: () => {
      toast.success('Deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
    },
    onError: () => toast.error('Delete failed'),
  });

  const openEdit = useCallback(
    (row: ActivityRow) => {
      setEditRow(row);
      setForm({
        destinationId: row.destination.id,
        name: row.name,
        description: row.description,
        type: row.type,
        price: String(row.price),
        duration: row.duration,
        location: row.location ?? '',
        images: row.images?.length ? row.images.join(', ') : '',
      });
    },
    [],
  );

  const columns = useMemo<ColumnDef<ActivityRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
      },
      {
        id: 'destination',
        header: 'Destination',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.destination.name}, {row.original.destination.country}
          </span>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        enableSorting: true,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        enableSorting: true,
        cell: ({ getValue }) => `$${Number(getValue()).toLocaleString()}`,
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
        enableSorting: false,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-lg"
              onClick={() => openEdit(row.original)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="rounded-lg"
              onClick={() => {
                if (confirm('Delete this activity?')) deleteMut.mutate(row.original.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [openEdit, deleteMut],
  );

  if (!canAccess) {
    return <p className="text-muted-foreground text-center py-20">Access denied.</p>;
  }

  const formBody = (
    <div className="grid gap-4 py-2">
      <div className="space-y-2">
        <Label className="text-xs font-black uppercase">Destination</Label>
        <Select
          value={form.destinationId}
          onValueChange={(v) => setForm((f) => ({ ...f, destinationId: v ?? '' }))}
        >
          <SelectTrigger className="rounded-xl h-11">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="rounded-xl max-h-64">
            {destinations.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}, {d.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-black uppercase">Name</Label>
        <Input
          className="rounded-xl"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-black uppercase">Description</Label>
        <Textarea
          className="rounded-xl min-h-[80px]"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase">Type</Label>
          <Input
            className="rounded-xl"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase">Duration</Label>
          <Input
            className="rounded-xl"
            value={form.duration}
            onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase">Price (USD)</Label>
          <Input
            className="rounded-xl"
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase">Location</Label>
          <Input
            className="rounded-xl"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-black uppercase">Image URLs (comma-separated)</Label>
        <Textarea
          className="rounded-xl min-h-[60px]"
          value={form.images}
          onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
        />
        <ImageUploadButton
          folder="activities"
          label="Upload & append URL"
          onUploaded={(url) =>
            setForm((f) => ({
              ...f,
              images: f.images ? `${f.images.trim()}, ${url}` : url,
            }))
          }
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Activities</h1>
          <p className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
            CRUD by destination
          </p>
        </div>
        <Button
          className="rounded-xl md:rounded-2xl font-black uppercase text-xs h-12 md:h-14"
          onClick={() => {
            setForm({
              ...emptyForm,
              destinationId: destinationFilter || destinations[0]?.id || '',
            });
            setCreateOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New activity
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <Select
          value={destinationFilter || 'all'}
          onValueChange={(v) => {
            setDestinationFilter(v === 'all' ? '' : (v ?? ''));
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}
        >
          <SelectTrigger className="w-full sm:w-[240px] md:w-[280px] h-11 md:h-12 rounded-xl">
            <SelectValue placeholder="All destinations" />
          </SelectTrigger>
          <SelectContent className="rounded-xl max-h-72">
            <SelectItem value="all">All destinations</SelectItem>
            {destinations.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1 max-w-md">
          <Input
            className="w-full h-11 md:h-12 rounded-xl"
            placeholder="Search name, type, description…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
          />
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 overflow-hidden">
        <ServerDataTable
          data={items}
          columns={columns}
          pageCount={pageCount}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={(updater) => {
            setSorting(updater);
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}
          isLoading={isLoading}
        />
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="rounded-3xl max-w-lg w-[95vw] overflow-y-auto max-h-[90dvh]">
          <DialogHeader>
            <DialogTitle className="font-black uppercase text-xl">New activity</DialogTitle>
          </DialogHeader>
          {formBody}
          <Button
            className="w-full rounded-xl font-black uppercase text-xs h-12 mt-4"
            disabled={createMut.isPending || !form.destinationId || !form.name}
            onClick={() => createMut.mutate()}
          >
            {createMut.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Activity'}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editRow}
        onOpenChange={(o) => {
          if (!o) {
            setEditRow(null);
            setForm(emptyForm);
          }
        }}
      >
        <DialogContent className="rounded-3xl max-w-lg w-[95vw] overflow-y-auto max-h-[90dvh]">
          <DialogHeader>
            <DialogTitle className="font-black uppercase text-xl">Edit activity</DialogTitle>
          </DialogHeader>
          {formBody}
          <Button
            className="w-full rounded-xl font-black uppercase text-xs h-12 mt-4"
            disabled={updateMut.isPending}
            onClick={() => updateMut.mutate()}
          >
            {updateMut.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
