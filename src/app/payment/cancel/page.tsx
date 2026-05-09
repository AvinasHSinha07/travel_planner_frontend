'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-40 pb-32 container mx-auto px-6 max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Checkout cancelled</h1>
          <p className="text-muted-foreground font-medium">
            No charge was made. You can return to your trip or destination and try again when you are ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/destinations">
              <Button className="h-14 rounded-2xl font-black uppercase text-xs tracking-widest px-8">
                Explore destinations
              </Button>
            </Link>
            <Link href="/dashboard/trips">
              <Button variant="outline" className="h-14 rounded-2xl font-black uppercase text-xs tracking-widest px-8">
                <ArrowLeft className="mr-2 w-4 h-4" />
                My trips
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
