import React, { useRef, useState, useEffect, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { usePortfolio } from '../context/PortfolioContext';
import { Experience, Education, Skill, Certification } from '../types';
import { 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Briefcase, 
  Code, 
  GraduationCap,
  Mail,
  Star,
  Download
} from 'lucide-react';

// --- Types & Props ---

interface PageProps {
  children?: React.ReactNode;
  number?: number;
  className?: string;
  isCover?: boolean; // True for outer covers
  isInnerCover?: boolean; // True for the "back" of the cover (inverted)
  position?: 'left' | 'right'; // For spine shadow logic
}

// --- styled-components via Tailwind classes ---

const THEME_COLOR = "bg-[#1e1b4b]"; // Deep Indigo/Navy (indigo-950)
const THEME_TEXT = "text-indigo-100";

// --- Components ---

// Standard Paper Page
const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  // Spine shadow logic: 
  // Left pages need shadow on the RIGHT edge.
  // Right pages need shadow on the LEFT edge.
  const shadowClass = props.position === 'left' 
    ? 'shadow-[inset_-12px_0_20px_-10px_rgba(0,0,0,0.2)]' // Shadow on Right
    : 'shadow-[inset_12px_0_20px_-10px_rgba(0,0,0,0.2)]'; // Shadow on Left

  return (
    <div 
      className={`relative bg-[#fdfbf7] h-full overflow-hidden ${props.className || ''}`} 
      ref={ref} 
      data-density="soft"
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
      
      {/* Spine Shadow */}
      <div className={`absolute inset-0 pointer-events-none z-20 ${shadowClass}`}></div>

      {/* Content Container */}
      <div className="h-full w-full p-4 md:p-6 pb-10 flex flex-col relative z-10 overflow-y-auto custom-scrollbar">
        {props.children}
      </div>
      
      {/* Page Number */}
      {props.number && (
        <div className="absolute bottom-6 w-full text-center text-[10px] text-neutral-400 font-serif tracking-widest z-10">
          - {props.number} -
        </div>
      )}
    </div>
  );
});

Page.displayName = 'Page';

// Hard Cover Component
const Cover = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  const isInner = props.isInnerCover;

  return (
    <div 
      className={`${THEME_COLOR} ${THEME_TEXT} h-full relative overflow-hidden`} 
      ref={ref} 
      data-density="hard"
    >
      {/* If Inner Cover: Mirror the entire content horizontally */}
      <div className={`h-full w-full transition-transform ${isInner ? 'scale-x-[-1]' : ''}`}>
        
        {/* Leather/Texture Effect */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] mix-blend-overlay pointer-events-none"></div>
        
        {/* Inner Cover Overlay: Makes it look like the 'back' of the material */}
        {isInner && <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none"></div>}

        {/* Cover Design (Logo, Title, etc) */}
        <div className="h-full w-full p-10 flex flex-col items-center justify-center relative z-10">
            {/* Border Decoration */}
            <div className="absolute inset-4 border-2 border-[#fbbf24]/20 rounded-sm pointer-events-none"></div>
            <div className="absolute inset-6 border border-[#fbbf24]/10 rounded-sm pointer-events-none"></div>

            {props.children}
        </div>
      </div>
    </div>
  );
});

Cover.displayName = 'Cover';


// --- Main Resume Book Component ---

