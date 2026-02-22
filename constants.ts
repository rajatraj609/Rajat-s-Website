import { Certification, Experience, Skill, SocialLink, Education, ResumeBookData, ContactInfo } from './types';

export const ABOUT_ME = `I am a passionate Senior Frontend Engineer with over 6 years of experience building scalable, high-performance web applications.`;

export const HIRE_STATUS = 'Available for Hire';

export const DETAILED_BIO = `With a strong foundation in computer science and a passion for continuous learning, I have dedicated my career to solving complex problems through technology. 

My journey began with a curiosity for how things work, leading me to specialize in SAP architectures and modern web technologies. Over the years, I have expanded my expertise into AI and Machine Learning, constantly seeking ways to integrate intelligent solutions into practical business applications.

I believe in the power of collaboration and effective communication. Whether leading a team or contributing as an individual, I prioritize clarity, empathy, and shared goals.`;

export const EXPERIENCES: Experience[] = [
  {
    id: '1',
    role: 'Senior Frontend Engineer',
    company: 'TechFlow Solutions',
    companyLogo: 'https://picsum.photos/seed/techflow/100/100',
    period: '2021 - Present',
    description: [
      'Led the migration of a legacy monolithic architecture to a modern micro-frontend system using Module Federation.',
      'Improved core web vitals by 40% through code splitting, lazy loading, and asset optimization.',
      'Mentored a team of 4 junior developers and established code quality standards.'
    ]
  },
  {
    id: '2',
    role: 'Software Developer',
    company: 'Creative Digital Agency',
    companyLogo: 'https://picsum.photos/seed/creative/100/100',
    period: '2019 - 2021',
    description: [
      'Developed interactive marketing campaigns for Fortune 500 clients using React and WebGL.',
      'Collaborated closely with designers to implement pixel-perfect responsive layouts.',
      'Integrated headless CMS solutions to empower content teams.'
    ]
  }
];

export const EDUCATION: Education[] = [
  {
    id: 'e1',
    degree: 'Master of Computer Applications',
    school: 'School of Computing',
    university: 'University of Technology',
    year: '2016',
    cgpa: '8.5/10',
    details: 'Specialized in Advanced Algorithms and Database Management Systems. Completed a thesis on Distributed Systems.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop'
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'c1',
    name: 'SAP Certified Associate - SAP S/4HANA Cloud Private Edition, Extended Warehouse Management',
    issuer: 'SAP',
    issuedDate: 'Apr 2024',
    expiryDate: 'Oct 2026',
    credentialUrl: 'https://www.credly.com/',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/2560px-SAP_2011_logo.svg.png'
  }
];

export const SKILLS: Skill[] = [
  {
    category: 'SAP',
    items: ['SAP UI5', 'Fiori', 'ABAP', 'HANA', 'OData Services', 'CAP Model']
  },
  {
    category: 'AI, ML & DSE',
    items: ['Python', 'TensorFlow', 'Pandas', 'Gemini API', 'Scikit-learn', 'Data Modeling']
  },
  {
    category: 'Soft Skills',
    items: ['Team Leadership', 'Agile Methodology', 'Communication', 'Problem Solving', 'Mentoring']
  }
];

// Deprecated in favor of dynamic ContactInfo, but kept for type compatibility if needed elsewhere temporarily
export const SOCIALS: SocialLink[] = [
  { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
  { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
];

export const RESUME_BOOK_DATA: ResumeBookData = {
  coverTitle: 'RAJAT',
  coverSubtitle: 'Senior Engineer',
  coverBottomText: 'EST. ' + new Date().getFullYear(),
  cvLink: '#'
};

export const CONTACT_INFO: ContactInfo = {
  emailPersonal: 'rajat.personal@example.com',
  emailWork: 'rajat.work@example.com',
  emailCollege: 'rajat.college@edu.com',
  phone: '+91 98765 43210',
  location: 'Bangalore, India',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com'
};