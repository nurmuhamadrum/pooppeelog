import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MascotSection } from './components/MascotSection';
import { FeaturesSection } from './components/FeaturesSection';
import { InteractiveMockup } from './components/InteractiveMockup';
import { BadgesSection } from './components/BadgesSection';
import { PrivacyManifesto } from './components/PrivacyManifesto';
import { BuyMeACoffeeSection } from './components/BuyMeACoffeeSection';
import { FAQSection } from './components/FAQSection';
import { DownloadSection } from './components/DownloadSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LanguageProvider } from './i18n/LanguageContext';

/** Admin bisa diakses lewat /admin (dev server) atau #/admin (aman untuk hosting statis). */
const isAdminRoute = () =>
  window.location.pathname.replace(/\/+$/, '') === '/admin' || window.location.hash.startsWith('#/admin');

export const App: React.FC = () => {
  const [adminMode, setAdminMode] = useState(isAdminRoute);

  useEffect(() => {
    const onRouteChange = () => setAdminMode(isAdminRoute());
    window.addEventListener('hashchange', onRouteChange);
    window.addEventListener('popstate', onRouteChange);
    return () => {
      window.removeEventListener('hashchange', onRouteChange);
      window.removeEventListener('popstate', onRouteChange);
    };
  }, []);

  if (adminMode) return <AdminDashboard />;

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-dark-bg text-cream-bg flex flex-col selection:bg-pee-amber selection:text-ink">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <MascotSection />
          <FeaturesSection />
          <InteractiveMockup />
          <BadgesSection />
          <PrivacyManifesto />
          <DownloadSection />
          <BuyMeACoffeeSection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default App;
