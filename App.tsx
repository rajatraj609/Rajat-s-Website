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
import { PortfolioProvider } from './context/PortfolioContext';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'portfolio' | 'admin'>('portfolio');

  return (
    <PortfolioProvider>
      {currentView === 'admin' ? (
        <AdminPanel onExit={() => setCurrentView('portfolio')} />
      ) : (
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
            <Contact onAdminClick={() => setCurrentView('admin')} />
          </main>
          <AIChatWidget />
        </div>
      )}
    </PortfolioProvider>
  );
};

export default App;
