'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { motion } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !session && mounted) {
      router.push('/login');
    }
  }, [session, isPending, mounted, router]);

  // Handle Role-Based Access Control (RBAC)
  useEffect(() => {
    if (session?.user && mounted) {
      const userRole = (session.user as any)?.role || 'USER';
      const pathname = window.location.pathname;

      // Restrict access to /dashboard/admin routes
      if (pathname.startsWith('/dashboard/admin')) {
        if (userRole === 'USER') {
          console.warn('[RBAC] Unauthorized access: USER attempting to access ADMIN route');
          router.push('/dashboard');
        } else if (userRole === 'TRAVEL_AGENT' && pathname === '/dashboard/admin/users') {
          console.warn('[RBAC] Unauthorized access: TRAVEL_AGENT attempting to access USERS management');
          router.push('/dashboard/admin');
        }
      }
    }
  }, [session, mounted, router]);

  if (!mounted || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">
            Synchronizing Travel Environment...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pl-80 transition-all duration-500">
        <DashboardHeader />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
