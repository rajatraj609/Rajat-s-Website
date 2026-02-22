import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Layers } from 'lucide-react';

const Skills: React.FC = () => {
  const { skills } = usePortfolio();

  return (
    <section className="py-24 border-y border-neutral-900 bg-neutral-950/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-16">
          <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
             <Layers className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-white">Technical Skills</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((group) => (
            <div key={group.category} className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-neutral-800 pb-2">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <div 
                    key={skill}
                    className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-300 text-sm rounded-lg hover:border-accent/50 hover:bg-accent/5 transition-colors cursor-default"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
