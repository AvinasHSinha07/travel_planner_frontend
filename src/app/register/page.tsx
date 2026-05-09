'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Mail, Lock, ArrowRight, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Auth logic will go here
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
          alt="Paris Travel"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-background/90" />
        
        <div className="absolute top-20 left-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
              <Globe className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">
              PLANORA<span className="text-accent">.AI</span>
            </span>
          </Link>
        </div>

        <div className="absolute bottom-24 left-20 right-20 text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          >
            <div className="w-16 h-1 bg-accent mb-8 rounded-full" />
            <h2 className="text-5xl lg:text-6xl font-black tracking-tight mb-10 leading-tight drop-shadow-2xl">
              Start your world <br /> tour today.
            </h2>
            <div className="space-y-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center space-x-4 text-white/90 group">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 group-hover:bg-accent transition-colors duration-300">
                    <CheckCircle2 className="w-5 h-5 text-accent group-hover:text-accent-foreground" />
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
              <span className="text-2xl font-black tracking-tighter text-foreground">
                PLANORA<span className="text-accent">.AI</span>
              </span>
            </Link>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-3 text-foreground">Create Account</h1>
          <p className="text-lg text-muted-foreground mb-10 font-medium">
            Join the elite circle of AI-driven travelers.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center space-x-2 text-foreground">
                <User className="w-4 h-4 text-secondary" />
                <span>Full Name</span>
              </label>
              <Input
                type="text"
                placeholder="Alex Morgan"
                className="h-14 rounded-2xl bg-secondary/5 border-border focus-visible:ring-secondary text-lg"
                required
              />
            </div>

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
              <label className="text-sm font-bold flex items-center space-x-2 text-foreground">
                <Lock className="w-4 h-4 text-secondary" />
                <span>Password</span>
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-14 rounded-2xl bg-secondary/5 border-border focus-visible:ring-secondary text-lg"
                required
              />
            </div>

            <div className="flex items-start space-x-3 py-2">
              <div className="pt-1">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary accent-primary" required />
              </div>
              <label className="text-sm text-muted-foreground font-medium leading-relaxed">
                I agree to the <Link href="#" className="text-secondary font-black hover:text-accent transition-colors">Terms of Service</Link> and <Link href="#" className="text-secondary font-black hover:text-accent transition-colors">Privacy Policy</Link>
              </label>
            </div>

            <Button
              disabled={isLoading}
              className="w-full h-14 rounded-full text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
            >
              {isLoading ? 'Creating Account...' : 'Get Started'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-secondary font-black hover:text-accent transition-colors">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
