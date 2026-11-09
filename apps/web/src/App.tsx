import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MascotSection } from './components/MascotSection';
import { FeaturesSection } from './components/FeaturesSection';
import { InteractiveMockup } from './components/InteractiveMockup';
import { BadgesSection } from './components/BadgesSection';
import { PrivacyManifesto } from './components/PrivacyManifesto';
import { BuyMeACoffeeSection } from './components/BuyMeACoffeeSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-cream-bg flex flex-col selection:bg-pee-amber selection:text-ink">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <MascotSection />
        <FeaturesSection />
        <InteractiveMockup />
        <BadgesSection />
        <PrivacyManifesto />
        <BuyMeACoffeeSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
