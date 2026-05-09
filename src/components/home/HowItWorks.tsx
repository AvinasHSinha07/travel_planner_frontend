import React from 'react';
import { MousePointer2, BrainCircuit, CalendarCheck } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Pick Your Destination',
      desc: 'Choose from 500+ hand-picked luxury destinations across 80 countries.',
      icon: <MousePointer2 className="w-10 h-10 text-primary" />,
      number: '01'
    },
    {
      title: 'AI Architecting',
      desc: 'Our AI analyzes your style to craft a bespoke day-by-day itinerary.',
      icon: <BrainCircuit className="w-10 h-10 text-accent" />,
      number: '02'
    },
    {
      title: 'Pack and Go',
      desc: 'Secure your bookings and enjoy a perfectly organized luxury experience.',
      icon: <CalendarCheck className="w-10 h-10 text-destructive" />,
      number: '03'
    },
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-secondary/5 rounded-[100%] blur-[100px] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h2 className="text-5xl lg:text-6xl font-black tracking-tight mb-6 text-foreground">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">TRIPLANNERAI</span> Works
          </h2>
          <p className="text-xl text-muted-foreground font-medium">
            Three simple steps to the most organized trip of your life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-primary/10 via-accent/30 to-destructive/10 z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-background border-[4px] border-border flex items-center justify-center mb-8 relative group-hover:border-accent group-hover:shadow-[0_0_40px_rgba(237,174,73,0.3)] transition-all duration-500 transform group-hover:-translate-y-2">
                <span className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-black text-sm shadow-xl">
                  {step.number}
                </span>
                {step.icon}
              </div>
              <h3 className="text-3xl font-bold mb-4 text-foreground">{step.title}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
