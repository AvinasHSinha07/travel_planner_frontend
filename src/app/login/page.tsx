'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Auth logic will go here
  };

  return (
    <div className="min-h-screen flex items-stretch overflow-hidden bg-background">
      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-20 lg:px-32 relative z-10 bg-background">
        <Link href="/" className="absolute top-10 left-8 md:left-20 flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-md">
            <Globe className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground">
            PLANORA<span className="text-accent">.AI</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full mx-auto"
        >
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-3 text-foreground">Welcome back</h1>
          <p className="text-lg text-muted-foreground mb-10 font-medium">
            Sign in to continue your journey with Planora.AI
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center space-x-2 text-foreground">
                <Mail className="w-4 h-4 text-secondary" />
                <span>Email Address</span>
              </label>
              <Input
                type="email"
                placeholder="alex@example.com"
                className="h-14 rounded-2xl bg-secondary/5 border-border focus-visible:ring-secondary text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold flex items-center space-x-2 text-foreground">
                  <Lock className="w-4 h-4 text-secondary" />
                  <span>Password</span>
                </label>
                <Link href="#" className="text-xs font-bold text-secondary hover:text-accent transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-14 rounded-2xl bg-secondary/5 border-border focus-visible:ring-secondary text-lg"
                required
              />
            </div>

            <Button
              disabled={isLoading}
              className="w-full h-14 rounded-full text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="mt-10 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-bold tracking-widest">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <Button variant="outline" className="h-14 rounded-2xl font-bold flex items-center space-x-2 border-border/60 hover:bg-secondary/5 hover:border-secondary/30 transition-all">
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              <span>Google</span>
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl font-bold flex items-center space-x-2 border-border/60 hover:bg-secondary/5 hover:border-secondary/30 transition-all">
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </Button>
          </div>

          <p className="mt-10 text-center text-sm font-medium text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-secondary font-bold hover:text-accent transition-colors">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Image Section */}
      <div className="hidden lg:block flex-1 relative bg-primary overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src="https://images.unsplash.com/photo-1519046904884-53103b34b206"
          alt="Luxury Travel"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-background/90" />
        
        <div className="absolute bottom-24 left-20 right-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="w-16 h-1 bg-accent mb-8 rounded-full" />
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-8 leading-tight drop-shadow-lg">
              "The most personalized travel experience I've ever had. AI done right."
            </h2>
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full border-2 border-accent overflow-hidden shadow-lg">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=50" alt="Testimonial" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-black text-lg">Sarah Jenkins</p>
                <p className="text-sm font-bold text-white/70 uppercase tracking-wider">Luxury Traveler, NY</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
