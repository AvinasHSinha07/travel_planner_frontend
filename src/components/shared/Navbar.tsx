'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, User, Bell, Search, LogOut, LayoutDashboard, Map, Calendar, Moon, Sun, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

import { ModeToggle } from './ModeToggle';

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
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Signed out successfully');
            router.push('/');
            setIsMobileMenuOpen(false);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || 'Could not sign out');
          }
        }
      });
    } catch {
      toast.error('An unexpected error occurred during sign out');
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
          <ModeToggle />
          
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-accent transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {isPending ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              <div className="w-20 h-4 bg-muted rounded animate-pulse hidden lg:block" />
            </div>
          ) : isLoggedIn ? (
            <div className="flex items-center space-x-4">
              {/* Notification Center */}
              <Link href="/dashboard/notifications">
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/5 rounded-xl transition-all relative group"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-background ring-2 ring-accent/20 animate-pulse" />
                </button>
              </Link>

              {/* Profile Card Trigger */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-2xl border border-border/50 bg-secondary/5 hover:bg-secondary/10 hover:border-accent/30 transition-all outline-none group"
                  >
                    <div className="relative">
                      <div className="h-9 w-9 rounded-xl border-2 border-accent/20 overflow-hidden bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-sm font-black group-hover:border-accent transition-colors">
                        {session?.user?.image ? (
                          <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-accent">{session?.user?.name?.charAt(0).toUpperCase() ?? 'U'}</span>
                        )}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    </div>
                    
                    <div className="hidden lg:flex flex-col items-start leading-tight">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Traveler</span>
                      <span className="text-xs font-black text-foreground max-w-[100px] truncate">
                        {session?.user?.name?.split(' ')[0]}
                      </span>
                    </div>

                    <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-border/50 bg-background/80 backdrop-blur-xl">
                  <DropdownMenuLabel className="px-3 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-tighter text-foreground">{session?.user?.name}</span>
                      <span className="text-[10px] font-medium text-muted-foreground truncate">{session?.user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator className="opacity-50" />
                  
                  <DropdownMenuGroup className="space-y-1 mt-1">
                    <DropdownMenuItem asChild className="rounded-xl py-2.5 cursor-pointer focus:bg-accent/5">
                      <Link href="/dashboard/settings">
                        <User className="w-4 h-4 mr-3 text-muted-foreground" />
                        <span className="font-bold text-sm">Account Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl py-2.5 cursor-pointer focus:bg-accent/5">
                      <Link href="/dashboard">
                        <LayoutDashboard className="w-4 h-4 mr-3 text-muted-foreground" />
                        <span className="font-bold text-sm">Member Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl py-2.5 cursor-pointer focus:bg-accent/5">
                      <Link href="/dashboard/trips">
                        <Map className="w-4 h-4 mr-3 text-muted-foreground" />
                        <span className="font-bold text-sm">Travel Itineraries</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator className="opacity-50 my-2" />
                  
                  <DropdownMenuItem 
                    className="rounded-xl py-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5 font-black uppercase tracking-widest text-[10px]" 
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Terminate Session
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
          <ModeToggle />
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
