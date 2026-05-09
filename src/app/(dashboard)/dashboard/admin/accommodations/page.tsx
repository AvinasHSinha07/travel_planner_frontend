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

const ACC_TYPES = ['HOTEL', 'RESORT', 'HOSTEL', 'AIRBNB', 'VILLA'] as const;

type AccommodationRow = {
  id: string;
  name: string;
  type: string;
  pricePerNight: number;
  destination: { id: string; name: string; country: string };
};

type DestinationOpt = { id: string; name: string; country: string };

const emptyForm = {
  destinationId: '',
  name: '',
  type: 'HOTEL' as (typeof ACC_TYPES)[number],
  pricePerNight: '',
  amenities: '',
  location: '',
  images: '',
};

export default function AdminAccommodationsPage() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role;
  const canAccess = role === 'ADMIN' || role === 'TRAVEL_AGENT';

  const [destinationFilter, setDestinationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 400);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 15 });
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editRow, setEditRow] = useState<AccommodationRow | null>(null);
  const [form, setForm] = useState(emptyForm);

  const rawSortId = sorting[0]?.id ?? 'createdAt';
  const sortDesc = sorting[0]?.desc ?? true;
  const sortId = ['name', 'pricePerNight', 'createdAt', 'rating', 'type'].includes(rawSortId)
    ? rawSortId
    : 'createdAt';

  const { data: destinations = [] } = useQuery({
    queryKey: ['admin-acc-destinations'],
    queryFn: async () => {
      const res = await axiosInstance.get('/destination');
      return res.data.data as DestinationOpt[];
    },
    enabled: canAccess,
  });

  const { data: listResult, isLoading } = useQuery({
    queryKey: [
      'admin-accommodations',
      destinationFilter,
      typeFilter,
      debouncedSearch,
      pagination.pageIndex,
      pagination.pageSize,
      sortId,
      sortDesc,
    ],
    queryFn: async () => {
      const res = await axiosInstance.get('/accommodation', {
        params: {
          destinationId: destinationFilter || undefined,
          type: typeFilter !== 'all' ? typeFilter : undefined,
          search: debouncedSearch || undefined,
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          sortBy: sortId,
          sortOrder: sortDesc ? 'desc' : 'asc',
        },
      });
      return res.data.data as {
        items: AccommodationRow[];
        meta: { total: number; totalPages: number };
      };
    },
    enabled: canAccess,
  });

  const items = listResult?.items ?? [];
  const pageCount = listResult?.meta.totalPages ?? 1;

  const createMut = useMutation({
    mutationFn: async () => {
      const amenities = form.amenities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const images = form.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      await axiosInstance.post('/accommodation', {
        destinationId: form.destinationId,
        name: form.name,
        type: form.type,
        pricePerNight: Number(form.pricePerNight) || 0,
        amenities: amenities.length ? amenities : undefined,
        location: form.location || undefined,
        images: images.length ? images : undefined,
      });
    },
    onSuccess: () => {
      toast.success('Accommodation created');
      setCreateOpen(false);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ['admin-accommodations'] });
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Create failed');
    },
  });

  const updateMut = useMutation({
    mutationFn: async () => {
      if (!editRow) return;
      const amenities = form.amenities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const images = form.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      await axiosInstance.patch(`/accommodation/${editRow.id}`, {
        destinationId: form.destinationId || undefined,
        name: form.name,
        type: form.type,
        pricePerNight: Number(form.pricePerNight) || 0,
        amenities: amenities.length ? amenities : undefined,
        location: form.location || undefined,
        images: images.length ? images : undefined,
      });
    },
    onSuccess: () => {
      toast.success('Updated');
      setEditRow(null);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ['admin-accommodations'] });
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Update failed');
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/accommodation/${id}`);
    },
    onSuccess: () => {
      toast.success('Deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-accommodations'] });
    },
    onError: () => toast.error('Delete failed'),
  });

  const openEdit = useCallback((row: AccommodationRow) => {
    setEditRow(row);
    setForm({
      destinationId: row.destination.id,
      name: row.name,
      type: row.type as (typeof ACC_TYPES)[number],
      pricePerNight: String(row.pricePerNight),
      amenities: '',
      location: '',
      images: '',
    });
  }, []);

  const columns = useMemo<ColumnDef<AccommodationRow>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', enableSorting: true },
      {
        id: 'destination',
        header: 'Destination',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {row.original.destination.name}
          </span>
        ),
      },
      { accessorKey: 'type', header: 'Type', enableSorting: true },
      {
        accessorKey: 'pricePerNight',
        header: 'Price / night',
        enableSorting: true,
        cell: ({ getValue }) => `$${Number(getValue()).toLocaleString()}`,
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
                if (confirm('Delete?')) deleteMut.mutate(row.original.id);
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
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase">Type</Label>
          <Select
            value={form.type}
            onValueChange={(v) =>
              setForm((f) => ({ ...f, type: (v ?? 'HOTEL') as (typeof ACC_TYPES)[number] }))
            }
          >
            <SelectTrigger className="rounded-xl h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {ACC_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase">Price / night</Label>
          <Input
            type="number"
            className="rounded-xl"
            value={form.pricePerNight}
            onChange={(e) => setForm((f) => ({ ...f, pricePerNight: e.target.value }))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-black uppercase">Amenities (comma-separated)</Label>
        <Textarea
          className="rounded-xl min-h-[60px]"
          value={form.amenities}
          onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))}
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
      <div className="space-y-2">
        <Label className="text-xs font-black uppercase">Image URLs</Label>
        <Textarea
          className="rounded-xl min-h-[60px]"
          value={form.images}
          onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
        />
        <ImageUploadButton
          folder="accommodations"
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Accommodations</h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">
            CRUD by destination
          </p>
        </div>
        <Button
          className="rounded-2xl font-black uppercase text-xs h-12"
          onClick={() => {
            setForm({
              ...emptyForm,
              destinationId: destinationFilter || destinations[0]?.id || '',
            });
            setCreateOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New stay
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
        <Select
          value={destinationFilter || 'all'}
          onValueChange={(v) => {
            setDestinationFilter(v === 'all' ? '' : (v ?? ''));
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}
        >
          <SelectTrigger className="w-full lg:w-[260px] h-12 rounded-xl">
            <SelectValue placeholder="Destination" />
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
        <Select
          value={typeFilter}
          onValueChange={(v) => {
            setTypeFilter(v ?? 'all');
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}
        >
          <SelectTrigger className="w-full lg:w-[200px] h-12 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All types</SelectItem>
            {ACC_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className="max-w-md h-12 rounded-xl"
          placeholder="Search…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}
        />
      </div>

      <ServerDataTable
        data={items}
        columns={columns}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={(u) => {
          setSorting(u);
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        }}
        isLoading={isLoading}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="rounded-[2rem] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black uppercase">New accommodation</DialogTitle>
          </DialogHeader>
          {formBody}
          <Button
            className="w-full rounded-xl font-black uppercase text-xs h-11"
            disabled={createMut.isPending || !form.destinationId || !form.name}
            onClick={() => createMut.mutate()}
          >
            {createMut.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create'}
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
        <DialogContent className="rounded-[2rem] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black uppercase">Edit accommodation</DialogTitle>
          </DialogHeader>
          {formBody}
          <Button
            className="w-full rounded-xl font-black uppercase text-xs h-11"
            disabled={updateMut.isPending}
            onClick={() => updateMut.mutate()}
          >
            {updateMut.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
