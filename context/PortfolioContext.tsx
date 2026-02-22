import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ABOUT_ME, DETAILED_BIO, EXPERIENCES, CERTIFICATIONS, SKILLS, EDUCATION, RESUME_BOOK_DATA, CONTACT_INFO, HIRE_STATUS } from '../constants';
import { Experience, Certification, Skill, Education, ResumeBookData, ContactInfo, HireStatus } from '../types';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
  saveToFirebase: () => Promise<void>;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  // Initialize from localStorage or fallback to constants
  const [aboutMe, setAboutMe] = useState(ABOUT_ME);
  const [heroImage, setHeroImage] = useState('https://drive.google.com/file/d/11nYPAIjYeAAKT6xupCNPyK1S3j5C7jFJ/view?usp=sharing');
  const [hireStatus, setHireStatus] = useState<HireStatus>(HIRE_STATUS);
  const [detailedBio, setDetailedBio] = useState(DETAILED_BIO);
  const [experiences, setExperiences] = useState<Experience[]>(EXPERIENCES);
  const [education, setEducation] = useState<Education[]>(EDUCATION);
  const [certifications, setCertifications] = useState<Certification[]>(CERTIFICATIONS);
  const [skills, setSkills] = useState<Skill[]>(SKILLS);
  const [resumeBookData, setResumeBookData] = useState<ResumeBookData>(RESUME_BOOK_DATA);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(CONTACT_INFO);

  // Load from Firebase/localStorage on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!isFirebaseConfigured) {
        console.warn('Firebase not configured, skipping fetch.');
        loadFromLocalStorage();
        setIsLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "resumeData", "portfolio");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const c = docSnap.data();
          if (c.aboutMe) setAboutMe(c.aboutMe);
          if (c.heroImage) setHeroImage(c.heroImage);
          if (c.hireStatus) setHireStatus(c.hireStatus);
          if (c.detailedBio) setDetailedBio(c.detailedBio);
          if (c.experiences) setExperiences(c.experiences);
          if (c.education) setEducation(c.education);
          if (c.certifications) setCertifications(c.certifications);
          if (c.skills) setSkills(c.skills);
          if (c.resumeBookData) setResumeBookData(c.resumeBookData);
          if (c.contactInfo) setContactInfo(c.contactInfo);
        } else {
          console.warn('No such document in Firestore!');
          loadFromLocalStorage();
        }
      } catch (err) {
        console.error('Error fetching from Firebase:', err);
        loadFromLocalStorage();
      } finally {
        setIsLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      const savedAbout = localStorage.getItem('portfolio_about');
      if (savedAbout) setAboutMe(savedAbout);
      const savedHero = localStorage.getItem('portfolio_hero_image');
      if (savedHero) setHeroImage(savedHero);
      const savedHire = localStorage.getItem('portfolio_hire_status');
      if (savedHire) setHireStatus(savedHire as HireStatus);
      const savedBio = localStorage.getItem('portfolio_detailed_bio');
      if (savedBio) setDetailedBio(savedBio);
      const savedExp = localStorage.getItem('portfolio_experiences');
      if (savedExp) setExperiences(JSON.parse(savedExp));
      const savedEdu = localStorage.getItem('portfolio_education');
      if (savedEdu) setEducation(JSON.parse(savedEdu));
      const savedCert = localStorage.getItem('portfolio_certifications');
      if (savedCert) setCertifications(JSON.parse(savedCert));
      const savedSkills = localStorage.getItem('portfolio_skills');
      if (savedSkills) setSkills(JSON.parse(savedSkills));
      const savedResume = localStorage.getItem('portfolio_resume_book');
      if (savedResume) setResumeBookData(JSON.parse(savedResume));
      const savedContact = localStorage.getItem('portfolio_contact_info');
      if (savedContact) setContactInfo(JSON.parse(savedContact));
    };

    fetchData();
  }, []);

  // Persistence Effects (Local Storage as cache)
  useEffect(() => { if (!isLoading) localStorage.setItem('portfolio_about', aboutMe); }, [aboutMe, isLoading]);
  useEffect(() => { if (!isLoading) localStorage.setItem('portfolio_hero_image', heroImage); }, [heroImage, isLoading]);
  useEffect(() => { if (!isLoading) localStorage.setItem('portfolio_hire_status', hireStatus); }, [hireStatus, isLoading]);
  useEffect(() => { if (!isLoading) localStorage.setItem('portfolio_detailed_bio', detailedBio); }, [detailedBio, isLoading]);
  useEffect(() => { if (!isLoading) localStorage.setItem('portfolio_experiences', JSON.stringify(experiences)); }, [experiences, isLoading]);
  useEffect(() => { if (!isLoading) localStorage.setItem('portfolio_education', JSON.stringify(education)); }, [education, isLoading]);
  useEffect(() => { if (!isLoading) localStorage.setItem('portfolio_certifications', JSON.stringify(certifications)); }, [certifications, isLoading]);
  useEffect(() => { if (!isLoading) localStorage.setItem('portfolio_skills', JSON.stringify(skills)); }, [skills, isLoading]);
  useEffect(() => { if (!isLoading) localStorage.setItem('portfolio_resume_book', JSON.stringify(resumeBookData)); }, [resumeBookData, isLoading]);
  useEffect(() => { if (!isLoading) localStorage.setItem('portfolio_contact_info', JSON.stringify(contactInfo)); }, [contactInfo, isLoading]);

  const saveToFirebase = async () => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured. Please set your environment variables.');
    }

    const content = {
      aboutMe,
      heroImage,
      hireStatus,
      detailedBio,
      experiences,
      education,
      certifications,
      skills,
      resumeBookData,
      contactInfo,
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "resumeData", "portfolio"), content);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      throw error;
    }
  };

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
        updateContactInfo,
        saveToFirebase,
        isLoading
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