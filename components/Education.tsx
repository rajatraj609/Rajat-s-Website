import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { GraduationCap, X, MapPin } from 'lucide-react';
import { Education as EducationType } from '../types';
import { getDirectImageUrl } from '../utils/imageUtils';

const Education: React.FC = () => {
  const { education } = usePortfolio();
  const [selectedEdu, setSelectedEdu] = useState<EducationType | null>(null);

  return (
    <section id="education" className="py-24 bg-neutral-950/50 border-t border-neutral-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
             <GraduationCap className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-white">Education</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {education.map((edu) => (
            <div 
              key={edu.id} 
              onClick={() => setSelectedEdu(edu)}
              className="p-6 bg-card border border-neutral-800 rounded-xl hover:border-accent/50 hover:bg-neutral-800/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">{edu.degree}</h3>
                    <span className="text-sm font-medium text-neutral-500 bg-neutral-900 px-2 py-1 rounded">{edu.year}</span>
                  </div>
                  <p className="text-neutral-300 text-sm font-medium">{edu.university}</p>
                  <p className="text-neutral-500 text-xs">{edu.school}</p>
                  {edu.cgpa && (
                    <p className="text-accent text-xs font-semibold mt-1">CGPA/Percentage: {edu.cgpa}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1 group-hover:text-accent transition-colors">
                View Campus & Details <span className="text-lg">→</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup with Blurred Background */}
      {selectedEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl border border-neutral-700 animate-in zoom-in-95 duration-300">
            
            {/* Background Image Layer with Blur */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${getDirectImageUrl(selectedEdu.image)})`,
                filter: 'blur(8px) brightness(0.4)',
                transform: 'scale(1.1)' // Prevent blurred edges from showing white
              }}
            />
            
            {/* Content Layer */}
            <div className="relative z-10 p-8 md:p-12">
              <button 
                onClick={() => setSelectedEdu(null)}
                className="absolute right-4 top-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/80 hover:text-white transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col h-full justify-between space-y-6">
                <div>
                   <span className="inline-block px-3 py-1 bg-accent/90 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 shadow-lg">
                      {selectedEdu.year}
                   </span>
                   <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg leading-tight">
                     {selectedEdu.degree}
                   </h3>
                   <div className="flex flex-col gap-1 text-white/90 text-lg font-medium drop-shadow-md">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {selectedEdu.university}
                      </div>
                      <div className="text-sm text-white/70 ml-7">
                        {selectedEdu.school}
                      </div>
                   </div>
                </div>
                
                <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10">
                  <h4 className="text-sm font-bold text-neutral-300 uppercase tracking-wide mb-3 border-b border-white/10 pb-2">Academic Highlights</h4>
                  <p className="text-white leading-relaxed text-base">
                    {selectedEdu.details}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default Education;
