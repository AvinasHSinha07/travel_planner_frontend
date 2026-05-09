import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      q: 'How does the AI generate my itinerary?',
      a: 'Our proprietary AI engine analyzes thousands of destinations, reviews, and your personal preferences to architect a logical, day-by-day plan including travel times, booking links, and activity suggestions.',
    },
    {
      q: 'Can I modify the AI-generated plans?',
      a: 'Absolutely! The AI provides a foundation. You can add, remove, or swap activities, and the AI will automatically recalculate your travel logistics and timing.',
    },
    {
      q: 'Is there a limit to how many trips I can plan?',
      a: 'Our free tier allows for 3 active trip plans. Premium members enjoy unlimited planning, real-time alerts, and dedicated concierge support.',
    },
    {
      q: 'Does Planora handle flight and hotel bookings?',
      a: 'We provide direct booking links to our verified partners (Expedia, Booking.com, etc.) and handle the checkout process seamlessly through our secure Stripe integration.',
    },
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6 text-foreground">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground font-medium">
            Everything you need to know about the future of travel planning.
          </p>
        </div>

        <Accordion className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-border/50 bg-background hover:border-primary/30 px-6 sm:px-8 py-2 rounded-3xl transition-all duration-300 mb-4 shadow-sm hover:shadow-[0_10px_40px_rgba(48,99,142,0.05)]">
              <AccordionTrigger className="text-left font-bold text-xl py-6 hover:no-underline text-foreground">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-medium leading-relaxed pb-6 text-lg">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
