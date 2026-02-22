import React, { useState } from 'react';
import { ArrowRight, Download, X, Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { getDirectImageUrl } from '../utils/imageUtils';

const Hero: React.FC = () => {
  const { aboutMe, heroImage, hireStatus, resumeBookData, contactInfo } = usePortfolio();
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <section id="about" className="min-h-screen flex items-center pt-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-in slide-in-from-left duration-700 fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium uppercase tracking-wider">
            {hireStatus}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
            Hi There, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              I'm Rajat.
            </span>
          </h1>
          
          <p className="text-lg text-neutral-400 leading-relaxed max-w-xl">
            {aboutMe}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
            >
              Contact Me <ArrowRight className="w-4 h-4" />
            </button>
            <a 
              href={resumeBookData.cvLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-neutral-700 text-white font-medium rounded-full hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
            >
              Download CV <Download className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Abstract Visual */}
        <div className="relative h-full flex justify-center items-center md:justify-end animate-in zoom-in duration-700 fade-in delay-200">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative w-full h-full bg-neutral-900 border border-neutral-800 rounded-2xl rotate-6 hover:rotate-0 transition-transform duration-500 overflow-hidden shadow-2xl">
               <img 
                 src={getDirectImageUrl(heroImage)} 
                 alt="Rajat Workspace" 
                 className="w-full h-full object-cover opacity-80"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Popup Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card border border-neutral-800 rounded-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-300 shadow-2xl">
             <button 
               onClick={() => setIsContactOpen(false)}
               className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
             >
               <X className="w-5 h-5" />
             </button>
             
             <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
             
             <div className="space-y-6">
                <div className="space-y-3">
                   <h4 className="text-sm font-semibold text-accent uppercase tracking-wide">Emails</h4>
                   <div className="space-y-2">
                      <div className="flex items-center gap-3 text-neutral-300">
                         <Mail className="w-4 h-4 text-neutral-500" />
                         <span className="text-sm">Personal: <a href={`mailto:${contactInfo.emailPersonal}`} className="hover:text-white transition-colors">{contactInfo.emailPersonal}</a></span>
                      </div>
                      <div className="flex items-center gap-3 text-neutral-300">
                         <Mail className="w-4 h-4 text-neutral-500" />
                         <span className="text-sm">Work: <a href={`mailto:${contactInfo.emailWork}`} className="hover:text-white transition-colors">{contactInfo.emailWork}</a></span>
                      </div>
                      <div className="flex items-center gap-3 text-neutral-300">
                         <Mail className="w-4 h-4 text-neutral-500" />
                         <span className="text-sm">College: <a href={`mailto:${contactInfo.emailCollege}`} className="hover:text-white transition-colors">{contactInfo.emailCollege}</a></span>
                      </div>
                   </div>
                </div>

                <div className="space-y-3">
                   <h4 className="text-sm font-semibold text-accent uppercase tracking-wide">Details</h4>
                   <div className="space-y-2">
                       <div className="flex items-center gap-3 text-neutral-300">
                           <Phone className="w-4 h-4 text-neutral-500" />
                           <span className="text-sm">{contactInfo.phone}</span>
                       </div>
                       <div className="flex items-center gap-3 text-neutral-300">
                           <MapPin className="w-4 h-4 text-neutral-500" />
                           <span className="text-sm">{contactInfo.location}</span>
                       </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-neutral-800 flex justify-center gap-6">
                   {contactInfo.linkedin && (
                     <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all">
                       <Linkedin className="w-5 h-5" />
                     </a>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;