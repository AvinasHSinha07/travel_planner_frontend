import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import DestinationsGrid from '@/components/destinations/DestinationsGrid';

export const metadata = {
  title: 'Explore Destinations | Planora.AI',
  description: 'Discover hand-picked luxury destinations, unique cultural experiences, and hidden gems across the globe.',
};

const DestinationsPage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <DestinationsGrid />
      <Footer />
    </main>
  );
};

export default DestinationsPage;