const ResumeBook: React.FC = () => {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileWidth, setMobileWidth] = useState(300); // Default to a safe minWidth
  const { aboutMe, experiences, skills, education, certifications, resumeBookData } = usePortfolio();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        const calculatedWidth = Math.max(250, Math.min(window.innerWidth - 40, 400));
        setMobileWidth(calculatedWidth);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onFlip = (e: { data: number }) => {
    setCurrentPage(e.data);
  };

  const nextFlip = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  const prevFlip = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };

  // Dimensions
  const width = 450;
  const height = 600;

  // Helper to chunk arrays for pagination
  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    if (!arr || arr.length === 0) return [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  // Generate dynamic pages
  const renderPages = () => {
    const pages: React.ReactNode[] = [];
    let pageNum = 1;

    // 1. Profile Page
    pages.push(
      <Page key="profile" number={pageNum++} position="right">
        <div className="border-b-2 border-neutral-100 pb-4 mb-6">
            <h3 className="text-xl font-serif font-bold text-neutral-800 flex items-center gap-2 uppercase tracking-wide">
                Profile
            </h3>
        </div>
        <div className="prose prose-sm prose-neutral leading-relaxed text-neutral-600 font-serif text-justify">
           <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-neutral-900 first-letter:float-left first-letter:mr-3 first-letter:font-serif">
             {aboutMe}
           </p>
        </div>
        <div className="mt-auto flex justify-center opacity-30">
            <Star className="w-4 h-4 text-neutral-400" />
        </div>
      </Page>
    );

    // 2. Experience Pages - One page per experience
    experiences.forEach((exp, idx) => {
      pages.push(
        <Page key={`exp-${idx}`} number={pageNum++} position={pageNum % 2 === 0 ? 'left' : 'right'}>
          <div className="border-b-2 border-neutral-100 pb-4 mb-6">
              <h3 className="text-xl font-serif font-bold text-neutral-800 uppercase tracking-wide">
                  {idx === 0 ? 'Experience' : 'Experience (Cont.)'}
              </h3>
          </div>
          <div className="space-y-4">
            <div className="relative">
               <h4 className="font-bold text-neutral-900 text-sm md:text-base leading-tight">{exp.role}</h4>
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-2 mt-1 gap-1">
                   <span className="text-xs font-semibold text-indigo-600">{exp.company}</span>
                   <span className="text-[9px] text-neutral-400 font-medium uppercase">{exp.period}</span>
               </div>
               <ul className="text-[10px] md:text-[11px] text-neutral-600 leading-relaxed font-serif list-disc ml-4 space-y-1.5">
                 {exp.description.map((desc, dIdx) => (
                   <li key={dIdx}>{desc}</li>
                 ))}
               </ul>
            </div>
          </div>
        </Page>
      );
    });

    // 3. Education Page - All in one page
    pages.push(
      <Page key="edu-single" number={pageNum++} position={pageNum % 2 === 0 ? 'left' : 'right'}>
        <div className="border-b-2 border-neutral-100 pb-4 mb-6">
            <h3 className="text-xl font-serif font-bold text-neutral-800 uppercase tracking-wide">Education</h3>
        </div>
        <div className="space-y-8">
           {education.map((edu: Education, i) => (
             <div key={i} className="relative">
                <div className="font-bold text-neutral-800 text-sm md:text-base">{edu.degree}</div>
                <div className="text-xs text-indigo-600 font-semibold mb-1">{edu.university}</div>
                <div className="text-[11px] text-neutral-500 font-medium">{edu.school}</div>
                <div className="text-[10px] text-neutral-400 italic mb-2">{edu.year}</div>
                {edu.cgpa && (
                  <div className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded border border-indigo-100">
                    CGPA: {edu.cgpa}
                  </div>
                )}
             </div>
           ))}
           {education.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full opacity-10 italic text-sm">
                <GraduationCap className="w-12 h-12 mb-4" />
                <p>No Education Listed</p>
             </div>
           )}
        </div>
      </Page>
    );

    // 4. Skills Page - All in one page
    pages.push(
      <Page key="skills-single" number={pageNum++} position={pageNum % 2 === 0 ? 'left' : 'right'}>
        <div className="border-b-2 border-neutral-100 pb-4 mb-6">
            <h3 className="text-xl font-serif font-bold text-neutral-800 uppercase tracking-wide">Technical Skills</h3>
        </div>
        <div className="space-y-8">
           {skills.map((skillGroup: Skill, i) => (
             <div key={i}>
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase mb-3 tracking-widest">{skillGroup.category}</h4>
                <div className="flex flex-wrap gap-2">
                   {skillGroup.items.map(s => (
                     <span key={s} className="px-2 py-1 bg-white text-neutral-700 text-[10px] font-bold uppercase tracking-wide rounded border border-neutral-200 shadow-sm">
                       {s}
                     </span>
                   ))}
                </div>
             </div>
           ))}
           {skills.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full opacity-10 italic text-sm">
                <Code className="w-12 h-12 mb-4" />
                <p>No Skills Listed</p>
             </div>
           )}
        </div>
      </Page>
    );

    // 5. Certification Page - All in one page
    pages.push(
      <Page key="certs-single" number={pageNum++} position={pageNum % 2 === 0 ? 'left' : 'right'}>
        <div className="border-b-2 border-neutral-100 pb-4 mb-6">
            <h3 className="text-xl font-serif font-bold text-neutral-800 uppercase tracking-wide">Certifications</h3>
        </div>
        <div className="space-y-6">
           {certifications.map((cert: Certification, cIdx) => (
             <div key={cIdx} className="relative">
                <div className="font-bold text-neutral-800 text-sm">{cert.name}</div>
                <div className="text-xs text-indigo-600 font-semibold">{cert.issuer}</div>
                <div className="text-[10px] text-neutral-400 italic">{cert.issuedDate}</div>
             </div>
           ))}
           {certifications.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full opacity-10 italic text-sm">
                <Star className="w-12 h-12 mb-4" />
                <p>No Certifications Listed</p>
             </div>
           )}
        </div>
      </Page>
    );

    // 6. Thank You Page - Final white paper page
    pages.push(
      <Page key="thank-you" number={pageNum++} position={pageNum % 2 === 0 ? 'left' : 'right'}>
        <div className="h-full w-full flex flex-col items-center justify-center px-4">
          <div className="flex items-center justify-center w-full">
            {/* Left Decorative line */}
            <div className="h-px bg-neutral-300 flex-1"></div>
            
            {/* Calligraphy Thank You */}
            <h2 className="font-calligraphy text-5xl md:text-6xl text-neutral-800 px-4 whitespace-nowrap select-none">
              thank you
            </h2>

            {/* Right Decorative line */}
            <div className="h-px bg-neutral-300 flex-1"></div>
          </div>
        </div>
      </Page>
    );

    // Ensure even number of pages for spread (excluding covers)
    if (pages.length % 2 !== 0) {
      pages.push(
        <Page key="blank-spacer" number={pageNum++} position={pageNum % 2 === 0 ? 'left' : 'right'}>
          <div className="flex items-center justify-center h-full opacity-10">
             <Star className="w-8 h-8" />
          </div>
        </Page>
      );
    }

    return pages;
  };

  return (
    <section id="flipbook" className="py-24 bg-neutral-900 overflow-hidden flex flex-col items-center justify-center min-h-screen perspective-[2000px]">
      
      {/* Header */}
      <div className="mb-10 text-center space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">My Flipbook</h2>
          <p className="text-neutral-400 text-sm">Flip the pages to explore</p>
      </div>

      {/* Book Wrapper with heavy shadow to ground it */}
      <div className="relative shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)] max-w-[100vw]">
        {/* @ts-ignore - react-pageflip types workaround */}
        <HTMLFlipBook
          key={isMobile ? `mobile-${mobileWidth}` : 'desktop'}
          width={isMobile ? mobileWidth : width}
          height={isMobile ? Math.floor(mobileWidth * 1.4) : height}
          size={isMobile ? "fixed" : "stretch"}
          minWidth={isMobile ? mobileWidth : 300}
          maxWidth={1000}
          minHeight={isMobile ? Math.floor(mobileWidth * 1.4) : 400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          onInit={({ object }: any) => setTotalPages(object.pages.length)}
          className="bg-transparent"
          style={{ margin: '0 auto' }}
          ref={bookRef}
          usePortrait={isMobile}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          swipeDistance={30}
          useMouseEvents={!isMobile}
          clickEventForward={!isMobile}
        >
          {/* --- 1. FRONT COVER (Right when closed) --- */}
          <Cover isCover>
            <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-sm mb-8 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] border border-white/10">
               <User className="w-12 h-12 text-[#fbbf24]" />
            </div>
            
            <div className="w-full flex flex-col items-center justify-center text-center px-4">
                 <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-[0.2em] text-white drop-shadow-lg uppercase break-words mb-6">
                    {resumeBookData.coverTitle}
                 </h1>
                 
                 <div className="h-0.5 w-24 bg-[#fbbf24] mb-6 shadow-[0_0_10px_#fbbf24]"></div>

                 <p className="text-[#fbbf24] text-sm md:text-base tracking-[0.2em] uppercase whitespace-nowrap">
                    {resumeBookData.coverSubtitle}
                 </p>
            </div>
            
            <div className="mt-auto text-center opacity-60 text-xs font-serif tracking-widest uppercase">
                {resumeBookData.coverBottomText}
            </div>
          </Cover>

          {/* --- 2. INNER FRONT COVER (Left when open) --- */}
          <Cover isInnerCover>
             <div className="text-center opacity-20">
                <p className="text-xs uppercase tracking-[0.3em]">Portfolio Edition 2026</p>
             </div>
          </Cover>

          {/* Dynamic Content Pages */}
          {renderPages()}

          {/* --- INNER BACK COVER (Right when open) --- */}
          <Cover isInnerCover>
              <div className="text-center opacity-20">
                <p className="text-xs uppercase tracking-[0.3em]">Thank You</p>
              </div>
          </Cover>

          {/* --- BACK COVER (Left when closed) --- */}
          <Cover isCover>
       <div className="h-full flex flex-col items-center justify-center">
           <div className="w-16 h-16 bg-[#fbbf24] rounded-full flex items-center justify-center mb-6 text-[#1e1b4b]">
               <span className="text-2xl font-bold font-serif">R</span>
           </div>
           
           <a 
             href={resumeBookData.cvLink || '#'}
             target="_blank"
             rel="noopener noreferrer"
             className="group flex items-center gap-3 px-6 py-3 border border-[#fbbf24] rounded-full text-[#fbbf24] hover:bg-[#fbbf24] hover:text-[#1e1b4b] transition-all font-serif tracking-widest text-sm uppercase"
           >
              Download CV
              <Download className="w-4 h-4 group-hover:animate-bounce" />
           </a>
       </div>
    </Cover>

        </HTMLFlipBook>
      </div>

      {/* External Navigation Controls */}
      <div className="flex items-center gap-8 mt-12 z-10">
        <button 
          onClick={prevFlip}
          className="p-4 rounded-full bg-neutral-800 text-white hover:bg-indigo-600 hover:scale-110 transition-all border border-neutral-700 shadow-xl group"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        
        <div className="text-neutral-500 text-xs font-medium tracking-widest uppercase">
            {currentPage === 0 ? "Cover" : currentPage === totalPages - 1 ? "Back" : `Page ${currentPage} / ${totalPages}`}
        </div>

        <button 
          onClick={nextFlip}
          className="p-4 rounded-full bg-neutral-800 text-white hover:bg-indigo-600 hover:scale-110 transition-all border border-neutral-700 shadow-xl group"
           aria-label="Next Page"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </section>
  );
};

export default ResumeBook;