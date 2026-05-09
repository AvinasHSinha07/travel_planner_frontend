'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, User, Bell, Search, LogOut, LayoutDashboard, Map, Calendar, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const publicNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const authenticatedNavLinks = [
  { name: 'Destinations', href: '/destinations' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'My Trips', href: '/dashboard/trips' },
  { name: 'Bookings', href: '/dashboard/bookings' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme } = useTheme();
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = isLoggedIn ? authenticatedNavLinks : publicNavLinks;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success('Signed out');
      router.push('/');
      setIsMobileMenuOpen(false);
    } catch {
      toast.error('Could not sign out');
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b',
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-border py-3'
          : 'bg-transparent border-transparent py-5'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group shrink-0">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-md">
            <Globe className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground uppercase hidden sm:inline">
            TRIPLANNER<span className="text-accent">AI</span>
          </span>
        </Link>

        <div className="hidden xl:flex items-center gap-6 flex-wrap justify-end max-w-4xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors duration-200 relative group uppercase tracking-wider"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-3 shrink-0">
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-accent transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {isPending ? (
            <div className="w-24 h-10 rounded-full bg-muted/30 animate-pulse" />
          ) : isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Link href="/dashboard/notifications">
                <button
                  type="button"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                </button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border hover:bg-secondary/30 transition-colors outline-none"
                  >
                    <div className="h-9 w-9 rounded-full border-2 border-accent overflow-hidden bg-muted flex items-center justify-center text-sm font-black">
                      {session?.user?.name?.charAt(0).toUpperCase() ?? 'U'}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wide max-w-[120px] truncate hidden lg:inline">
                      {session?.user?.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel className="font-bold truncate">{session?.user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Profile & settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/trips" className="cursor-pointer">
                      <Map className="w-4 h-4 mr-2" />
                      My trips
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/bookings" className="cursor-pointer">
                      <Calendar className="w-4 h-4 mr-2" />
                      Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setTheme('system')}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    System
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" className="font-bold hover:text-accent hover:bg-transparent text-sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="font-bold rounded-full px-5 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg text-sm">
                  Join
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground hover:text-accent transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-3xl border-b border-border shadow-2xl overflow-hidden"
          >
            <div className="p-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-black text-foreground hover:text-accent transition-colors tracking-wide"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-[1px] bg-border/50 w-full" />
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard/settings" onClick={() => setIsMobileMenuOpen(false)} className="font-bold">
                    Profile & settings
                  </Link>
                  <button type="button" onClick={handleLogout} className="text-left font-bold text-destructive">
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-2xl py-6 border-border font-bold">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full rounded-2xl py-6 font-bold bg-primary text-primary-foreground">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
