import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Linkedin, Shield } from 'lucide-react';

interface ContactProps {
  onAdminClick: () => void;
}

const Contact: React.FC<ContactProps> = ({ onAdminClick }) => {
  const { contactInfo } = usePortfolio();

  return (
    <section id="contact" className="py-24 bg-dark">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Let's work together</h2>
        <p className="text-neutral-400 mb-12 max-w-xl mx-auto">
          I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>

        <a 
          href={`mailto:${contactInfo.emailPersonal}`}
          className="inline-block px-8 py-4 bg-accent text-white font-semibold rounded-full hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/25 mb-16"
        >
          Say Hello
        </a>

        <div className="flex justify-center gap-8">
           {contactInfo.linkedin && contactInfo.linkedin !== '#' && (
              <a 
                href={contactInfo.linkedin.startsWith('http') ? contactInfo.linkedin : `https://${contactInfo.linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-neutral-500 hover:text-white transition-colors transform hover:-translate-y-1"
              >
                <Linkedin className="w-5 h-5" />
              </a>
           )}
        </div>

        <div className="mt-24 pt-8 border-t border-neutral-900 flex flex-col items-center gap-4 text-neutral-600 text-sm">
          <p>© {new Date().getFullYear()} Rajat. Built with React & Tailwind.</p>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onAdminClick();
            }}
            className="flex items-center gap-2 text-neutral-500 hover:text-accent transition-colors text-xs font-medium px-3 py-1 rounded-full border border-neutral-900 hover:border-neutral-800 bg-neutral-900/50 cursor-pointer"
          >
             <Shield className="w-3 h-3" /> Admin Login
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;