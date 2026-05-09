import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Julianne Moore',
      role: 'Fashion Designer',
      text: 'Planora.AI completely changed how I travel. The AI understood my taste for boutique hotels and hidden galleries perfectly.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julianne',
    },
    {
      name: 'Marcus Chen',
      role: 'Tech Entrepreneur',
      text: 'Efficient, luxury, and zero stress. The itinerary generation is magic. I saved hours of planning for my Tokyo trip.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Travel Blogger',
      text: 'Finally, an AI that doesn’t just suggest the same tourist traps. Real hidden gems that made my content stand out.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    },
  ];

  return (
    <section className="py-32 bg-secondary/5 overflow-hidden border-y border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-20">
          <div className="max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4 text-foreground">
              Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">World Travelers</span>
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              See why the world's most discerning travelers trust Planora.AI for their luxury experiences.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-3 bg-background p-4 rounded-full border border-border shadow-sm">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <Star className="w-6 h-6 fill-current drop-shadow-sm" />
            </div>
            <div className="pr-4">
              <span className="text-xl font-black block text-foreground leading-none mb-1">4.9/5</span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Average Rating</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Subtle background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-primary/5 to-transparent -z-10 pointer-events-none" />

          {testimonials.map((t, i) => (
            <div key={i} className="p-8 md:p-10 rounded-[2.5rem] bg-background border border-border/60 relative group hover:border-primary/50 hover:shadow-[0_20px_60px_rgba(48,99,142,0.1)] transition-all duration-500 transform hover:-translate-y-2">
              <Quote className="absolute top-8 right-8 w-12 h-12 text-secondary/10 group-hover:text-accent/20 transition-colors duration-500" />
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 rounded-full border-[3px] border-accent/50 overflow-hidden shadow-md">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-foreground">{t.name}</h4>
                  <p className="text-xs text-secondary font-black uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
