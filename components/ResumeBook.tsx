import React, { useRef, useState, useEffect, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { usePortfolio } from '../context/PortfolioContext';
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
      <div className="h-full w-full p-4 md:p-8 pb-14 flex flex-col relative z-10 overflow-y-auto scrollbar-hide">
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
  const [mobileWidth, setMobileWidth] = useState(320);
  const { aboutMe, experiences, skills, education, resumeBookData } = usePortfolio();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        // Leave some margin for the screen edges
        setMobileWidth(Math.min(window.innerWidth - 40, 400));
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

  // Split experiences to fit pages nicely
  const expPage1 = experiences.slice(0, 2);
  const expPage2 = experiences.slice(2, 4);

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
          key={isMobile ? 'mobile' : 'desktop'}
          width={isMobile ? mobileWidth : width}
          height={isMobile ? Math.floor(mobileWidth * 1.5) : height}
          size={isMobile ? "fixed" : "stretch"}
          minWidth={isMobile ? 250 : 300}
          maxWidth={1000}
          minHeight={isMobile ? 350 : 400}
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
            
            {/* Title, Separator Line, Subtitle */}
            <div className="w-full flex flex-col items-center justify-center text-center px-4">
                 <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-[0.2em] text-white drop-shadow-lg uppercase break-words mb-6">
                    {resumeBookData.coverTitle}
                 </h1>
                 
                 {/* Separator Line */}
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
          {/* This mirrors the front cover to look like the back of the hard shell, but is now blank */}
          <Cover isInnerCover>
             {/* Blank content, only border from Cover component remains */}
          </Cover>

          {/* --- 3. PAGE 1: INTRODUCTION (Right) --- */}
          <Page number={1} position="right">
            <div className="border-b-2 border-neutral-100 pb-4 mb-6">
                <h3 className="text-xl font-serif font-bold text-neutral-800 flex items-center gap-2 uppercase tracking-wide">
                    Profile
                </h3>
            </div>
            <div className="prose prose-sm prose-neutral leading-7 text-neutral-600 font-serif">
               <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-neutral-900 first-letter:float-left first-letter:mr-3 first-letter:font-serif">
                 {aboutMe}
               </p>
            </div>
            <div className="mt-auto flex justify-center opacity-50">
                <Star className="w-4 h-4 text-neutral-400" />
            </div>
          </Page>

          {/* --- 4. PAGE 2: EXPERIENCE I (Left) --- */}
          <Page number={2} position="left">
             <div className="border-b-2 border-neutral-100 pb-4 mb-8">
                <h3 className="text-xl font-serif font-bold text-neutral-800 flex items-center gap-2 uppercase tracking-wide">
                    Experience
                </h3>
            </div>
            <div className="space-y-10">
                {expPage1.map((exp, i) => (
                  <div key={i} className="relative">
                     <h4 className="font-bold text-neutral-900 text-base">{exp.role}</h4>
                     <div className="flex justify-between items-baseline mb-2">
                         <span className="text-xs font-semibold text-indigo-600">{exp.company}</span>
                         <span className="text-[10px] text-neutral-400 font-medium uppercase">{exp.period}</span>
                     </div>
                     <ul className="text-[13px] text-neutral-600 leading-relaxed font-serif list-disc ml-4 space-y-1">
                       {exp.description.map((desc, idx) => (
                         <li key={idx}>{desc}</li>
                       ))}
                     </ul>
                  </div>
                ))}
            </div>
          </Page>

          {/* --- 5. PAGE 3: EXPERIENCE II (Right) --- */}
          <Page number={3} position="right">
            <div className="space-y-10 mt-4">
                {expPage2.map((exp, i) => (
                  <div key={i} className="relative">
                     <h4 className="font-bold text-neutral-900 text-base">{exp.role}</h4>
                      <div className="flex justify-between items-baseline mb-2">
                         <span className="text-xs font-semibold text-indigo-600">{exp.company}</span>
                         <span className="text-[10px] text-neutral-400 font-medium uppercase">{exp.period}</span>
                     </div>
                     <ul className="text-[13px] text-neutral-600 leading-relaxed font-serif list-disc ml-4 space-y-1">
                       {exp.description.map((desc, idx) => (
                         <li key={idx}>{desc}</li>
                       ))}
                     </ul>
                  </div>
                ))}
               
               {experiences.length <= 2 && (
                 <div className="flex items-center justify-center h-40 border-2 border-dashed border-neutral-200 rounded-lg text-neutral-400 text-sm">
                    More history available on request
                 </div>
               )}
            </div>
          </Page>

           {/* --- 6. PAGE 4: SKILLS & EDUCATION (Left) --- */}
          <Page number={4} position="left">
            <div className="border-b-2 border-neutral-100 pb-4 mb-6">
                <h3 className="text-xl font-serif font-bold text-neutral-800 flex items-center gap-2 uppercase tracking-wide">
                    Skills & Edu
                </h3>
            </div>

            <div className="mb-8">
               <h4 className="text-xs font-bold text-neutral-400 uppercase mb-3 tracking-widest">Expertise</h4>
               <div className="flex flex-wrap gap-2">
                  {skills[0]?.items.slice(0, 8).map(s => (
                    <span key={s} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-wide rounded-sm border border-neutral-200">
                      {s}
                    </span>
                  ))}
               </div>
            </div>

            <div>
               <h4 className="text-xs font-bold text-neutral-400 uppercase mb-3 tracking-widest">Education</h4>
               {education.slice(0, 2).map((edu, i) => (
                 <div key={i} className="mb-3 last:mb-0">
                    <div className="font-bold text-neutral-800 text-sm">{edu.degree}</div>
                    <div className="text-xs text-neutral-600 font-medium">{edu.university}</div>
                    <div className="text-[10px] text-neutral-400 italic">{edu.school}, {edu.year}</div>
                    {edu.cgpa && <div className="text-[10px] text-indigo-600 font-bold uppercase mt-0.5">CGPA: {edu.cgpa}</div>}
                 </div>
               ))}
            </div>
          </Page>

          {/* --- 7. INNER BACK COVER (Right when open) --- */}
          <Cover isInnerCover>
              {/* Blank content, only border from Cover component remains */}
          </Cover>

          {/* --- 8. BACK COVER (Left when closed) --- */}
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