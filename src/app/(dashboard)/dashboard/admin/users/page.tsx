'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  CheckCircle2
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

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'TRAVEL_AGENT';
  emailVerified: boolean;
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

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async () => {
      const response = await axiosInstance.get('/user', {
        params: { search: searchTerm },
      });
      return response.data.data as UserData[];
    },
    enabled: (session?.user as any)?.role === 'ADMIN',
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await axiosInstance.patch(`/user/${userId}/role`, { role });
      return response.data;
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
            User Management
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
            Manage Platform Users & Roles
          </p>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 pl-12 rounded-xl border-border/60"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border/50 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/5 border-b border-border/50">
              <tr>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  User
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Joined
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Activity
                </th>
                <th className="text-right py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users?.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-secondary/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-black text-primary text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge 
                      variant="outline" 
                      className={`${roleColors[user.role]} rounded-full text-[10px] font-black uppercase tracking-wider border`}
                    >
                      <span className="flex items-center space-x-1">
                        {roleIcons[user.role]}
                        <span>{user.role.replace('_', ' ')}</span>
                      </span>
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    {user.emailVerified ? (
                      <span className="flex items-center space-x-1 text-green-600 text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-yellow-600 text-xs font-bold">
                        <Ban className="w-3 h-3" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{user._count?.trips || 0} trips</span>
                      <span>{user._count?.bookings || 0} bookings</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedUser(user);
                            setIsRoleDialogOpen(true);
                          }}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change Dialog */}
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
