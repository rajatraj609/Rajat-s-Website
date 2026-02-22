import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ABOUT_ME, DETAILED_BIO, EXPERIENCES, CERTIFICATIONS, SKILLS, EDUCATION, RESUME_BOOK_DATA, CONTACT_INFO, HIRE_STATUS } from '../constants';
import { Experience, Certification, Skill, Education, ResumeBookData, ContactInfo, HireStatus } from '../types';

interface PortfolioContextType {
  aboutMe: string; // Hero headline
  updateAboutMe: (text: string) => void;
  heroImage: string;
  updateHeroImage: (url: string) => void;
  hireStatus: HireStatus;
  updateHireStatus: (status: HireStatus) => void;
  detailedBio: string; // The "About" section text
  updateDetailedBio: (text: string) => void;
  experiences: Experience[];
  updateExperiences: (exps: Experience[]) => void;
  certifications: Certification[];
  updateCertifications: (certs: Certification[]) => void;
  skills: Skill[];
  updateSkills: (skills: Skill[]) => void;
  education: Education[];
  updateEducation: (edu: Education[]) => void;
  resumeBookData: ResumeBookData;
  updateResumeBookData: (data: ResumeBookData) => void;
  contactInfo: ContactInfo;
  updateContactInfo: (data: ContactInfo) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or fallback to constants
  const [aboutMe, setAboutMe] = useState(() => {
    const saved = localStorage.getItem('portfolio_about');
    return saved || ABOUT_ME;
  });

  const [heroImage, setHeroImage] = useState(() => {
    const saved = localStorage.getItem('portfolio_hero_image');
    return saved || 'https://drive.google.com/file/d/11nYPAIjYeAAKT6xupCNPyK1S3j5C7jFJ/view?usp=sharing';
  });

  const [hireStatus, setHireStatus] = useState<HireStatus>(() => {
    const saved = localStorage.getItem('portfolio_hire_status');
    return (saved as HireStatus) || HIRE_STATUS;
  });

  const [detailedBio, setDetailedBio] = useState(() => {
    const saved = localStorage.getItem('portfolio_detailed_bio');
    return saved || DETAILED_BIO;
  });

  const [experiences, setExperiences] = useState<Experience[]>(() => {
    const saved = localStorage.getItem('portfolio_experiences');
    return saved ? JSON.parse(saved) : EXPERIENCES;
  });

  const [education, setEducation] = useState<Education[]>(() => {
    const saved = localStorage.getItem('portfolio_education');
    return saved ? JSON.parse(saved) : EDUCATION;
  });

  const [certifications, setCertifications] = useState<Certification[]>(() => {
    const saved = localStorage.getItem('portfolio_certifications');
    return saved ? JSON.parse(saved) : CERTIFICATIONS;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('portfolio_skills');
    return saved ? JSON.parse(saved) : SKILLS;
  });

  const [resumeBookData, setResumeBookData] = useState<ResumeBookData>(() => {
    const saved = localStorage.getItem('portfolio_resume_book');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...RESUME_BOOK_DATA, ...parsed };
      } catch (e) {
        return RESUME_BOOK_DATA;
      }
    }
    return RESUME_BOOK_DATA;
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('portfolio_contact_info');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...CONTACT_INFO, ...parsed };
      } catch (e) {
        return CONTACT_INFO;
      }
    }
    return CONTACT_INFO;
  });

  // Persistence Effects
  useEffect(() => localStorage.setItem('portfolio_about', aboutMe), [aboutMe]);
  useEffect(() => localStorage.setItem('portfolio_hero_image', heroImage), [heroImage]);
  useEffect(() => localStorage.setItem('portfolio_hire_status', hireStatus), [hireStatus]);
  useEffect(() => localStorage.setItem('portfolio_detailed_bio', detailedBio), [detailedBio]);
  useEffect(() => localStorage.setItem('portfolio_experiences', JSON.stringify(experiences)), [experiences]);
  useEffect(() => localStorage.setItem('portfolio_education', JSON.stringify(education)), [education]);
  useEffect(() => localStorage.setItem('portfolio_certifications', JSON.stringify(certifications)), [certifications]);
  useEffect(() => localStorage.setItem('portfolio_skills', JSON.stringify(skills)), [skills]);
  useEffect(() => localStorage.setItem('portfolio_resume_book', JSON.stringify(resumeBookData)), [resumeBookData]);
  useEffect(() => localStorage.setItem('portfolio_contact_info', JSON.stringify(contactInfo)), [contactInfo]);

  const updateAboutMe = (text: string) => setAboutMe(text);
  const updateHeroImage = (url: string) => setHeroImage(url);
  const updateHireStatus = (status: HireStatus) => setHireStatus(status);
  const updateDetailedBio = (text: string) => setDetailedBio(text);
  const updateExperiences = (exps: Experience[]) => setExperiences(exps);
  const updateEducation = (edu: Education[]) => setEducation(edu);
  const updateCertifications = (certs: Certification[]) => setCertifications(certs);
  const updateSkills = (s: Skill[]) => setSkills(s);
  const updateResumeBookData = (data: ResumeBookData) => setResumeBookData(data);
  const updateContactInfo = (data: ContactInfo) => setContactInfo(data);

  return (
    <PortfolioContext.Provider
      value={{
        aboutMe,
        updateAboutMe,
        heroImage,
        updateHeroImage,
        hireStatus,
        updateHireStatus,
        detailedBio,
        updateDetailedBio,
        experiences,
        updateExperiences,
        education,
        updateEducation,
        certifications,
        updateCertifications,
        skills,
        updateSkills,
        resumeBookData,
        updateResumeBookData,
        contactInfo,
        updateContactInfo
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};