import React, { useState } from 'react';
import { exportElementToPdf } from '../services/pdfExportService';
import { 
  FileText, 
  Briefcase, 
  Sparkles, 
  Sliders, 
  ChevronDown, 
  Plus, 
  X,
  CheckCircle2,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';
import { 
  ExperienceItem, 
  SectionItem, 
  INITIAL_SECTIONS, 
  INITIAL_EXPERIENCE, 
  COLOR_STYLES 
} from '../types/resume';
import { getStoredProfile } from '../services/profileService';
import { UserProfile } from '../types/profile';

interface HeroResumeWindowProps {
  onBulletClick?: (bulletText: string) => void;
}

export const HeroResumeWindow: React.FC<HeroResumeWindowProps> = ({ onBulletClick }) => {
  const [profile, setProfile] = useState<UserProfile>(() => getStoredProfile());
  const [sections, setSections] = useState<SectionItem[]>(INITIAL_SECTIONS);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(INITIAL_EXPERIENCE);
  const [activeTemplate, setActiveTemplate] = useState<'modern' | 'minimal' | 'executive'>('modern');
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [selectedExp, setSelectedExp] = useState<ExperienceItem | null>(null);
  const [editingBullet, setEditingBullet] = useState<{ expId: string; bulletId: string; text: string } | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Keep synced with profile changes in local storage or profile edits
  React.useEffect(() => {
    setProfile(getStoredProfile());
  }, []);

  const handleExportPdf = async () => {
    const el = document.getElementById('hero-resume-paper-to-export');
    if (!el) return;
    setIsExportingPdf(true);
    try {
      const pdfFileName = `${(profile.fullName || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`;
      await exportElementToPdf({
        elementId: 'hero-resume-paper-to-export',
        fileName: pdfFileName,
        scale: 2,
        targetWidthPx: 794,
        singlePageTolerance: 1.08,
      });
    } catch (e) {
      console.error('PDF export error:', e);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, count: s.count > 0 ? 0 : 3 } : s));
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) {
      setAddingSection(false);
      return;
    }
    const newSec: SectionItem = {
      id: Date.now().toString(),
      title: newSectionTitle.trim(),
      count: 1,
      category: 'core',
    };
    setSections(prev => [...prev, newSec]);
    setNewSectionTitle('');
    setAddingSection(false);
  };

  const handleSaveBullet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBullet) return;
    setExperiences(prev => prev.map(exp => {
      if (exp.id !== editingBullet.expId) return exp;
      return {
        ...exp,
        bullets: exp.bullets.map(b => b.id === editingBullet.bulletId ? { ...b, text: editingBullet.text } : b)
      };
    }));
    setEditingBullet(null);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-white rounded-2xl border border-neutral-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden select-none">
      {/* Window Title Bar */}
      <div className="h-10 bg-neutral-50/90 border-b border-neutral-200/70 px-3 sm:px-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-2xs" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 shadow-2xs" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-2xs" />
        </div>
        <div className="text-xs font-medium text-neutral-500 font-sans tracking-tight flex items-center gap-1.5 truncate min-w-0">
          <FileText className="w-3 h-3 text-neutral-400 shrink-0" />
          <span className="truncate">CVUME — Resume Studio</span>
          <span className="hidden sm:inline text-neutral-400">(ATS Optimized)</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400 text-xs shrink-0">
          <button 
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="hover:text-neutral-900 transition-colors flex items-center gap-1.5 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200/80 px-2 sm:px-2.5 py-1 rounded-md text-neutral-800 cursor-pointer disabled:opacity-50" 
            title="Download PDF as displayed"
          >
            {isExportingPdf ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#e0644e]" />
                <span>PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#e0644e]" />
                <span className="hidden xs:inline sm:inline">Export PDF</span>
                <span className="xs:hidden sm:hidden">PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-col md:flex-row min-h-[580px] bg-white">
        {/* Left Sidebar */}
        <div className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-neutral-100 p-4 flex flex-col justify-between bg-white text-xs">
          <div>
            {/* Nav Icon Bar */}
            <div className="flex items-center gap-3 text-neutral-400 mb-6 pb-2 border-b border-neutral-100">
              <button className="text-neutral-900 p-1 rounded hover:bg-neutral-100 transition-colors" title="Resume Content">
                <FileText className="w-4 h-4" />
              </button>
              <button className="text-neutral-500 p-1 rounded hover:bg-neutral-100 transition-colors" title="Work Experience">
                <Briefcase className="w-4 h-4" />
              </button>
              <button className="text-neutral-500 p-1 rounded hover:bg-neutral-100 transition-colors" title="AI Tailor">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </button>
              <button className="text-neutral-500 p-1 rounded hover:bg-neutral-100 transition-colors" title="Layout & Margins">
                <Sliders className="w-4 h-4" />
              </button>
            </div>

            {/* Sections Management */}
            <div className="mb-6">
              <div className="text-[11px] font-semibold text-neutral-500 mb-2.5 uppercase tracking-wider">
                Resume Sections
              </div>
              <ul className="space-y-2">
                {sections.filter(s => s.category === 'core').map(sec => (
                  <li 
                    key={sec.id}
                    onClick={() => toggleSection(sec.id)}
                    className="flex items-center justify-between group cursor-pointer text-neutral-700 hover:text-neutral-950 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div 
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          sec.count > 0 
                            ? sec.isRedBullet 
                              ? 'border-red-400 bg-red-400' 
                              : 'bg-neutral-800 border-neutral-800' 
                            : 'border-neutral-300'
                        }`}
                      >
                        {sec.count > 0 && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-[12px] leading-tight truncate select-none ${sec.count === 0 ? 'line-through text-neutral-400' : ''}`}>
                        {sec.title}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Add Section Input/Button */}
              {addingSection ? (
                <form onSubmit={handleAddSection} className="mt-2.5">
                  <input
                    type="text"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="e.g. Volunteer Experience..."
                    autoFocus
                    className="w-full text-[12px] px-2 py-1 border border-neutral-300 rounded focus:outline-neutral-800"
                    onBlur={() => { if (!newSectionTitle) setAddingSection(false); }}
                  />
                </form>
              ) : (
                <button 
                  onClick={() => setAddingSection(true)}
                  className="mt-2.5 flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add a section</span>
                </button>
              )}
            </div>

            {/* Target Role Match */}
            <div>
              <div className="text-[11px] font-semibold text-neutral-500 mb-2.5 uppercase tracking-wider">
                Job Tailoring
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-900">
                    <span>Staff Engineer @ Stripe</span>
                    <span className="text-emerald-700">96%</span>
                  </div>
                  <span className="text-[10px] text-emerald-700/80 block mt-0.5">
                    14 keywords matched · 0 critical gaps
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200/60 hover:bg-neutral-100/60 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-800">
                    <span>Senior UX Lead @ Figma</span>
                    <span className="text-neutral-600 font-mono">92%</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    Click to tailor bullets for Figma
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-400">
            Press <kbd className="px-1 py-0.5 bg-neutral-100 rounded text-neutral-600 font-mono">E</kbd> to add bullet points
          </div>
        </div>

        {/* Right Live Resume Sheet */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#fbfbfb]">
          {/* Document Header Controls */}
          <div className="min-h-12 border-b border-neutral-100 px-3 sm:px-6 py-2 sm:py-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 shrink-0 bg-white">
            <div className="flex items-center gap-2 cursor-pointer group min-w-0">
              <span className="font-semibold text-xs sm:text-sm text-neutral-900 group-hover:text-black truncate max-w-[180px] sm:max-w-none">
                {profile.fullName || 'Candidate'} · Master Resume
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 shrink-0" />
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[11px] sm:text-xs font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span><span className="hidden xs:inline">ATS Score: </span>98/100</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-medium text-neutral-700 hover:text-neutral-950 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors"
                >
                  <span className="capitalize">{activeTemplate} Template</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {templateDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-20 text-xs">
                    <button 
                      onClick={() => { setActiveTemplate('modern'); setTemplateDropdownOpen(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-700 font-medium"
                    >
                      Modern Tech
                    </button>
                    <button 
                      onClick={() => { setActiveTemplate('minimal'); setTemplateDropdownOpen(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-700"
                    >
                      Minimal ATS
                    </button>
                    <button 
                      onClick={() => { setActiveTemplate('executive'); setTemplateDropdownOpen(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-700"
                    >
                      Executive Serif
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actual Resume Document Paper */}
          <div className="p-3 sm:p-6 overflow-y-auto max-h-[500px]">
            <div 
              id="hero-resume-paper-to-export"
              className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6 md:p-8 shadow-xs max-w-2xl mx-auto space-y-6"
              style={{ backgroundColor: '#ffffff', color: '#111827' }}
            >
              {/* Header Details */}
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
                  {profile.fullName || 'Candidate Profile'}
                </h2>
                <p className="text-xs font-semibold text-neutral-700 mt-0.5">
                  {profile.targetRole || 'Staff Systems Engineer'}
                </p>
                <div className="flex items-center gap-2 sm:gap-3 text-[10.5px] sm:text-[11px] text-neutral-500 mt-2 flex-wrap font-sans">
                  <span>{profile.location || 'Remote'}</span>
                  <span>·</span>
                  <span>{profile.email || 'hello@cvume.ai'}</span>
                  {profile.linkedinUrl && (
                    <>
                      <span>·</span>
                      <span>{profile.linkedinUrl.replace(/^https?:\/\//, '')}</span>
                    </>
                  )}
                  {profile.githubUrl && (
                    <>
                      <span>·</span>
                      <span>{profile.githubUrl.replace(/^https?:\/\//, '')}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Work Experience Section */}
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Work Experience
                  </h3>
                  <span className="text-[10px] text-neutral-400">3 roles · 8+ yrs</span>
                </div>

                <div className="space-y-4">
                  {experiences.map((exp) => {
                    const colors = COLOR_STYLES[exp.colorTheme] || COLOR_STYLES.purple;
                    return (
                      <div 
                        key={exp.id}
                        onClick={() => setSelectedExp(exp)}
                        className="p-3 rounded-lg border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50 transition-all cursor-pointer group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-2">
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-neutral-900">
                              {exp.role}
                            </span>
                            <span className="text-xs text-neutral-600 font-medium"> · {exp.company}</span>
                          </div>
                          <span className="text-[10px] sm:text-[10.5px] font-mono text-neutral-400 shrink-0">
                            {exp.period}
                          </span>
                        </div>

                        {/* Bullets */}
                        <ul className="mt-2 space-y-1.5">
                          {exp.bullets.map((b) => (
                            <li 
                              key={b.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingBullet({ expId: exp.id, bulletId: b.id, text: b.text });
                                if (onBulletClick) onBulletClick(b.text);
                              }}
                              className="text-xs text-neutral-600 leading-relaxed flex items-start gap-1.5 hover:text-neutral-950 transition-colors"
                            >
                              <span className="text-neutral-400 mt-1">•</span>
                              <span>{b.text}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Tag Pills */}
                        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                          {exp.tags.map(tag => (
                            <span 
                              key={tag}
                              className={`text-[9.5px] font-medium px-2 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Core Competencies & Skills */}
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Core Technical & Design Competencies
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {[
                    'Design Systems Tokens', 
                    'TypeScript', 
                    'WCAG 2.1 AA Compliance', 
                    'Next.js & React 19', 
                    'Figma & Auto Layout', 
                    'A/B Experimentation', 
                    'Microfrontends', 
                    'Tailwind CSS',
                    'REST & GraphQL APIs',
                    'Developer Experience'
                  ].map(skill => (
                    <span 
                      key={skill}
                      className="px-2 py-1 rounded bg-neutral-100 text-neutral-700 text-[10.5px] font-medium border border-neutral-200/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Bullet Modal */}
      {editingBullet && (
        <div 
          onClick={() => setEditingBullet(null)}
          className="absolute inset-0 bg-neutral-900/20 backdrop-blur-2xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-xl shadow-xl border border-neutral-200 p-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h4 className="font-semibold text-neutral-900 text-sm">Polish Bullet Point (XYZ Format)</h4>
              </div>
              <button 
                onClick={() => setEditingBullet(null)}
                className="text-neutral-400 hover:text-neutral-600 rounded p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSaveBullet} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Bullet Text (Accomplished [X], measured by [Y], by doing [Z])
                </label>
                <textarea
                  rows={3}
                  value={editingBullet.text}
                  onChange={e => setEditingBullet({ ...editingBullet, text: e.target.value })}
                  autoFocus
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-md focus:outline-neutral-900 font-sans leading-relaxed"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-100 text-[11px] text-purple-900">
                <span className="font-semibold">AI Recommendation:</span> Strong action verbs like "Architected" or "Spearheaded" paired with explicit percentages boost recruiter pass-rates by 43%.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBullet(null)}
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 cursor-pointer"
                >
                  Save Bullet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
