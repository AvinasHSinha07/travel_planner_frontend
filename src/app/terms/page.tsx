'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { motion } from 'framer-motion';

const sections = [
  { id: 'acceptance', title: '1. Acceptance', content: 'By accessing and using Planora.AI, you accept and agree to be bound by the terms and provision of this agreement.' },
  { id: 'usage', title: '2. Usage License', content: 'Permission is granted to temporarily download one copy of the materials on Planora.AI\'s website for personal, non-commercial transitory viewing only.' },
  { id: 'disclaimer', title: '3. Disclaimer', content: 'The materials on Planora.AI\'s website are provided on an "as is" basis. Planora.AI makes no warranties, expressed or implied, and hereby disclaims all other warranties.' },
  { id: 'limitations', title: '4. Limitations', content: 'In no event shall Planora.AI or its suppliers be liable for any damages arising out of the use or inability to use the materials on Planora.AI\'s website.' },
  { id: 'revisions', title: '5. Revisions', content: 'The materials appearing on Planora.AI\'s website could include technical, typographical, or photographic errors. Planora.AI does not warrant that any of the materials are accurate.' },
  { id: 'governing-law', title: '6. Governing Law', content: 'These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Planora.AI operates.' },
];

const TermsOfServicePage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-44 pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-20"
            >
              <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Effective Date: May 2026</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
                TERMS OF <span className="text-primary italic font-serif">Service</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                The agreement between you and Planora.AI for the pursuit of extraordinary travel experiences.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Sidebar Navigation */}
              <div className="hidden lg:block lg:col-span-3">
                <div className="sticky top-40 space-y-4">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors py-2 border-l-2 border-transparent hover:border-primary pl-4"
                    >
                      {section.title.split('. ')[1]}
                    </a>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-9 space-y-20">
                {sections.map((section) => (
                  <div key={section.id} id={section.id} className="scroll-mt-44">
                    <h2 className="text-2xl font-black mb-8 pb-4 border-b border-border/50">{section.title}</h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                      {section.content}
                    </p>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed mt-6">
                      By utilizing the AI Travel Planner services, you agree to engage with our artificial intelligence concierge in a manner that respects global travel ethics and local cultural standards.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TermsOfServicePage;
