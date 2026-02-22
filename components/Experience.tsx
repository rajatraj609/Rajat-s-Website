import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase } from 'lucide-react';
import { getDirectImageUrl } from '../utils/imageUtils';

const Experience: React.FC = () => {
  const { experiences } = usePortfolio();

  return (
    <section id="experience" className="py-24 bg-dark">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-16">
          <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
             <Briefcase className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-white">Work Experience</h2>
        </div>

        <div className="relative border-l border-neutral-800 ml-3 md:ml-6 space-y-12">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-8 md:pl-12 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-neutral-600 group-hover:bg-accent transition-colors ring-4 ring-dark" />
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  {exp.companyLogo && (
                    <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden flex-shrink-0">
                      <img 
                        src={getDirectImageUrl(exp.companyLogo)} 
                        alt={exp.company} 
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
                      {exp.role}
                    </h3>
                    <div className="text-neutral-300 font-medium">
                      {exp.company}
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium text-neutral-500 tabular-nums">
                  {exp.period}
                </span>
              </div>

              <ul className="space-y-3">
                {exp.description.map((item, i) => (
                  <li key={i} className="text-neutral-400 text-sm leading-relaxed flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-neutral-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
