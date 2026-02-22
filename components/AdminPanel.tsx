import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Lock, User, Calendar, Phone, Mail, Save, LogOut, ArrowLeft, CheckCircle, Download, MapPin, Globe, Linkedin, Twitter, Github, Image as ImageIcon } from 'lucide-react';
import { Experience, Certification, Skill, Education, ResumeBookData, ContactInfo, HireStatus } from '../types';
import { getDirectImageUrl } from '../utils/imageUtils';
import { Plus, Trash2, Award } from 'lucide-react';

// Verification Constants
const VERIFY_EMAIL = "pushpraj2502@gmail.com";
const VERIFY_PHONE = "8579911153";
const VERIFY_DOB = "1992-02-25"; 

type ViewState = 'verify' | 'setup_password' | 'login' | 'dashboard';

interface AdminPanelProps {
  onExit: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onExit }) => {
  const { 
    aboutMe, updateAboutMe, 
    heroImage, updateHeroImage,
    hireStatus, updateHireStatus,
    detailedBio, updateDetailedBio,
    experiences, updateExperiences, 
    education, updateEducation,
    certifications, updateCertifications, 
    skills, updateSkills,
    resumeBookData, updateResumeBookData,
    contactInfo, updateContactInfo,
    saveToSupabase
  } = usePortfolio();
  
  const [viewState, setViewState] = useState<ViewState>('verify');
  
  // Login Form State
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  
  // Verify Form State
  const [verifyData, setVerifyData] = useState({ email: '', phone: '', dob: '' });
  
  // Password Setup State
  const [pwdData, setPwdData] = useState({ password: '', confirmPassword: '' });

  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'intro' | 'about' | 'skills' | 'experience' | 'education' | 'certifications' | 'my flipbook' | 'contact info'>('intro');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // LOCAL BUFFER STATES FOR EDITING
  const [localAboutMe, setLocalAboutMe] = useState(aboutMe);
  const [localHeroImage, setLocalHeroImage] = useState(heroImage);
  const [localHireStatus, setLocalHireStatus] = useState<HireStatus>(hireStatus);
  const [localDetailedBio, setLocalDetailedBio] = useState(detailedBio);
  const [localSkills, setLocalSkills] = useState<Skill[]>(skills);
  const [localExperiences, setLocalExperiences] = useState<Experience[]>(experiences);
  const [localEducation, setLocalEducation] = useState<Education[]>(education);
  const [localCertifications, setLocalCertifications] = useState<Certification[]>(certifications);
  const [localResumeBookData, setLocalResumeBookData] = useState<ResumeBookData>(resumeBookData);
  const [localContactInfo, setLocalContactInfo] = useState<ContactInfo>(contactInfo);

  // Load context into local buffer on mount or when context changes
  useEffect(() => {
    setLocalAboutMe(aboutMe);
    setLocalHeroImage(heroImage);
    setLocalHireStatus(hireStatus);
    setLocalDetailedBio(detailedBio);
    setLocalSkills(skills);
    setLocalExperiences(experiences);
    setLocalEducation(education);
    setLocalCertifications(certifications);
    setLocalResumeBookData(resumeBookData);
    setLocalContactInfo(contactInfo);
  }, [aboutMe, detailedBio, skills, experiences, education, certifications, resumeBookData, contactInfo]);

  useEffect(() => {
    const storedPwd = localStorage.getItem('admin_password');
    if (storedPwd) {
      setViewState('login');
    } else {
      setViewState('verify');
    }
  }, []);

  // --- Handlers ---

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyData.email === VERIFY_EMAIL && verifyData.phone === VERIFY_PHONE && verifyData.dob === VERIFY_DOB) {
      setViewState('setup_password');
      setError('');
    } else {
      setError('Details do not match our records.');
    }
  };

  const handleSetupPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdData.password.length < 4) {
      setError('Password is too short.');
      return;
    }
    if (pwdData.password !== pwdData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    localStorage.setItem('admin_password', pwdData.password);
    setViewState('dashboard');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPwd = localStorage.getItem('admin_password');
    
    if (loginData.email === VERIFY_EMAIL && loginData.password === storedPwd) {
      setViewState('dashboard');
      setError('');
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleSaveChanges = async () => {
    setSaveStatus('saving');
    try {
      updateAboutMe(localAboutMe);
      updateHeroImage(localHeroImage);
      updateHireStatus(localHireStatus);
      updateDetailedBio(localDetailedBio);
      updateSkills(localSkills);
      updateExperiences(localExperiences);
      updateEducation(localEducation);
      updateCertifications(localCertifications);
      updateResumeBookData(localResumeBookData);
      updateContactInfo(localContactInfo);
      
      await saveToSupabase();
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const inputClass = "w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white focus:border-accent focus:outline-none transition-colors";

  // --- Renders ---

  const renderVerify = () => (
    <div className="max-w-md w-full bg-card border border-neutral-800 p-8 rounded-2xl shadow-2xl relative">
      <button onClick={onExit} className="absolute top-4 left-4 text-neutral-500 hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Identity Verification</h2>
        <p className="text-neutral-400 text-sm mt-2">First time setup.</p>
      </div>
      <form onSubmit={handleVerify} className="space-y-4">
        <input type="email" value={verifyData.email} onChange={e => setVerifyData({...verifyData, email: e.target.value})} className={inputClass} placeholder="Email" required />
        <input type="tel" value={verifyData.phone} onChange={e => setVerifyData({...verifyData, phone: e.target.value})} className={inputClass} placeholder="Phone" required />
        <input type="date" value={verifyData.dob} onChange={e => setVerifyData({...verifyData, dob: e.target.value})} className={inputClass} required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-accent hover:bg-indigo-600 text-white py-3 rounded-lg font-medium">Verify</button>
      </form>
    </div>
  );

  const renderSetupPassword = () => (
    <div className="max-w-md w-full bg-card border border-neutral-800 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold text-center text-white mb-8">Set Password</h2>
      <form onSubmit={handleSetupPassword} className="space-y-4">
        <input type="password" value={pwdData.password} onChange={e => setPwdData({...pwdData, password: e.target.value})} className={inputClass} placeholder="New Password" required />
        <input type="password" value={pwdData.confirmPassword} onChange={e => setPwdData({...pwdData, confirmPassword: e.target.value})} className={inputClass} placeholder="Confirm Password" required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-accent hover:bg-indigo-600 text-white py-3 rounded-lg font-medium">Set & Login</button>
      </form>
    </div>
  );

  const renderLogin = () => (
    <div className="max-w-md w-full bg-card border border-neutral-800 p-8 rounded-2xl shadow-2xl relative">
       <button onClick={onExit} className="absolute top-4 left-4 text-neutral-500 hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Admin Login</h2>
        <p className="text-neutral-400 text-sm mt-2">Enter your credentials</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} className={inputClass} placeholder="Email" required />
        <input type="password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} className={inputClass} placeholder="Password" required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-accent hover:bg-indigo-600 text-white py-3 rounded-lg font-medium">Login</button>
      </form>
    </div>
  );

  const renderDashboard = () => (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex gap-4 items-center">
             <button 
                onClick={handleSaveChanges} 
                disabled={saveStatus === 'saving'}
                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  saveStatus === 'saved' ? 'bg-green-500 text-white' : 
                  saveStatus === 'error' ? 'bg-red-500 text-white' :
                  saveStatus === 'saving' ? 'bg-accent/50 text-white cursor-wait' :
                  'bg-accent text-white hover:bg-indigo-600'
                }`}
             >
                {saveStatus === 'saving' ? 'Saving...' : 
                 saveStatus === 'saved' ? <><CheckCircle className="w-4 h-4" /> Saved!</> : 
                 saveStatus === 'error' ? 'Error!' :
                 <><Save className="w-4 h-4" /> Save Changes</>}
             </button>
             <button onClick={onExit} className="px-4 py-2 border border-neutral-700 rounded-lg text-neutral-300 hover:text-white transition-colors">Back to Site</button>
             <button onClick={onExit} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
           {(['intro', 'about', 'skills', 'experience', 'education', 'certifications', 'my flipbook', 'contact info'] as const).map(tab => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-accent text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
             >
               {tab}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-card border border-neutral-800 rounded-2xl p-6">
           
            {activeTab === 'intro' && (
             <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <div>
                      <h3 className="text-xl font-bold text-white mb-4">Edit Hero Headline</h3>
                      <p className="text-neutral-500 text-sm mb-2">This text appears on the main landing screen.</p>
                      <textarea 
                        value={localAboutMe} 
                        onChange={(e) => setLocalAboutMe(e.target.value)} 
                        className="w-full h-32 bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-white focus:border-accent outline-none" 
                      />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-white mb-4">Hire Status</h3>
                      <p className="text-neutral-500 text-sm mb-2">Select your current availability status.</p>
                      <select 
                        value={localHireStatus}
                        onChange={(e) => setLocalHireStatus(e.target.value as HireStatus)}
                        className={inputClass}
                      >
                         <option value="Unavailable for Hire">Unavailable for Hire</option>
                         <option value="Available for Hire">Available for Hire</option>
                         <option value="Appearing for Interview">Appearing for Interview</option>
                         <option value="On notice period">On notice period</option>
                      </select>
                   </div>
                </div>

                <div className="pt-6 border-t border-neutral-800">
                   <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-accent" /> Hero Image
                   </h3>
                   <p className="text-neutral-500 text-sm mb-4">Paste your Google Drive share link here. It will be automatically converted for display.</p>
                   
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <label className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Image URL</label>
                         <input 
                           type="text"
                           value={localHeroImage}
                           onChange={(e) => setLocalHeroImage(e.target.value)}
                           className={inputClass}
                           placeholder="https://drive.google.com/..."
                         />
                         <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                            <p className="text-xs text-indigo-300 leading-relaxed">
                               <strong>Tip:</strong> You can use a standard Google Drive share link. We'll handle the conversion to a direct image link automatically.
                            </p>
                         </div>
                      </div>
                      
                      <div className="space-y-2">
                         <label className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Preview</label>
                         <div className="aspect-square w-full bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden relative group">
                            <img 
                               src={getDirectImageUrl(localHeroImage)} 
                               alt="Hero Preview" 
                               className="w-full h-full object-cover"
                               onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/error/400/400?blur=10';
                               }}
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <p className="text-white text-xs font-medium">Live Preview</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

            {activeTab === 'about' && (
             <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Edit About Me</h3>
                <p className="text-neutral-500 text-sm">Detailed biography in the About section.</p>
                <textarea 
                  value={localDetailedBio} 
                  onChange={(e) => setLocalDetailedBio(e.target.value)} 
                  className="w-full h-96 bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-white focus:border-accent outline-none" 
                />
             </div>
           )}

           {activeTab === 'skills' && (
               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Edit Technical Skills</h3>
                  {localSkills.map((group, idx) => (
                      <div key={idx} className="space-y-2 bg-neutral-900 p-4 rounded-lg">
                          <label className="text-sm font-medium text-accent block mb-2">{group.category}</label>
                          <input 
                             value={group.items.join(', ')}
                             onChange={(e) => {
                                 const newSkills = [...localSkills];
                                 newSkills[idx].items = e.target.value.split(',').map(s => s.trim());
                                 setLocalSkills(newSkills);
                             }}
                             className={inputClass}
                          />
                      </div>
                  ))}
               </div>
           )}

           {activeTab === 'experience' && (
             <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Experience</h3>
                  <button 
                    onClick={() => setLocalExperiences([...localExperiences, { id: Date.now().toString(), role: '', company: '', period: '', description: [''], companyLogo: '' }])}
                    className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" /> Add Experience
                  </button>
               </div>
               {localExperiences.map((exp, idx) => (
                  <div key={exp.id} className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 space-y-4 relative group">
                      <button 
                        onClick={() => setLocalExperiences(localExperiences.filter((_, i) => i !== idx))}
                        className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">Role</label>
                             <input 
                               value={exp.role} 
                               onChange={(e) => {
                                   const newExps = [...localExperiences];
                                   newExps[idx].role = e.target.value;
                                   setLocalExperiences(newExps);
                               }}
                               className={inputClass}
                               placeholder="Role"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">Company</label>
                             <input 
                               value={exp.company} 
                               onChange={(e) => {
                                   const newExps = [...localExperiences];
                                   newExps[idx].company = e.target.value;
                                   setLocalExperiences(newExps);
                               }}
                               className={inputClass}
                               placeholder="Company"
                             />
                          </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">Period</label>
                             <input 
                               value={exp.period} 
                               onChange={(e) => {
                                   const newExps = [...localExperiences];
                                   newExps[idx].period = e.target.value;
                                   setLocalExperiences(newExps);
                               }}
                               className={inputClass}
                               placeholder="Period (e.g. 2021 - Present)"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">Company Logo URL</label>
                             <div className="flex gap-3">
                                <input 
                                  value={exp.companyLogo} 
                                  onChange={(e) => {
                                      const newExps = [...localExperiences];
                                      newExps[idx].companyLogo = e.target.value;
                                      setLocalExperiences(newExps);
                                  }}
                                  className={inputClass}
                                  placeholder="Logo URL"
                                />
                                <div className="w-12 h-12 bg-neutral-950 rounded border border-neutral-800 flex-shrink-0 overflow-hidden">
                                   <img src={getDirectImageUrl(exp.companyLogo || '')} className="w-full h-full object-contain" onError={e => (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/logo/50/50'} />
                                </div>
                             </div>
                          </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs text-neutral-500 uppercase font-bold">Description Points (one per line)</label>
                         <textarea
                            value={exp.description.join('\n')}
                            onChange={(e) => {
                                const newExps = [...localExperiences];
                                newExps[idx].description = e.target.value.split('\n');
                                setLocalExperiences(newExps);
                            }}
                            className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-300 focus:border-accent outline-none"
                            placeholder="Description points..."
                         />
                      </div>
                  </div>
               ))}
             </div>
           )}

            {activeTab === 'education' && (
             <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Education</h3>
                  <button 
                    onClick={() => setLocalEducation([...localEducation, { id: Date.now().toString(), degree: '', school: '', university: '', year: '', details: '', image: '', cgpa: '' }])}
                    className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" /> Add Education
                  </button>
               </div>
               {localEducation.map((edu, idx) => (
                  <div key={edu.id} className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 space-y-4 relative group">
                      <button 
                        onClick={() => setLocalEducation(localEducation.filter((_, i) => i !== idx))}
                        className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">Degree</label>
                             <input 
                               value={edu.degree} 
                               onChange={(e) => {
                                   const newEdu = [...localEducation];
                                   newEdu[idx].degree = e.target.value;
                                   setLocalEducation(newEdu);
                               }}
                               className={inputClass}
                               placeholder="Degree"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">Year</label>
                             <input 
                               value={edu.year} 
                               onChange={(e) => {
                                   const newEdu = [...localEducation];
                                   newEdu[idx].year = e.target.value;
                                   setLocalEducation(newEdu);
                               }}
                               className={inputClass}
                               placeholder="Year"
                             />
                          </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">University</label>
                             <input 
                               value={edu.university} 
                               onChange={(e) => {
                                   const newEdu = [...localEducation];
                                   newEdu[idx].university = e.target.value;
                                   setLocalEducation(newEdu);
                               }}
                               className={inputClass}
                               placeholder="University"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">School</label>
                             <input 
                               value={edu.school} 
                               onChange={(e) => {
                                   const newEdu = [...localEducation];
                                   newEdu[idx].school = e.target.value;
                                   setLocalEducation(newEdu);
                               }}
                               className={inputClass}
                               placeholder="School"
                             />
                          </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">Percentage/CGPA</label>
                             <input 
                               value={edu.cgpa} 
                               onChange={(e) => {
                                   const newEdu = [...localEducation];
                                   newEdu[idx].cgpa = e.target.value;
                                   setLocalEducation(newEdu);
                               }}
                               className={inputClass}
                               placeholder="e.g. 8.5/10 or 85%"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">Campus Image URL (Modal BG)</label>
                             <input 
                               value={edu.image} 
                               onChange={(e) => {
                                   const newEdu = [...localEducation];
                                   newEdu[idx].image = e.target.value;
                                   setLocalEducation(newEdu);
                               }}
                               className={inputClass}
                               placeholder="Campus Image URL"
                             />
                          </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs text-neutral-500 uppercase font-bold">Details (for Modal)</label>
                         <textarea
                            value={edu.details}
                            onChange={(e) => {
                                const newEdu = [...localEducation];
                                newEdu[idx].details = e.target.value;
                                setLocalEducation(newEdu);
                            }}
                            className="w-full h-24 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-300 focus:border-accent outline-none"
                            placeholder="Details..."
                         />
                      </div>
                  </div>
               ))}
             </div>
           )}

            {activeTab === 'certifications' && (
             <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Licenses & Certifications</h3>
                  <button 
                    onClick={() => setLocalCertifications([...localCertifications, { id: Date.now().toString(), name: '', issuer: '', issuedDate: '', expiryDate: '', credentialUrl: '', logo: '' }])}
                    className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" /> Add Certification
                  </button>
               </div>
               {localCertifications.map((cert, idx) => (
                  <div key={cert.id} className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 space-y-4 relative group">
                      <button 
                        onClick={() => setLocalCertifications(localCertifications.filter((_, i) => i !== idx))}
                        className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="space-y-2">
                         <label className="text-xs text-neutral-500 uppercase font-bold">Certification Name</label>
                         <input 
                           value={cert.name} 
                           onChange={(e) => {
                               const newCerts = [...localCertifications];
                               newCerts[idx].name = e.target.value;
                               setLocalCertifications(newCerts);
                           }}
                           className={inputClass}
                           placeholder="e.g. SAP Certified Associate"
                         />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">Issuer</label>
                             <input 
                               value={cert.issuer} 
                               onChange={(e) => {
                                   const newCerts = [...localCertifications];
                                   newCerts[idx].issuer = e.target.value;
                                   setLocalCertifications(newCerts);
                               }}
                               className={inputClass}
                               placeholder="e.g. SAP"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">Credential URL</label>
                             <input 
                               value={cert.credentialUrl} 
                               onChange={(e) => {
                                   const newCerts = [...localCertifications];
                                   newCerts[idx].credentialUrl = e.target.value;
                                   setLocalCertifications(newCerts);
                               }}
                               className={inputClass}
                               placeholder="Verification link"
                             />
                          </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">Issued Date</label>
                             <input 
                               value={cert.issuedDate} 
                               onChange={(e) => {
                                   const newCerts = [...localCertifications];
                                   newCerts[idx].issuedDate = e.target.value;
                                   setLocalCertifications(newCerts);
                               }}
                               className={inputClass}
                               placeholder="e.g. Apr 2024"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs text-neutral-500 uppercase font-bold">Expiry Date (Optional)</label>
                             <input 
                               value={cert.expiryDate} 
                               onChange={(e) => {
                                   const newCerts = [...localCertifications];
                                   newCerts[idx].expiryDate = e.target.value;
                                   setLocalCertifications(newCerts);
                               }}
                               className={inputClass}
                               placeholder="e.g. Oct 2026"
                             />
                          </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs text-neutral-500 uppercase font-bold">Logo URL</label>
                         <div className="flex gap-3">
                            <input 
                              value={cert.logo} 
                              onChange={(e) => {
                                  const newCerts = [...localCertifications];
                                  newCerts[idx].logo = e.target.value;
                                  setLocalCertifications(newCerts);
                              }}
                              className={inputClass}
                              placeholder="Logo URL"
                            />
                            <div className="w-12 h-12 bg-neutral-950 rounded border border-neutral-800 flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
                               <img src={getDirectImageUrl(cert.logo || '')} className="w-full h-full object-contain" onError={e => (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/cert/50/50'} />
                            </div>
                         </div>
                      </div>
                  </div>
               ))}
             </div>
           )}

           {activeTab === 'my flipbook' && (
             <div className="space-y-8">
               <h3 className="text-xl font-bold text-white">My Flipbook & General Settings</h3>
               <p className="text-neutral-500 text-sm">Customize the flipbook cover and global site links.</p>
               
               <div className="space-y-4 bg-neutral-900 p-4 rounded-lg border border-neutral-800">
                  <div className="border-b border-neutral-800 pb-4 mb-4">
                     <h4 className="text-white font-medium mb-4 flex items-center gap-2"><Download className="w-4 h-4 text-accent"/> Downloads</h4>
                     <div>
                        <label className="text-sm font-medium text-accent block mb-2">CV Download Link (Google Drive)</label>
                        <input 
                          value={localResumeBookData.cvLink}
                          onChange={(e) => setLocalResumeBookData({...localResumeBookData, cvLink: e.target.value})}
                          className={inputClass}
                          placeholder="https://drive.google.com/..."
                        />
                        <p className="text-xs text-neutral-500 mt-1">This link will be used for all "Download CV" buttons on the site.</p>
                     </div>
                  </div>

                  <h4 className="text-white font-medium mb-4 flex items-center gap-2"><User className="w-4 h-4 text-accent"/> Book Cover Details</h4>
                  <div>
                    <label className="text-sm font-medium text-accent block mb-2">Cover Title</label>
                    <input 
                      value={localResumeBookData.coverTitle}
                      onChange={(e) => setLocalResumeBookData({...localResumeBookData, coverTitle: e.target.value})}
                      className={inputClass}
                      placeholder="e.g. RAJAT"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-accent block mb-2">Cover Subtitle</label>
                    <input 
                      value={localResumeBookData.coverSubtitle}
                      onChange={(e) => setLocalResumeBookData({...localResumeBookData, coverSubtitle: e.target.value})}
                      className={inputClass}
                      placeholder="e.g. Senior Engineer"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-accent block mb-2">Cover Bottom Text</label>
                    <input 
                      value={localResumeBookData.coverBottomText}
                      onChange={(e) => setLocalResumeBookData({...localResumeBookData, coverBottomText: e.target.value})}
                      className={inputClass}
                      placeholder="e.g. EST. 2026"
                    />
                  </div>
               </div>
             </div>
           )}

           {activeTab === 'contact info' && (
             <div className="space-y-8">
               <h3 className="text-xl font-bold text-white">Contact Details & Socials</h3>
               <p className="text-neutral-500 text-sm">Manage the contact information shown in the 'Contact Me' popup and footer.</p>

               <div className="grid md:grid-cols-2 gap-6 bg-neutral-900 p-4 rounded-lg border border-neutral-800">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium flex items-center gap-2"><Mail className="w-4 h-4 text-accent"/> Emails</h4>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Personal Email</label>
                      <input value={localContactInfo.emailPersonal} onChange={e => setLocalContactInfo({...localContactInfo, emailPersonal: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Work Email</label>
                      <input value={localContactInfo.emailWork} onChange={e => setLocalContactInfo({...localContactInfo, emailWork: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">College Email</label>
                      <input value={localContactInfo.emailCollege} onChange={e => setLocalContactInfo({...localContactInfo, emailCollege: e.target.value})} className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-white font-medium flex items-center gap-2"><Phone className="w-4 h-4 text-accent"/> Phone & Location</h4>
                     <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Phone Number</label>
                      <input value={localContactInfo.phone} onChange={e => setLocalContactInfo({...localContactInfo, phone: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Place (City, Country)</label>
                      <input value={localContactInfo.location} onChange={e => setLocalContactInfo({...localContactInfo, location: e.target.value})} className={inputClass} />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4 border-t border-neutral-800 pt-4 mt-2">
                     <h4 className="text-white font-medium flex items-center gap-2"><Globe className="w-4 h-4 text-accent"/> Social Links</h4>
                     <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-neutral-500 mb-1 block flex items-center gap-1"><Github className="w-3 h-3"/> Github URL</label>
                          <input value={localContactInfo.github} onChange={e => setLocalContactInfo({...localContactInfo, github: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-500 mb-1 block flex items-center gap-1"><Linkedin className="w-3 h-3"/> LinkedIn URL</label>
                          <input value={localContactInfo.linkedin} onChange={e => setLocalContactInfo({...localContactInfo, linkedin: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-500 mb-1 block flex items-center gap-1"><Twitter className="w-3 h-3"/> Twitter URL</label>
                          <input value={localContactInfo.twitter} onChange={e => setLocalContactInfo({...localContactInfo, twitter: e.target.value})} className={inputClass} />
                        </div>
                     </div>
                  </div>
               </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-6">
       {viewState === 'verify' && renderVerify()}
       {viewState === 'setup_password' && renderSetupPassword()}
       {viewState === 'login' && renderLogin()}
       {viewState === 'dashboard' && renderDashboard()}
    </div>
  );
};

export default AdminPanel;