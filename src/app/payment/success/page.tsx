'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      toast.error('Missing checkout session.');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        await axiosInstance.get('/booking/verify', {
          params: { sessionId },
        });
        if (!cancelled) setStatus('ok');
      } catch {
        if (!cancelled) {
          setStatus('error');
          toast.error('Could not verify payment. If you were charged, check your bookings.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-40 pb-32 container mx-auto px-6 max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
              <h1 className="text-3xl font-black uppercase tracking-tight">Confirming payment…</h1>
            </>
          )}
          {status === 'ok' && (
            <>
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight">Payment successful</h1>
              <p className="text-muted-foreground font-medium">
                Your booking is recorded. You can review details anytime from your dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/dashboard/bookings">
                  <Button className="h-14 rounded-2xl font-black uppercase text-xs tracking-widest px-8">
                    View bookings
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="h-14 rounded-2xl font-black uppercase text-xs tracking-widest px-8">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </>
          )}
          {status === 'error' && (
            <>
              <h1 className="text-3xl font-black uppercase tracking-tight">Something went wrong</h1>
              <p className="text-muted-foreground font-medium">
                We could not verify this session. Open bookings or contact support if payment completed.
              </p>
              <Link href="/dashboard/bookings">
                <Button className="h-14 rounded-2xl font-black uppercase text-xs tracking-widest px-8">
                  My bookings
                </Button>
              </Link>
            </>
          )}
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
