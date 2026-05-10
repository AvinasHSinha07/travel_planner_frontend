'use client';

import React from 'react';
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  avatar?: string | null;
};

const DashboardHeader = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success('Session terminated successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to terminate session');
    }
  };

  return (
    <header className="h-24 bg-background border-b border-border/50 sticky top-0 z-40 px-10 flex items-center justify-between">
      {/* Quick Search */}
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Command Search..." 
          className="h-12 pl-12 rounded-xl bg-secondary/5 border-border/60 focus-visible:ring-primary font-medium"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <button className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-foreground hover:bg-secondary/20 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
        </button>

        {/* AI Credit Indicator */}
        <div className="hidden md:flex items-center space-x-3 px-5 py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
           <Sparkles className="w-4 h-4 text-primary" />
           <span className="text-[10px] font-black uppercase tracking-widest text-primary">
            {user?.role === 'ADMIN' ? 'System Root' : 'Elite Access'}
           </span>
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center space-x-4 p-2 hover:bg-secondary/10 rounded-2xl transition-all cursor-pointer">
              <Avatar className="w-11 h-11 border-2 border-primary/20">
                <AvatarImage src={user?.image || user?.avatar || ""} />
                <AvatarFallback className="font-black bg-primary/10 text-primary">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-black text-foreground leading-tight uppercase tracking-tight">
                  {user?.name || "Authenticating..."}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {user?.role?.replace('_', ' ') || "Guest"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-3 rounded-2xl shadow-2xl border-border/50 bg-background/80 backdrop-blur-xl">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-black uppercase tracking-widest text-[10px] text-muted-foreground px-2 py-3">Management</DropdownMenuLabel>
              <DropdownMenuItem className="rounded-xl py-3 cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
                <User className="w-4 h-4 mr-3" />
                <span className="font-bold">My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl py-3 cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
                <Settings className="w-4 h-4 mr-3" />
                <span className="font-bold">Preferences</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2 bg-border/50" />
            <DropdownMenuGroup>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="rounded-xl py-3 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span className="font-bold uppercase tracking-widest text-xs">Terminate</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
