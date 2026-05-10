'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  Settings, 
  Users, 
  Calendar, 
  Star,
  LogOut,
  Globe,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Bell,
  Heart,
  Briefcase,
  MessageSquare,
  Mountain,
  Hotel,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Define all sidebar links with role requirements
const sidebarLinks = [
  // User Console
  { 
    href: '/dashboard', 
    label: 'Overview', 
    icon: LayoutDashboard, 
    roles: ['USER', 'ADMIN', 'TRAVEL_AGENT'],
    section: 'MAIN'
  },
  { 
    href: '/dashboard/trips', 
    label: 'My Trips', 
    icon: Map, 
    roles: ['USER', 'ADMIN', 'TRAVEL_AGENT'],
    section: 'MAIN'
  },
  { 
    href: '/dashboard/bookings', 
    label: 'My Bookings', 
    icon: Calendar, 
    roles: ['USER', 'ADMIN', 'TRAVEL_AGENT'],
    section: 'MAIN'
  },
  { 
    href: '/dashboard/saved-destinations', 
    label: 'Saved', 
    icon: Heart, 
    roles: ['USER', 'ADMIN', 'TRAVEL_AGENT'],
    section: 'MAIN'
  },
  { 
    href: '/dashboard/settings', 
    label: 'Settings', 
    icon: Settings, 
    roles: ['USER', 'ADMIN', 'TRAVEL_AGENT'],
    section: 'MAIN'
  },
  
  // Inventory (Agent & Admin)
  { 
    href: '/dashboard/admin/destinations', 
    label: 'Destinations', 
    icon: Globe, 
    roles: ['ADMIN', 'TRAVEL_AGENT'],
    section: 'INVENTORY'
  },
  { 
    href: '/dashboard/admin/activities', 
    label: 'Activities', 
    icon: Mountain, 
    roles: ['ADMIN', 'TRAVEL_AGENT'],
    section: 'INVENTORY'
  },
  { 
    href: '/dashboard/admin/accommodations', 
    label: 'Accommodations', 
    icon: Hotel, 
    roles: ['ADMIN', 'TRAVEL_AGENT'],
    section: 'INVENTORY'
  },
  { 
    href: '/dashboard/admin/bookings', 
    label: 'Reservations', 
    icon: Briefcase, 
    roles: ['ADMIN', 'TRAVEL_AGENT'],
    section: 'INVENTORY'
  },
  { 
    href: '/dashboard/admin/reviews', 
    label: 'Reviews', 
    icon: MessageSquare, 
    roles: ['ADMIN', 'TRAVEL_AGENT'],
    section: 'INVENTORY'
  },

  { 
    href: '/dashboard/admin/analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    roles: ['ADMIN', 'TRAVEL_AGENT'],
    section: 'INVENTORY'
  },
  // Admin Only
  { 
    href: '/dashboard/admin/users', 
    label: 'Manage Users', 
    icon: Users, 
    roles: ['ADMIN'],
    section: 'ADMIN'
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  // Get user role from session
  const userRole = (session?.user as any)?.role || 'USER';

  // Filter links based on user role
  const filteredLinks = sidebarLinks.filter(link => {
    return link.roles.includes(userRole);
  });

  // Handle logout
  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Logged out successfully');
            router.push('/login');
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || 'Failed to logout');
          }
        }
      });
    } catch (error) {
      toast.error('An unexpected error occurred during logout');
    }
  };

  // Group links by section
  const mainLinks = filteredLinks.filter(l => (l as any).section === 'MAIN');
  const inventoryLinks = filteredLinks.filter(l => (l as any).section === 'INVENTORY');
  const adminLinks = filteredLinks.filter(l => (l as any).section === 'ADMIN');

  if (isPending) {
    return (
      <aside className={cn(
        "fixed left-0 top-0 h-full w-80 bg-[#001b2b] border-r border-white/5 flex flex-col z-50 transition-transform duration-500",
        !isOpen && "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-white/50 text-sm font-bold uppercase tracking-widest">
            Loading...
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full w-80 bg-[#001b2b] border-r border-white/5 flex flex-col z-50 transition-transform duration-500",
      !isOpen && "-translate-x-full lg:translate-x-0"
    )}>
      {/* Brand */}
      <div className="p-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-[#edae49] rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
            <Globe className="text-[#003d5b] w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">
            TRIPLANNER<span className="text-[#edae49]">AI</span>
          </span>
        </Link>

        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
      </div>

      {/* User Role Badge */}
      <div className="px-8 pb-4">
        <div className={cn(
          "inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
          userRole === 'ADMIN' ? "bg-purple-500/20 text-purple-300" :
          userRole === 'TRAVEL_AGENT' ? "bg-orange-500/20 text-orange-300" :
          "bg-blue-500/20 text-blue-300"
        )}>
          {userRole === 'ADMIN' && <ShieldCheck className="w-3 h-3" />}
          {userRole === 'TRAVEL_AGENT' && <Briefcase className="w-3 h-3" />}
          {userRole === 'USER' && <Star className="w-3 h-3" />}
          <span>{userRole.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav data-lenis-prevent className="flex-1 min-h-0 px-4 py-6 space-y-8 overflow-y-auto scrollbar-none">
        {/* Main Console */}
        <div>
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">Main Console</p>
          <div className="space-y-1">
            {mainLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-4 rounded-2xl transition-all group",
                    isActive 
                      ? "bg-[#edae49] text-[#003d5b] shadow-lg shadow-[#edae49]/10" 
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={cn("w-5 h-5", isActive ? "text-[#003d5b]" : "text-white/40 group-hover:text-white")} />
                    <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                  </div>
                  {isActive && <motion.div layoutId="sidebar-active" className="w-1 h-1 bg-[#003d5b] rounded-full" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Inventory Management */}
        {inventoryLinks.length > 0 && (
          <div>
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">
              {userRole === 'ADMIN' ? 'Inventory Control' : 'Agency Tools'}
            </p>
            <div className="space-y-1">
              {inventoryLinks.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-4 rounded-2xl transition-all group",
                      isActive 
                        ? "bg-[#edae49] text-[#003d5b] shadow-lg shadow-[#edae49]/10" 
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={cn("w-5 h-5", isActive ? "text-[#003d5b]" : "text-white/40 group-hover:text-white")} />
                      <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", isActive ? "hidden" : "block")} />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Platform Administration */}
        {adminLinks.length > 0 && (
          <div>
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">Platform Admin</p>
            <div className="space-y-1">
              {adminLinks.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-4 rounded-2xl transition-all group",
                      isActive 
                        ? "bg-[#edae49] text-[#003d5b] shadow-lg shadow-[#edae49]/10" 
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={cn("w-5 h-5", isActive ? "text-[#003d5b]" : "text-white/40 group-hover:text-white")} />
                      <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", isActive ? "hidden" : "block")} />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User Info & Logout */}
      <div className="p-6 border-t border-white/5 space-y-4">
        {session?.user && (
          <div className="flex items-center space-x-3 px-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {(session.user as any).name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{(session.user as any).name}</p>
              <p className="text-white/50 text-xs truncate">{session.user.email}</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-500 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em]"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
