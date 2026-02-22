import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Skills from './components/Skills';
import About from './components/About';
import Contact from './components/Contact';
import AIChatWidget from './components/AIChatWidget';
import AdminPanel from './components/AdminPanel';
import ResumeBook from './components/ResumeBook';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';

const PortfolioContent: React.FC<{ onAdminClick: () => void }> = ({ onAdminClick }) => {
  const { isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-400 animate-pulse font-medium tracking-widest uppercase text-xs">Loading Portfolio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-gray-100 selection:bg-accent/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Education />
        <Certifications />
        <ResumeBook />
        <Contact onAdminClick={onAdminClick} />
      </main>
      <AIChatWidget />
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'portfolio' | 'admin'>('portfolio');

  return (
    <PortfolioProvider>
      {currentView === 'admin' ? (
        <AdminPanel onExit={() => setCurrentView('portfolio')} />
      ) : (
        <PortfolioContent onAdminClick={() => setCurrentView('admin')} />
      )}
    </PortfolioProvider>
  );
};

export default App;
