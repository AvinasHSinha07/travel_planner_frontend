'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

const demoEmail = process.env.NEXT_PUBLIC_DEMO_LOGIN_EMAIL;
const demoPassword = process.env.NEXT_PUBLIC_DEMO_LOGIN_PASSWORD;

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('[LOGIN] Attempting login...');
      const result = await authClient.signIn.email({
        email,
        password,
      });

      console.log('[LOGIN] Sign in result:', result);
      
      if (result.error) {
        toast.error(result.error.message || 'Authentication failed');
      } else {
        toast.success('Welcome back to your journey!');
        // Check cookies after login
        console.log('[LOGIN] Cookies after login:', document.cookie);
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('[LOGIN] Error:', err);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: window.location.origin + '/dashboard'
      });
    } catch (error: any) {
      toast.error('Google login failed');
    }
  };

  const handleDemoLogin = async () => {
    if (!demoEmail || !demoPassword) {
      toast.error('Demo login is not configured.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await authClient.signIn.email({
        email: demoEmail,
        password: demoPassword,
      });
      if (result.error) {
        toast.error(result.error.message || 'Demo login failed');
      } else {
        toast.success('Signed in with demo account');
        router.push('/dashboard');
      }
    } catch {
      toast.error('Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    if (!demoEmail || !demoPassword) {
      toast.error('Set NEXT_PUBLIC_DEMO_LOGIN_EMAIL and NEXT_PUBLIC_DEMO_LOGIN_PASSWORD in .env.local');
      return;
    }
    setEmail(demoEmail);
    setPassword(demoPassword);
    toast.info('Credentials filled — press Sign In or use instant demo below.');
  };

  return (
    <div className="min-h-screen flex items-stretch overflow-hidden bg-background">
      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-32 relative z-10 bg-background overflow-y-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full mx-auto"
        >
          {/* Logo - Moved inside for better flow on mobile */}
          <Link href="/" className="flex items-center space-x-3 group mb-12 lg:mb-16">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-md">
              <Globe className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-foreground uppercase">
              TRIPLANNER<span className="text-[#edae49]">AI</span>
            </span>
          </Link>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-foreground">Welcome Back</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 md:mb-10 font-medium">
            Sign in to continue your journey with <span className="text-primary font-bold">TRIPLANNERAI</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] flex items-center space-x-2 text-foreground/60 ml-1">
                <Mail className="w-4 h-4 text-primary" />
                <span>Email Address</span>
              </label>
              <Input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 sm:h-14 rounded-2xl bg-secondary/5 border-border focus-visible:ring-primary text-base sm:text-lg font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-[0.2em] flex items-center space-x-2 text-foreground/60 ml-1">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>Password</span>
                </label>
                <Link href="#" className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary hover:text-[#edae49] transition-colors">
                  Recovery?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 sm:h-14 rounded-2xl bg-secondary/5 border-border focus-visible:ring-primary text-base sm:text-lg font-medium"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 sm:h-16 rounded-2xl text-base sm:text-lg font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
            >
              {isLoading ? 'ESTABLISHING CONNECTION...' : 'SIGN IN'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {demoEmail && demoPassword ? (
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={handleDemoFill}
                  className="flex-1 h-11 sm:h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest border-border/60"
                >
                  Fill credentials
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isLoading}
                  onClick={handleDemoLogin}
                  className="flex-1 h-11 sm:h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                >
                  Instant Demo
                </Button>
              </div>
            ) : null}
          </form>

          <div className="mt-10 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60"></div>
            </div>
            <div className="relative flex justify-center text-[9px] sm:text-[10px] uppercase font-black tracking-[0.3em]">
              <span className="bg-background px-4 text-muted-foreground/60">
                Secure Social Auth
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-8">
            <Button 
              onClick={handleGoogleLogin}
              variant="outline" 
              className="h-12 sm:h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center space-x-3 border-border/60 hover:bg-secondary/5 hover:border-primary/30 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </Button>
          </div>

          <p className="mt-8 md:mt-10 text-center text-sm font-medium text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary font-black hover:text-[#edae49] transition-colors">
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
            <div className="w-16 h-1 bg-[#edae49] mb-8 rounded-full" />
            <h2 className="text-5xl lg:text-6xl font-black tracking-tight mb-8 leading-tight drop-shadow-lg uppercase">
              "The most personalized <br /> <span className="italic font-serif">travel experience</span> <br /> I've ever had."
            </h2>
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full border-2 border-[#edae49] overflow-hidden shadow-lg">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=50" alt="Testimonial" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-black text-lg">Sarah Jenkins</p>
                <p className="text-xs font-bold text-white/70 uppercase tracking-[0.2em]">Luxury Traveler, NY</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
