import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { User } from 'lucide-react';

const About: React.FC = () => {
  const { detailedBio } = usePortfolio();

  return (
    <section id="about-details" className="py-20 bg-dark border-t border-neutral-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
             <User className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-white">About Me</h2>
        </div>
        
        <div className="prose prose-invert prose-lg max-w-none text-neutral-300 whitespace-pre-line leading-relaxed">
          {detailedBio}
        </div>
      </div>
    </section>
  );
};

export default About;
