import React from 'react';

const Statistics = () => {
  const stats = [
    { label: 'Destinations', value: '500+' },
    { label: 'Happy Travelers', value: '25k+' },
    { label: 'AI Itineraries', value: '100k+' },
    { label: 'Verified Hotels', value: '2k+' },
  ];

  return (
    <section className="relative py-24 bg-background overflow-hidden border-y border-border/50">
      <div className="absolute inset-0 bg-primary/5 pattern-grid-lg opacity-50 mix-blend-overlay"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group p-4 md:p-6 rounded-3xl hover:bg-secondary/5 transition-colors duration-500">
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-2 md:mb-4 drop-shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </h3>
              <p className="text-muted-foreground font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase text-[10px] md:text-xs lg:text-sm group-hover:text-foreground transition-colors">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
