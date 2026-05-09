'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { motion } from 'framer-motion';

const sections = [
  { id: 'introduction', title: '1. Introduction', content: 'Welcome to Planora.AI. We value your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.' },
  { id: 'data-collection', title: '2. Data We Collect', content: 'We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows: Identity Data, Contact Data, Financial Data, and Technical Data.' },
  { id: 'data-usage', title: '3. How We Use Your Data', content: 'We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to perform the contract we are about to enter into or have entered into with you.' },
  { id: 'data-sharing', title: '4. Disclosures of Your Data', content: 'We may share your personal data with internal third parties and external third parties such as service providers, professional advisers, and regulators.' },
  { id: 'security', title: '5. Data Security', content: 'We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way.' },
  { id: 'rights', title: '6. Your Legal Rights', content: 'Under certain circumstances, you have rights under data protection laws in relation to your personal data including the right to receive a copy of the personal data we hold about you.' },
];

const PrivacyPolicyPage = () => {
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
              <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Last Updated: May 2026</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
                PRIVACY <span className="text-primary italic font-serif">Policy</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                Our commitment to your privacy is as robust as our commitment to your luxury travel experience.
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
                      Planora.AI operates at the highest level of global data protection standards. Our systems are designed to ensure that your bespoke travel preferences remain an intimate secret between you and our AI.
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

export default PrivacyPolicyPage;
