import React from 'react';
import Link from 'next/link';
import { Globe, Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Destinations', href: '/destinations' },
        { name: 'AI Planner', href: '/ai-planner' },
        { name: 'Group Trips', href: '/group-trips' },
        { name: 'Luxury Stays', href: '/stays' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Travel Guides', href: '/guides' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/support' },
        { name: 'Safety', href: '/safety' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
      ],
    },
  ];

  return (
    <footer className="bg-[#002b42] text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#edae49]/30 to-transparent" />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-8 group">
              <div className="w-12 h-12 bg-[#edae49] rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-[#edae49]/20">
                <Globe className="text-[#003d5b] w-7 h-7" />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white uppercase">
                TRIPLANNER<span className="text-[#edae49]">AI</span>
              </span>
            </Link>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-sm font-medium">
              Experience the absolute pinnacle of travel. TRIPLANNERAI leverages state-of-the-art artificial intelligence to craft bespoke, high-end travel experiences tailored to your soul.
            </p>
            <div className="flex items-center space-x-5">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-[#edae49] hover:text-[#003d5b] hover:border-[#edae49] hover:-translate-y-1 transition-all duration-300 shadow-lg"
                >
                  <Icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-black text-[#edae49] uppercase tracking-[0.2em] mb-8">
                {column.title}
              </h4>
              <ul className="space-y-5">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-white transition-colors font-medium text-base"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-[1px] bg-white/5 w-full mb-12" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-white/40 font-medium">
          <p>© {currentYear} TRIPLANNERAI Global Concierge. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center space-x-2 group cursor-pointer hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-[#edae49]" />
              <span>concierge@planora.ai</span>
            </div>
            <div className="flex items-center space-x-2 group cursor-pointer hover:text-white transition-colors">
              <Globe className="w-4 h-4 text-[#edae49]" />
              <span>English (United Kingdom)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
