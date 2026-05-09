'use client';

import React, { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Thanks — our concierge team will reach out shortly.');
      setName('');
      setEmail('');
      setMessage('');
    }, 800);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-40 pb-24 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
              Concierge
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
              LET&apos;S PLAN <br />
              <span className="text-primary italic font-serif">your next trip</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-12">
              Partnerships, press, enterprise travel, or bespoke itineraries—send a note and we&apos;ll route it to
              the right team.
            </p>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email</p>
                  <a href="mailto:hello@triplanner.ai" className="font-bold text-foreground hover:text-primary">
                    hello@triplanner.ai
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone</p>
                  <span className="font-bold text-foreground">+1 (555) 014-2200</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Studio</p>
                  <span className="font-bold text-foreground">New York · Remote-first globally</span>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 md:p-12 rounded-[2.5rem] border border-border/60 bg-card shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 rounded-xl"
                  placeholder="Alex Morgan"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-xl"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Message</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[160px] rounded-xl resize-none"
                  placeholder="Tell us about your trip goals, dates, and travelers…"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl font-black uppercase text-xs tracking-widest"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
