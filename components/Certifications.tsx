import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, ExternalLink } from 'lucide-react';
import { getDirectImageUrl } from '../utils/imageUtils';

const Certifications: React.FC = () => {
  const { certifications } = usePortfolio();

  return (
    <section id="certifications" className="py-24 bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-16">
          <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
             <Award className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-white">Licenses & Certifications</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {certifications.map((cert) => (
            <div 
              key={cert.id}
              className="bg-card border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all duration-300 flex gap-6"
            >
              <div className="w-16 h-16 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                <img 
                  src={getDirectImageUrl(cert.logo)} 
                  alt={cert.issuer} 
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-1 leading-tight">
                  {cert.name}
                </h3>
                <p className="text-neutral-300 text-sm mb-1">
                  {cert.issuer}
                </p>
                <p className="text-neutral-500 text-xs mb-4">
                  Issued {cert.issuedDate} · {cert.expiryDate ? `Expires ${cert.expiryDate}` : 'No Expiration Date'}
                </p>

                <div className="mt-auto">
                  <a 
                    href={cert.credentialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-700 rounded-full text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all"
                  >
                    Show credential <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
