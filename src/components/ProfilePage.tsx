import React, { useState, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderGit2, 
  Save, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Globe,
  RotateCcw,
  Database,
  Loader2
} from 'lucide-react';
import { UserProfile, UserExperience, UserEducation, UserProject } from '../types/profile';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  syncProfileWithDatabase, 
  persistProfileToDatabase, 
  resetProfileInDatabase 
} from '../services/profileService';

interface ProfilePageProps {
  onGoToGenerator: () => void;
  onToast: (msg: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onGoToGenerator, onToast }) => {
  const [profile, setProfile] = useState<UserProfile>(() => getStoredProfile());
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'skills' | 'education' | 'projects'>('personal');
  const [newSkill, setNewSkill] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFromDb, setIsLoadingFromDb] = useState(false);

  // Sync with backend database on mount
  useEffect(() => {
    let mounted = true;
    setIsLoadingFromDb(true);
    syncProfileWithDatabase()
      .then((dbProfile) => {
        if (mounted && dbProfile) {
          setProfile(dbProfile);
        }
      })
      .finally(() => {
        if (mounted) setIsLoadingFromDb(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await persistProfileToDatabase(profile);
      setIsSaved(true);
      onToast('Profile updated & saved to database! AI generator will use your latest details.');
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err: any) {
      onToast(err?.message || 'Error saving profile to database');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset profile to default sample profile in database? This will refresh your experiences and skills.')) {
      setIsSaving(true);
      try {
        const def = await resetProfileInDatabase();
        setProfile(def);
        onToast('Profile reset to default in database.');
      } catch (err: any) {
        onToast(err?.message || 'Error resetting profile');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Skill handlers
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      const updated = { ...profile, skills: [...profile.skills, trimmed] };
      setProfile(updated);
      saveStoredProfile(updated);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = {
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove),
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newExp: UserExperience = {
      id: `exp-${Date.now()}`,
      role: 'Senior Engineer / Specialist',
      company: 'Tech Company',
      location: 'Remote',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      bullets: [
        'Spearheaded key initiatives driving 30%+ measurable growth or efficiency lift.',
        'Collaborated across cross-functional teams to deliver production-grade systems.',
      ],
    };
    const updated = { ...profile, experiences: [newExp, ...profile.experiences] };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleUpdateExperience = (id: string, field: keyof UserExperience, value: any) => {
    const updatedExp = profile.experiences.map(exp => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    setProfile({ ...profile, experiences: updatedExp });
  };

  const handleRemoveExperience = (id: string) => {
    const updatedExp = profile.experiences.filter(exp => exp.id !== id);
    const updated = { ...profile, experiences: updatedExp };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleAddBullet = (expId: string) => {
    const updatedExp = profile.experiences.map(exp => {
      if (exp.id === expId) {
        return {
          ...exp,
          bullets: [...exp.bullets, 'Engineered new capabilities improving key user conversion or system stability.'],
        };
      }
      return exp;
    });
    setProfile({ ...profile, experiences: updatedExp });
  };

  const handleUpdateBullet = (expId: string, bulletIndex: number, text: string) => {
    const updatedExp = profile.experiences.map(exp => {
      if (exp.id === expId) {
        const bullets = [...exp.bullets];
        bullets[bulletIndex] = text;
        return { ...exp, bullets };
      }
      return exp;
    });
    setProfile({ ...profile, experiences: updatedExp });
  };

  const handleRemoveBullet = (expId: string, bulletIndex: number) => {
    const updatedExp = profile.experiences.map(exp => {
      if (exp.id === expId) {
        return {
          ...exp,
          bullets: exp.bullets.filter((_, idx) => idx !== bulletIndex),
        };
      }
      return exp;
    });
    setProfile({ ...profile, experiences: updatedExp });
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEdu: UserEducation = {
      id: `edu-${Date.now()}`,
      degree: 'B.S. in Computer Science',
      school: 'University Name',
      year: '2020',
    };
    const updated = { ...profile, education: [...profile.education, newEdu] };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleUpdateEducation = (id: string, field: keyof UserEducation, value: string) => {
    const updatedEdu = profile.education.map(edu => {
      if (edu.id === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    setProfile({ ...profile, education: updatedEdu });
  };

  const handleRemoveEducation = (id: string) => {
    const updated = {
      ...profile,
      education: profile.education.filter(e => e.id !== id),
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight mt-1">
              Career Profile Studio
            </h1>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Database className="w-3 h-3 text-emerald-600" />
              <span>Database Synced</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Save your profile to your database once. AI tailors your resume, Gmail pitch, and Telegram DM to every job.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-75 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Saving to Database...</span>
              </>
            ) : isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                <span>Saved to Database</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>

          <button
            onClick={onGoToGenerator}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e0644e] hover:bg-[#d45640] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Application</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Tabs, Right Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-3">
          <div className="sticky top-20 space-y-4">
            <div className="bg-neutral-50/80 rounded-xl border border-neutral-200/80 p-2 space-y-1">
              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  activeTab === 'personal'
                    ? 'bg-white text-neutral-950 font-semibold shadow-xs border border-neutral-200/80'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/60'
                }`}
              >
                <User className="w-4 h-4 text-[#e0644e]" />
                <span>Personal & Contact</span>
              </button>

              <button
                onClick={() => setActiveTab('experience')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  activeTab === 'experience'
                    ? 'bg-white text-neutral-950 font-semibold shadow-xs border border-neutral-200/80'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Work Experience</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/60 text-neutral-700">
                  {profile.experiences.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  activeTab === 'skills'
                    ? 'bg-white text-neutral-950 font-semibold shadow-xs border border-neutral-200/80'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Code className="w-4 h-4 text-emerald-600" />
                  <span>Core Skills</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/60 text-neutral-700">
                  {profile.skills.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('education')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  activeTab === 'education'
                    ? 'bg-white text-neutral-950 font-semibold shadow-xs border border-neutral-200/80'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span>Education</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/60 text-neutral-700">
                  {profile.education.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  activeTab === 'projects'
                    ? 'bg-white text-neutral-950 font-semibold shadow-xs border border-neutral-200/80'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="w-4 h-4 text-amber-600" />
                  <span>Projects</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/60 text-neutral-700">
                  {profile.projects.length}
                </span>
              </button>
            </div>

            {/* Quick AI Tip card — now sticks along with the buttons */}
            <div className="p-3.5 rounded-xl bg-[#e0644e]/5 border border-[#e0644e]/15 text-neutral-700">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#e0644e] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>How AI uses this</span>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-600">
                The AI never fabricates fake companies or fake degrees. It selectively pulls your real achievements and rewrites them using Google's XYZ formula to match the exact requirements of each job posting you submit.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="md:col-span-9 space-y-6">
          {/* TAB 1: PERSONAL & CONTACT */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
              <h2 className="text-base font-bold text-neutral-950 pb-2 border-b border-neutral-100">
                Personal Identification & Contact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                      placeholder="e.g. Alex Rivera"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Target Primary Role / Headline
                  </label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      value={profile.targetRole}
                      onChange={e => setProfile({ ...profile, targetRole: e.target.value })}
                      placeholder="e.g. Staff Fullstack Engineer"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={e => setProfile({ ...profile, email: e.target.value })}
                      placeholder="alex@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Location & Work Preferences
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      value={profile.location}
                      onChange={e => setProfile({ ...profile, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA (Open to Remote / Relocation)"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <h2 className="text-base font-bold text-neutral-950 pt-3 pb-2 border-b border-neutral-100">
                Online Presence & Social Channels (Used in Telegram / DMs)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Telegram Handle
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-3.5 h-3.5 absolute left-3 top-3 text-[#229ED9]" />
                    <input
                      type="text"
                      value={profile.telegramHandle}
                      onChange={e => setProfile({ ...profile, telegramHandle: e.target.value })}
                      placeholder="@username (for 1-click social applications)"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Live Web Resume / Portfolio URL
                  </label>
                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      value={profile.portfolioUrl}
                      onChange={e => setProfile({ ...profile, portfolioUrl: e.target.value })}
                      placeholder="https://cvume.com/@you"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <div className="relative">
                    <ExternalLink className="w-3.5 h-3.5 absolute left-3 top-3 text-[#0a66c2]" />
                    <input
                      type="text"
                      value={profile.linkedinUrl}
                      onChange={e => setProfile({ ...profile, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    GitHub / Code Profile URL
                  </label>
                  <div className="relative">
                    <FolderGit2 className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      value={profile.githubUrl}
                      onChange={e => setProfile({ ...profile, githubUrl: e.target.value })}
                      placeholder="https://github.com/username"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Core Professional Summary / Pitch
                </label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Provide a high-level summary of your career experience, strengths, and leadership philosophy..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: WORK EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-neutral-950">Work Experiences</h2>
                  <p className="text-xs text-neutral-500">Add your previous roles. AI will rewrite and quantify the bullets to match each target job description.</p>
                </div>
                <button
                  onClick={handleAddExperience}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              {profile.experiences.map((exp, expIdx) => (
                <div key={exp.id} className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4 relative group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-600 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={e => handleUpdateExperience(exp.id, 'role', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-600 mb-1">Company / Organization</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={e => handleUpdateExperience(exp.id, 'company', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-600 mb-1">Date Range</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={e => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                            placeholder="e.g. 2021"
                            className="w-24 px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-center"
                          />
                          <span className="text-neutral-400 text-xs">–</span>
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={e => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                            placeholder="Present"
                            className="w-24 px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-center"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-600 mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={e => handleUpdateExperience(exp.id, 'location', e.target.value)}
                          placeholder="e.g. Remote or New York, NY"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bullet points */}
                  <div className="pt-2 border-t border-neutral-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                        Key Accomplishment Bullets
                      </span>
                      <button
                        onClick={() => handleAddBullet(exp.id)}
                        className="text-[11px] font-semibold text-[#e0644e] hover:text-[#c44933] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Bullet</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="text-neutral-300 font-mono text-xs mt-1.5 select-none">•</span>
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={e => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                            className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 text-neutral-800 leading-relaxed"
                          />
                          {exp.bullets.length > 1 && (
                            <button
                              onClick={() => handleRemoveBullet(exp.id, bIdx)}
                              className="p-1 text-neutral-300 hover:text-red-500 rounded cursor-pointer mt-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CORE SKILLS */}
          {activeTab === 'skills' && (
            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
              <div>
                <h2 className="text-base font-bold text-neutral-950">Core Skills & Technologies</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  The AI matches these skills against required keywords found in job posts to maximize your ATS pass rate.
                </p>
              </div>

              {/* Add skill input */}
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  placeholder="Type a skill and press Enter (e.g. Next.js, Kubernetes, System Design)..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </form>

              {/* Skill pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200/80 group"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Suggested quick pills */}
              <div className="pt-4 border-t border-neutral-100">
                <span className="text-[11px] font-medium text-neutral-500 block mb-2">
                  Popular tech stack recommendations (click to add):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['GraphQL', 'FastAPI', 'Rust', 'Kafka', 'Terraform', 'Next.js 15', 'Playwright', 'Jest', 'Supabase', 'LangChain'].map((sug, i) => (
                    !profile.skills.includes(sug) && (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          const updated = { ...profile, skills: [...profile.skills, sug] };
                          setProfile(updated);
                          saveStoredProfile(updated);
                        }}
                        className="text-[11px] px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-dashed border-neutral-300 rounded-md transition-colors cursor-pointer"
                      >
                        + {sug}
                      </button>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EDUCATION */}
          {activeTab === 'education' && (
            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div>
                  <h2 className="text-base font-bold text-neutral-950">Degrees & Certifications</h2>
                  <p className="text-xs text-neutral-500">Academic background and accredited credentials.</p>
                </div>
                <button
                  onClick={handleAddEducation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              {profile.education.map((edu) => (
                <div key={edu.id} className="p-4 rounded-lg border border-neutral-200 flex items-start justify-between gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">Degree / Diploma</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={e => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-200 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">Institution / School</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={e => handleUpdateEducation(edu.id, 'school', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-200 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">Graduation Year</label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={e => handleUpdateEducation(edu.id, 'year', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-200 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-500 rounded cursor-pointer mt-5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div>
                  <h2 className="text-base font-bold text-neutral-950">Featured Projects & Open Source</h2>
                  <p className="text-xs text-neutral-500">Highlight portfolio links, open source packages, and flagship builds.</p>
                </div>
                <button
                  onClick={() => {
                    const newProj: UserProject = {
                      id: `proj-${Date.now()}`,
                      name: 'Flagship Platform / App',
                      description: 'Production-ready system demonstrating high-leverage technical execution.',
                      link: 'https://github.com/you/repo',
                    };
                    const updated = { ...profile, projects: [...profile.projects, newProj] };
                    setProfile(updated);
                    saveStoredProfile(updated);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {profile.projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-lg border border-neutral-200 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-600 mb-1">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={e => {
                            const updatedProjs = profile.projects.map(p => p.id === proj.id ? { ...p, name: e.target.value } : p);
                            setProfile({ ...profile, projects: updatedProjs });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs font-semibold rounded border border-neutral-200 focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-600 mb-1">Project Link / Repo</label>
                        <input
                          type="text"
                          value={proj.link || ''}
                          onChange={e => {
                            const updatedProjs = profile.projects.map(p => p.id === proj.id ? { ...p, link: e.target.value } : p);
                            setProfile({ ...profile, projects: updatedProjs });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-200 focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const updated = { ...profile, projects: profile.projects.filter(p => p.id !== proj.id) };
                        setProfile(updated);
                        saveStoredProfile(updated);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-red-500 rounded cursor-pointer mt-5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1">Description & Impact</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={e => {
                        const updatedProjs = profile.projects.map(p => p.id === proj.id ? { ...p, description: e.target.value } : p);
                        setProfile({ ...profile, projects: updatedProjs });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-200 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Save Reminder */}
          <div className="flex items-center justify-between pt-4 pb-12">
            <span className="text-xs text-neutral-400">
              Changes are saved locally in your browser workspace.
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
              >
                {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
