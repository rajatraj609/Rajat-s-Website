export type HireStatus = 'Unavailable for Hire' | 'Available for Hire' | 'Appearing for Interview' | 'On notice period';

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
  credentialUrl: string;
  logo: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyLogo?: string;
  period: string;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  university: string;
  year: string;
  cgpa?: string;
  details: string; // Long description for the popup
  image: string; // Background image for the modal
}

export interface Skill {
  category: string;
  items: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface ResumeBookData {
  coverTitle: string;
  coverSubtitle: string;
  coverBottomText: string;
  cvLink: string;
}

export interface ContactInfo {
  emailPersonal: string;
  emailWork: string;
  emailCollege: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
}