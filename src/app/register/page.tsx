'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, Mail, Lock, ArrowRight, User as UserIcon, CheckCircle2, ShieldCheck, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'TRAVEL_AGENT'>('USER');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        role,
      } as any);

      if (error) {
        toast.error(error.message || 'Failed to create account');
      } else {
        toast.success('Welcome aboard! Accessing your dashboard...');
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    'Personalized AI Travel Plans',
    'Exclusive Luxury Stay Deals',
    'Real-time Destination Alerts',
  ];

  return (
    <div className="min-h-screen flex items-stretch overflow-hidden bg-background">
      {/* Image Section */}
      <div className="hidden lg:block flex-1 relative bg-primary overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
          alt="Luxury Travel"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-background/90" />
        
        <div className="absolute top-20 left-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
              <Globe className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white uppercase">
              TRIPLANNER<span className="text-[#edae49]">AI</span>
            </span>
          </Link>
        </div>

        <div className="absolute bottom-24 left-20 right-20 text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          >
            <div className="w-16 h-1 bg-[#edae49] mb-8 rounded-full" />
            <h2 className="text-5xl lg:text-7xl font-black tracking-tight mb-10 leading-tight drop-shadow-2xl">
              START YOUR <br /> <span className="italic font-serif">World Tour</span> TODAY.
            </h2>
            <div className="space-y-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center space-x-4 text-white/90 group">
                  <div className="w-8 h-8 rounded-full bg-[#edae49]/20 flex items-center justify-center border border-[#edae49]/30 group-hover:bg-[#edae49] transition-colors duration-300">
                    <CheckCircle2 className="w-5 h-5 text-[#edae49] group-hover:text-[#003d5b]" />
                  </div>
                  <span className="text-xl font-bold tracking-wide">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-20 lg:px-32 relative z-10 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-12 lg:hidden">
             <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-md">
                <Globe className="text-primary-foreground w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-foreground uppercase">
                TRIPLANNER<span className="text-[#edae49]">AI</span>
              </span>
            </Link>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-3 text-foreground">Create Account</h1>
          <p className="text-lg text-muted-foreground mb-10 font-medium">
            Join the elite circle of AI-driven travelers.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest flex items-center space-x-2 text-foreground/60">
                <UserIcon className="w-4 h-4 text-primary" />
                <span>Full Name</span>
              </label>
              <Input
                type="text"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 rounded-2xl bg-secondary/5 border-border focus-visible:ring-primary text-lg font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest flex items-center space-x-2 text-foreground/60">
                <Mail className="w-4 h-4 text-primary" />
                <span>Email Address</span>
              </label>
              <Input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl bg-secondary/5 border-border focus-visible:ring-primary text-lg font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest flex items-center space-x-2 text-foreground/60">
                <Lock className="w-4 h-4 text-primary" />
                <span>Password</span>
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-2xl bg-secondary/5 border-border focus-visible:ring-primary text-lg font-medium"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-foreground/60">Select Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all text-left group",
                    role === 'USER' 
                      ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <ShieldCheck className={cn("w-6 h-6 mb-2", role === 'USER' ? "text-primary" : "text-muted-foreground")} />
                  <p className="text-xs font-black uppercase tracking-widest">Traveler</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('TRAVEL_AGENT')}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all text-left group",
                    role === 'TRAVEL_AGENT' 
                      ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <Briefcase className={cn("w-6 h-6 mb-2", role === 'TRAVEL_AGENT' ? "text-primary" : "text-muted-foreground")} />
                  <p className="text-xs font-black uppercase tracking-widest">Travel Agent</p>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
            >
              {isLoading ? 'ESTABLISHING CONNECTION...' : 'GET STARTED'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-black hover:text-accent transition-colors">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
