'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { motion } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';

function getUserRole(session: unknown): string {
  const u = (session as { user?: { role?: string } } | null | undefined)?.user;
  return u?.role ?? 'USER';
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !session && mounted) {
      router.replace('/login');
    }
  }, [session, isPending, mounted, router]);

  // Role-Based Access Control (RBAC) — mirrors backend requireAuth rules for admin routes
  useEffect(() => {
    if (!session?.user || !mounted || !pathname) return;

    const userRole = getUserRole(session);

    if (pathname.startsWith('/dashboard/admin')) {
      if (userRole === 'USER') {
        router.replace('/dashboard');
        return;
      }
      if (userRole === 'TRAVEL_AGENT' && pathname.startsWith('/dashboard/admin/users')) {
        router.replace('/dashboard/admin');
      }
    }
  }, [session, mounted, pathname, router]);

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
