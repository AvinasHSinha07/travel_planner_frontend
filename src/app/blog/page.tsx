'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';

const posts = [
  {
    slug: 'ai-trip-planning',
    title: 'How AI Is Reshaping Luxury Trip Planning',
    excerpt:
      'From preference-aware routing to real-time disruption handling, see what makes modern planners different.',
    date: 'March 2026',
    readTime: '6 min',
  },
  {
    slug: 'hidden-gems-europe',
    title: 'Five Underrated European Cities for 2026',
    excerpt:
      'Skip the obvious capitals—these destinations pair culture, cuisine, and calm without the crowds.',
    date: 'February 2026',
    readTime: '8 min',
  },
  {
    slug: 'sustainable-travel',
    title: 'Travel Better: Practical Steps Toward Lower-Impact Journeys',
    excerpt:
      'Small choices—lodging, ground transport, and length of stay—compound into meaningful change.',
    date: 'January 2026',
    readTime: '5 min',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-40 pb-24 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-16"
        >
          <div className="flex items-center space-x-3 mb-6 text-primary">
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Travel journal</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6">
            STORIES & <span className="text-primary italic font-serif">insights</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            Curated articles on destinations, planning strategy, and the technology behind TRIPLANNERAI.
          </p>
        </motion.div>

        <div className="grid gap-10 max-w-4xl">
          {posts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group p-10 rounded-[2rem] border border-border/60 bg-card hover:border-primary/30 hover:shadow-xl transition-all"
            >
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
                <span>{post.readTime} read</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground font-medium leading-relaxed mb-6">{post.excerpt}</p>
              <Link
                href="/contact"
                className="inline-flex items-center text-sm font-black uppercase tracking-widest text-primary hover:text-accent"
              >
                Discuss this story
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
