'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Loader2,
  Shield,
  User,
  Briefcase,
  MoreHorizontal,
  Ban,
  CheckCircle2,
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ServerDataTable } from '@/components/admin/ServerDataTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'TRAVEL_AGENT';
  emailVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
  _count?: {
    trips: number;
    bookings: number;
  };
}

const roleIcons: Record<string, React.ReactNode> = {
  ADMIN: <Shield className="w-4 h-4" />,
  USER: <User className="w-4 h-4" />,
  TRAVEL_AGENT: <Briefcase className="w-4 h-4" />,
};

const roleColors: Record<string, string> = {
  ADMIN: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  USER: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  TRAVEL_AGENT: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
};

const UsersManagementPage = () => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [suspendedFilter, setSuspendedFilter] = useState<'all' | 'true' | 'false'>('all');
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 15 });
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);

  const rawSortId = sorting[0]?.id ?? 'createdAt';
  const sortDesc = sorting[0]?.desc ?? true;
  const sortId = ['createdAt', 'name', 'email', 'role'].includes(rawSortId) ? rawSortId : 'createdAt';

  const { data: listResult, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, pagination, sortId, sortDesc, suspendedFilter],
    queryFn: async () => {
      const response = await axiosInstance.get('/user', {
        params: {
          search: searchTerm || undefined,
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          sortBy: sortId,
          sortOrder: sortDesc ? 'desc' : 'asc',
          suspended: suspendedFilter,
        },
      });
      return response.data.data as {
        items: UserData[];
        meta: { total: number; totalPages: number };
      };
    },
    enabled: (session?.user as { role?: string })?.role === 'ADMIN',
  });

  const users = listResult?.items ?? [];
  const pageCount = listResult?.meta.totalPages ?? 1;

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      await axiosInstance.patch(`/user/${userId}/role`, { role });
    },
    onSuccess: () => {
      toast.success('User role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsRoleDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to update user role');
    },
  });

  const suspendMutation = useMutation({
    mutationFn: async ({ userId, isSuspended }: { userId: string; isSuspended: boolean }) => {
      await axiosInstance.patch(`/user/${userId}/suspension`, { isSuspended });
    },
    onSuccess: () => {
      toast.success('User updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Failed to update suspension'),
  });

  const columns = useMemo<ColumnDef<UserData>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'User',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-black text-primary text-sm">
                {row.original.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-bold text-foreground">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        enableSorting: true,
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={`${roleColors[row.original.role]} rounded-full text-[10px] font-black uppercase tracking-wider border`}
          >
            <span className="flex items-center space-x-1">
              {roleIcons[row.original.role]}
              <span>{row.original.role.replace('_', ' ')}</span>
            </span>
          </Badge>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ row }) => {
          const u = row.original;
          if (u.isSuspended) {
            return (
              <span className="flex items-center space-x-1 text-red-600 text-xs font-bold">
                <Ban className="w-3 h-3" />
                <span>Suspended</span>
              </span>
            );
          }
          return u.emailVerified ? (
            <span className="flex items-center space-x-1 text-green-600 text-xs font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-yellow-600 text-xs font-bold">
              <Ban className="w-3 h-3" />
              <span>Pending</span>
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Joined',
        enableSorting: true,
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">
            {new Date(String(getValue())).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'activity',
        header: 'Activity',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>{row.original._count?.trips || 0} trips</span>
            <span>{row.original._count?.bookings || 0} bookings</span>
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(row.original);
                    setIsRoleDialogOpen(true);
                  }}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Change Role
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    suspendMutation.mutate({
                      userId: row.original.id,
                      isSuspended: !row.original.isSuspended,
                    })
                  }
                >
                  <Ban className="w-4 h-4 mr-2" />
                  {row.original.isSuspended ? 'Reinstate account' : 'Suspend account'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [suspendMutation],
  );

  if ((session?.user as { role?: string })?.role !== 'ADMIN') {
    return <p className="text-center py-20 text-muted-foreground">Admin only.</p>;
  }

  if (isLoading && !listResult) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase mb-2">
            User Management
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
            Manage Platform Users & Roles
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={suspendedFilter}
            onValueChange={(v) => {
              setSuspendedFilter((v as 'all' | 'true' | 'false') || 'all');
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
          >
            <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All users</SelectItem>
              <SelectItem value="false">Active only</SelectItem>
              <SelectItem value="true">Suspended only</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
              className="h-14 pl-12 rounded-xl border-border/60"
            />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-[2.5rem] p-6"
      >
        <ServerDataTable
          data={users}
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
      </motion.div>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-black text-xl">Change User Role</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update role for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {(['USER', 'TRAVEL_AGENT', 'ADMIN'] as const).map((role) => (
              <Button
                key={role}
                variant={selectedUser?.role === role ? 'default' : 'outline'}
                className="h-20 rounded-xl font-black uppercase text-xs tracking-widest"
                onClick={() => {
                  if (selectedUser) {
                    updateRoleMutation.mutate({ userId: selectedUser.id, role });
                  }
                }}
                disabled={updateRoleMutation.isPending}
              >
                {roleIcons[role]}
                <span className="ml-2">{role.replace('_', ' ')}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagementPage;
