import React, { useState, useEffect } from 'react';
import { exportElementToPdf } from '../services/pdfExportService';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Check, 
  Palette, 
  Type, 
  Layout, 
  Maximize2, 
  RefreshCw,
  Sparkles,
  Layers,
  Sliders,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  ExternalLink
} from 'lucide-react';
import { UserProfile, ApplicationGenerationResult } from '../types/profile';
import { getStoredProfile, DEFAULT_USER_PROFILE } from '../services/profileService';

export interface ResumeTemplateStudioProps {
  initialResult?: ApplicationGenerationResult | null;
  onBackToStudio: () => void;
  onToast: (msg: string) => void;
}

export type TemplateId = 'modern' | 'executive' | 'split' | 'nordic' | 'compact' | 'accent_banner';

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;     // Headings, primary accents
  secondary: string;   // Subtitles, icons
  accent: string;      // Badges, highlights
  lightBg: string;     // Pill background, sidebar background
  border: string;      // Dividers, pill borders
  text: string;        // Body text
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'slate',
    name: 'Slate Onyx',
    primary: '#0f172a',
    secondary: '#334155',
    accent: '#475569',
    lightBg: '#f8fafc',
    border: '#e2e8f0',
    text: '#1e293b',
  },
  {
    id: 'navy',
    name: 'Midnight Navy',
    primary: '#1e3a8a',
    secondary: '#2563eb',
    accent: '#3b82f6',
    lightBg: '#eff6ff',
    border: '#bfdbfe',
    text: '#1e293b',
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    primary: '#065f46',
    secondary: '#059669',
    accent: '#10b981',
    lightBg: '#ecfdf5',
    border: '#a7f3d0',
    text: '#134e4a',
  },
  {
    id: 'coral',
    name: 'Burnt Coral',
    primary: '#9a3412',
    secondary: '#ea580c',
    accent: '#e0644e',
    lightBg: '#fff7ed',
    border: '#fed7aa',
    text: '#1c1917',
  },
  {
    id: 'plum',
    name: 'Royal Plum',
    primary: '#4c1d95',
    secondary: '#7c3aed',
    accent: '#8b5cf6',
    lightBg: '#f5f3ff',
    border: '#ddd6fe',
    text: '#1e1b4b',
  },
  {
    id: 'ruby',
    name: 'Executive Crimson',
    primary: '#881337',
    secondary: '#be123c',
    accent: '#e11d48',
    lightBg: '#fff1f2',
    border: '#fecdd3',
    text: '#1f2937',
  },
  {
    id: 'teal',
    name: 'Nordic Teal',
    primary: '#0e7490',
    secondary: '#0891b2',
    accent: '#06b6d4',
    lightBg: '#ecfeff',
    border: '#a5f3fc',
    text: '#164e63',
  },
  {
    id: 'charcoal',
    name: 'Pure Monochrome',
    primary: '#111827',
    secondary: '#374151',
    accent: '#4b5563',
    lightBg: '#f9fafb',
    border: '#e5e7eb',
    text: '#1f2937',
  },
];

export const TEMPLATE_OPTIONS: Array<{
  id: TemplateId;
  name: string;
  badge: string;
  description: string;
}> = [
  {
    id: 'modern',
    name: 'Modern Clean',
    badge: 'Popular',
    description: 'Crisp sans-serif, accent timeline bullets, and balanced section spacing.',
  },
  {
    id: 'executive',
    name: 'Executive Serif',
    badge: 'Leadership',
    description: 'Prestigious serif headings, double horizontal rule, centered contact info.',
  },
  {
    id: 'split',
    name: 'Two-Column Split',
    badge: 'Visual',
    description: 'Sidebar for contact, skills & education with a wide main column for experience.',
  },
  {
    id: 'nordic',
    name: 'Nordic Minimal',
    badge: 'Minimalist',
    description: 'Generous whitespace, thin line dividers, and clean monospace date tags.',
  },
  {
    id: 'compact',
    name: 'High-Density ATS',
    badge: '1-Page Fit',
    description: 'Maximized efficiency, sharp dividers, and tight line height for dense metrics.',
  },
  {
    id: 'accent_banner',
    name: 'Contemporary Banner',
    badge: 'Creative',
    description: 'Full-bleed header block with bold inverted typography and left role borders.',
  },
];

export type FontStyle = 'sans' | 'serif' | 'mono';
export type Density = 'standard' | 'compact' | 'spacious';

export const ResumeTemplateStudio: React.FC<ResumeTemplateStudioProps> = ({
  initialResult,
  onBackToStudio,
  onToast,
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => getStoredProfile());
  const [result, setResult] = useState<ApplicationGenerationResult | null>(() => {
    if (initialResult) return initialResult;
    try {
      const cached = localStorage.getItem('cvume_active_export_result');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [selectedColor, setSelectedColor] = useState<ColorTheme>(COLOR_THEMES[0]);
  const [selectedFont, setSelectedFont] = useState<FontStyle>('sans');
  const [selectedDensity, setSelectedDensity] = useState<Density>('standard');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    if (initialResult) {
      setResult(initialResult);
    }
    setProfile(getStoredProfile());
  }, [initialResult]);

  // Fallback demo data if user directly navigates here before generating a job application
  const displayHeadline = result?.resume?.headline || profile.targetRole || 'Senior Full-Stack Engineer / Systems Architect';
  const displaySummary = result?.resume?.summary || profile.bio || 'I am an experienced engineer with proven success delivering resilient, high-impact systems.';
  const displaySkills = result?.resume?.matchedSkills?.length ? result.resume.matchedSkills : profile.skills;
  const displayExperiences = result?.resume?.experiences?.length
    ? result.resume.experiences
    : profile.experiences.map(e => ({
        role: e.role,
        company: e.company,
        period: `${e.startDate} – ${e.endDate}`,
        bullets: e.bullets,
      }));
  const displayProjects = (() => {
    const list = [...(result?.resume?.projects || [])];
    const profileList = profile?.projects || [];
    if (list.length < 5 && profileList.length > 0) {
      const existingNames = new Set(list.map((p: any) => (p?.name || '').toLowerCase().trim()));
      for (const p of profileList) {
        if (list.length >= 5) break;
        if (!existingNames.has((p.name || '').toLowerCase().trim())) {
          list.push(p);
          existingNames.add((p.name || '').toLowerCase().trim());
        }
      }
    }
    return list.length > 0 ? list : profileList;
  })();

  const getProjectLink = (proj: any) => {
    if (proj.link && proj.link.trim()) return proj.link.trim();
    const foundInProfile = profile.projects?.find((p: any) => (p.name || '').toLowerCase() === (proj.name || '').toLowerCase());
    if (foundInProfile?.link && foundInProfile.link.trim()) return foundInProfile.link.trim();
    const foundInDefault = DEFAULT_USER_PROFILE.projects.find((p: any) => (p.name || '').toLowerCase() === (proj.name || '').toLowerCase());
    if (foundInDefault?.link && foundInDefault.link.trim()) return foundInDefault.link.trim();
    const slug = (proj.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `https://github.com/alexrivera-eng/${slug}`;
  };
  const displayEducation = result?.resume?.education?.length ? result.resume.education : profile.education;

  // High-Resolution PDF Export Function
  const handleExportPdf = async () => {
    const element = document.getElementById('export-resume-paper');
    if (!element) {
      onToast('Resume canvas not found.');
      return;
    }

    const candidateName = (profile.fullName || 'Candidate').trim().replace(/\s+/g, '_');
    const filename = `${candidateName}_Resume_${selectedTemplate}.pdf`;

    setIsExportingPdf(true);
    onToast(`Generating ${selectedTemplate.toUpperCase()} vector PDF in ${selectedColor.name}...`);

    try {
      await exportElementToPdf({
        elementId: 'export-resume-paper',
        fileName: filename,
        scale: 2,
        targetWidthPx: 794,
        singlePageTolerance: 1.08,
        onStatusChange: (status) => onToast(status),
      });
      onToast('PDF downloaded successfully!');
    } catch (err) {
      console.error('Error rendering PDF canvas:', err);
      window.print();
      onToast('Opened system print dialog to save as PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const getFontFamilyClass = () => {
    switch (selectedFont) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      default:
        return 'font-sans';
    }
  };

  const getDensityPadding = () => {
    switch (selectedDensity) {
      case 'compact':
        return 'p-4 sm:p-6 md:p-7 space-y-4';
      case 'spacious':
        return 'p-6 sm:p-10 md:p-12 space-y-7';
      default:
        return 'p-5 sm:p-8 md:p-10 space-y-6';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 pb-16">
      {/* Top Bar Navigation & Actions */}
      <div className="sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={onBackToStudio}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer border border-neutral-200 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Back to Studio</span>
              <span className="xs:hidden">Back</span>
            </button>
            <div className="h-4 w-px bg-neutral-200 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                <span>Resume Template & Export Studio</span>
              </h1>
              <p className="text-[10px] sm:text-[11px] text-neutral-500 truncate hidden xs:block">
                Pick a template design and color palette to export your customized resume.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 justify-end shrink-0 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              disabled={isExportingPdf}
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-neutral-100 hover:bg-neutral-200/80 active:scale-98 text-neutral-800 text-xs font-semibold rounded-xl border border-neutral-200 transition-all cursor-pointer"
              title="Print or Save via System Dialog (Exact Vector PDF)"
            >
              <Printer className="w-4 h-4 text-neutral-600" />
              <span className="hidden sm:inline">Print / Vector PDF</span>
              <span className="sm:hidden">Print</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-60 w-full sm:w-auto"
            >
              {isExportingPdf ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#e0644e]" />
                  <span>Rendering PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#e0644e]" />
                  <span className="hidden sm:inline">Download PDF ({selectedColor.name})</span>
                  <span className="sm:hidden">Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Sidebar Customization & Right Live A4 Canvas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: DESIGN CONTROLS */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Template Layouts */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-neutral-500" />
                  <span>1. Select Resume Template</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  {TEMPLATE_OPTIONS.length} designs
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                {TEMPLATE_OPTIONS.map((tpl) => {
                  const isSelected = selectedTemplate === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-50/80 shadow-xs ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-neutral-950 flex items-center gap-2">
                          <span>{tpl.name}</span>
                          <span
                            className="text-[9.5px] font-mono font-medium px-1.5 py-0.5 rounded border"
                            style={{
                              backgroundColor: isSelected ? selectedColor.lightBg : '#f3f4f6',
                              color: isSelected ? selectedColor.primary : '#4b5563',
                              borderColor: isSelected ? selectedColor.border : '#e5e7eb',
                            }}
                          >
                            {tpl.badge}
                          </span>
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Color Palettes */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-neutral-500" />
                  <span>2. Color Palette</span>
                </span>
                <span className="text-[11px] font-medium text-neutral-600">
                  {selectedColor.name}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {COLOR_THEMES.map((theme) => {
                  const isSelected = selectedColor.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedColor(theme)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-50 shadow-xs ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                      title={theme.name}
                    >
                      <div className="w-6 h-6 rounded-full shadow-inner border border-white flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                        {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                      <span className="text-[9.5px] font-medium text-neutral-700 text-center leading-tight truncate w-full">
                        {theme.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Typography & Spacing */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-neutral-500" />
                  <span>3. Typography & Density</span>
                </span>
              </div>

              {/* Font Family */}
              <div>
                <span className="text-[11px] font-bold text-neutral-600 block mb-1.5">
                  Font Pairing
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedFont('sans')}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-sans font-medium transition-all cursor-pointer ${
                      selectedFont === 'sans'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Modern Sans
                  </button>
                  <button
                    onClick={() => setSelectedFont('serif')}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-serif font-medium transition-all cursor-pointer ${
                      selectedFont === 'serif'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Classic Serif
                  </button>
                  <button
                    onClick={() => setSelectedFont('mono')}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer ${
                      selectedFont === 'mono'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Tech Mono
                  </button>
                </div>
              </div>

              {/* Density / Margins */}
              <div>
                <span className="text-[11px] font-bold text-neutral-600 block mb-1.5">
                  Page Spacing / Density
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['compact', 'standard', 'spacious'] as Density[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDensity(d)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs capitalize font-medium transition-all cursor-pointer ${
                        selectedDensity === d
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE A4 RESUME CANVAS */}
          <div className="lg:col-span-8 space-y-4">
            {/* Canvas Header Bar */}
            <div className="bg-white rounded-xl border border-neutral-200 p-3 px-4 flex items-center justify-between shadow-2xs text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span className="font-semibold text-neutral-800">
                  Live Preview: {TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.name} · {selectedColor.name}
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
                A4 Standard (210 × 297mm)
              </span>
            </div>

            {/* THE ACTUAL A4 RESUME DOCUMENT CANVAS (Captured for PDF) */}
            <div className="bg-neutral-100/90 p-2 sm:p-5 rounded-2xl flex justify-center border border-neutral-200/80 overflow-x-auto shadow-inner">
              <div
                id="export-resume-paper"
                className={`bg-white w-full max-w-[800px] text-neutral-900 border-0 rounded-none shadow-none outline-none ${getFontFamilyClass()} ${selectedTemplate === 'accent_banner' ? 'p-0 space-y-0' : getDensityPadding()}`}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#111827',
                  border: 'none',
                  borderRadius: '0px',
                  boxShadow: 'none',
                  outline: 'none',
                }}
              >
              {/* ======================================================== */}
              {/* TEMPLATE 1: MODERN CLEAN */}
              {/* ======================================================== */}
              {selectedTemplate === 'modern' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="border-b pb-5" style={{ borderColor: selectedColor.border }}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: selectedColor.primary }}>
                        {profile.fullName || 'Candidate Name'}
                      </h1>
                      <div className="text-sm font-semibold" style={{ color: selectedColor.secondary }}>
                        {displayHeadline}
                      </div>
                    </div>

                    {/* Contact row */}
                    <div className="text-xs mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-neutral-600">
                      {profile.email && (
                        <a href={`mailto:${profile.email}`} className="hover:underline">
                          {profile.email}
                        </a>
                      )}
                      {profile.phone && (
                        <>
                          <span>•</span>
                          <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="hover:underline">
                            {profile.phone}
                          </a>
                        </>
                      )}
                      {profile.location && (
                        <>
                          <span>•</span>
                          <span>{profile.location}</span>
                        </>
                      )}
                      {profile.portfolioUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={profile.portfolioUrl.startsWith('http') ? profile.portfolioUrl : `https://${profile.portfolioUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium"
                            style={{ color: selectedColor.secondary }}
                          >
                            {profile.portfolioUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </>
                      )}
                      {profile.linkedinUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={profile.linkedinUrl.startsWith('http') ? profile.linkedinUrl : `https://${profile.linkedinUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {profile.linkedinUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                      Professional Summary
                    </h2>
                    <p className="text-xs leading-relaxed text-neutral-700">
                      {displaySummary}
                    </p>
                  </div>

                  {/* Skills */}
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2.5" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                      Core Skills & Technologies
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {displaySkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2.5 py-0.5 rounded font-mono font-medium border"
                          style={{
                            backgroundColor: selectedColor.lightBg,
                            borderColor: selectedColor.border,
                            color: selectedColor.primary,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Professional Experience */}
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-3.5" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                      Professional Experience
                    </h2>
                    <div className="space-y-4">
                      {displayExperiences.map((exp, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-baseline justify-between text-xs font-bold">
                            <span style={{ color: selectedColor.primary }}>
                              {exp.role} <span className="font-normal text-neutral-600">— {exp.company}</span>
                            </span>
                            <span className="text-[11px] font-mono font-normal text-neutral-500">
                              {exp.period}
                            </span>
                          </div>
                          <ul className="space-y-1 text-xs list-disc list-outside pl-4 leading-relaxed text-neutral-700">
                            {exp.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Projects */}
                  {displayProjects?.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2.5" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Key Projects & Engineering Highlights
                      </h2>
                      <div className="space-y-2">
                        {displayProjects.map((p, idx) => {
                          const projectLink = getProjectLink(p);
                          return (
                            <div key={idx} className="text-xs">
                              <div className="font-semibold flex items-center justify-between text-neutral-900">
                                <div className="flex items-center gap-1.5">
                                  <span>{p.name}</span>
                                  {projectLink && (
                                    <a
                                      href={projectLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center transition-transform hover:scale-110 cursor-pointer p-0.5"
                                      style={{ color: selectedColor.primary }}
                                      title={`View ${p.name} live`}
                                    >
                                      <ExternalLink className="w-3 h-3 stroke-[2.2]" />
                                    </a>
                                  )}
                                </div>
                                {(p as any).technologies && (
                                  <span className="text-[10px] font-mono text-neutral-500">
                                    {Array.isArray((p as any).technologies) ? (p as any).technologies.join(', ') : (p as any).technologies}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-600 mt-0.5">{p.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {displayEducation?.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Education
                      </h2>
                      <div className="space-y-1">
                        {displayEducation.map((edu, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-neutral-800">
                            <span className="font-medium">{edu.degree} — {edu.school}</span>
                            <span className="text-[11px] font-mono text-neutral-500">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 2: EXECUTIVE SERIF */}
              {/* ======================================================== */}
              {selectedTemplate === 'executive' && (
                <div className="space-y-6">
                  {/* Header: Centered & Classical */}
                  <div className="text-center pb-4 border-b-2 border-double" style={{ borderColor: selectedColor.primary }}>
                    <h1 className="text-3xl font-serif font-bold tracking-tight" style={{ color: selectedColor.primary }}>
                      {profile.fullName || 'Candidate Name'}
                    </h1>
                    <div className="text-xs font-serif uppercase tracking-widest mt-1 font-semibold text-neutral-700">
                      {displayHeadline}
                    </div>
                    <div className="text-[11px] mt-2 flex flex-wrap items-center justify-center gap-x-3 text-neutral-600 font-sans">
                      {profile.email && (
                        <a href={`mailto:${profile.email}`} className="hover:underline">
                          {profile.email}
                        </a>
                      )}
                      {profile.phone && (
                        <span>
                          | <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="hover:underline">{profile.phone}</a>
                        </span>
                      )}
                      {profile.location && <span>| {profile.location}</span>}
                      {profile.portfolioUrl && (
                        <span>
                          |{' '}
                          <a
                            href={profile.portfolioUrl.startsWith('http') ? profile.portfolioUrl : `https://${profile.portfolioUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium"
                            style={{ color: selectedColor.secondary }}
                          >
                            {profile.portfolioUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </span>
                      )}
                      {profile.linkedinUrl && (
                        <span>
                          |{' '}
                          <a
                            href={profile.linkedinUrl.startsWith('http') ? profile.linkedinUrl : `https://${profile.linkedinUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {profile.linkedinUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-center mb-2 pb-1 border-b" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                      Executive Summary
                    </h2>
                    <p className="text-xs leading-relaxed text-neutral-800 text-justify">
                      {displaySummary}
                    </p>
                  </div>

                  {/* Professional Experience */}
                  <div>
                    <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-center mb-3 pb-1 border-b" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                      Professional Experience
                    </h2>
                    <div className="space-y-4">
                      {displayExperiences.map((exp, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-baseline justify-between text-xs">
                            <span className="font-bold text-neutral-900 font-serif">
                              {exp.role} <span className="font-normal font-sans italic text-neutral-600">, {exp.company}</span>
                            </span>
                            <span className="text-[11px] font-mono text-neutral-500">{exp.period}</span>
                          </div>
                          <ul className="space-y-1 text-xs list-disc list-outside pl-4 leading-relaxed text-neutral-700">
                            {exp.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Core Competencies */}
                  <div>
                    <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-center mb-2 pb-1 border-b" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                      Areas of Expertise & Technical Skills
                    </h2>
                    <p className="text-xs text-neutral-700 leading-relaxed text-center font-sans">
                      {displaySkills.join('  •  ')}
                    </p>
                  </div>

                  {/* Key Projects */}
                  {displayProjects?.length > 0 && (
                    <div>
                      <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-center mb-2 pb-1 border-b" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Key Projects & Technical Highlights
                      </h2>
                      <div className="space-y-2 text-xs">
                        {displayProjects.map((p, idx) => {
                          const projectLink = getProjectLink(p);
                          return (
                            <div key={idx} className="space-y-0.5 text-left">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold font-serif text-neutral-900">{p.name}</span>
                                  {projectLink && (
                                    <a
                                      href={projectLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center transition-transform hover:scale-110 cursor-pointer p-0.5"
                                      style={{ color: selectedColor.primary }}
                                      title={`View ${p.name} live`}
                                    >
                                      <ExternalLink className="w-3 h-3 stroke-[2.2]" />
                                    </a>
                                  )}
                                </div>
                                {(p as any).technologies && (
                                  <span className="text-[10px] font-mono text-neutral-500">
                                    {Array.isArray((p as any).technologies) ? (p as any).technologies.join(', ') : (p as any).technologies}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-700 leading-relaxed">{p.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {displayEducation?.length > 0 && (
                    <div>
                      <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-center mb-2 pb-1 border-b" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Education & Credentials
                      </h2>
                      <div className="space-y-1 text-xs text-center text-neutral-800">
                        {displayEducation.map((edu, idx) => (
                          <div key={idx} className="font-medium">
                            {edu.degree} — {edu.school} ({edu.year})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 3: TWO-COLUMN SPLIT */}
              {/* ======================================================== */}
              {selectedTemplate === 'split' && (
                <div className="grid grid-cols-12 gap-6">
                  {/* Left Column (Sidebar) */}
                  <div className="col-span-4 border-r pr-5 space-y-5" style={{ borderColor: selectedColor.border }}>
                    {/* Candidate Name & Title */}
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight" style={{ color: selectedColor.primary }}>
                        {profile.fullName || 'Candidate Name'}
                      </h1>
                      <div className="text-xs font-semibold mt-1" style={{ color: selectedColor.secondary }}>
                        {displayHeadline}
                      </div>
                    </div>

                    {/* Contact List */}
                    <div className="space-y-2 text-[11px] text-neutral-700">
                      <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: selectedColor.primary }}>
                        Contact & Links
                      </span>
                      {profile.email && (
                        <div className="break-all">
                          <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a>
                        </div>
                      )}
                      {profile.phone && (
                        <div>
                          <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="hover:underline">{profile.phone}</a>
                        </div>
                      )}
                      {profile.location && <div>{profile.location}</div>}
                      {profile.portfolioUrl && (
                        <div className="break-all font-medium">
                          <a
                            href={profile.portfolioUrl.startsWith('http') ? profile.portfolioUrl : `https://${profile.portfolioUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                            style={{ color: selectedColor.secondary }}
                          >
                            {profile.portfolioUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                      {profile.linkedinUrl && (
                        <div className="break-all">
                          <a
                            href={profile.linkedinUrl.startsWith('http') ? profile.linkedinUrl : `https://${profile.linkedinUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {profile.linkedinUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Skills Column */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: selectedColor.primary }}>
                        Core Skills
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {displaySkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10.5px] px-2 py-0.5 rounded font-mono font-medium border"
                            style={{
                              backgroundColor: selectedColor.lightBg,
                              borderColor: selectedColor.border,
                              color: selectedColor.primary,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Education Column */}
                    {displayEducation?.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: selectedColor.primary }}>
                          Education
                        </span>
                        <div className="space-y-1.5 text-xs text-neutral-800">
                          {displayEducation.map((edu, idx) => (
                            <div key={idx}>
                              <div className="font-semibold text-[11px]">{edu.degree}</div>
                              <div className="text-[10px] text-neutral-500">{edu.school} · {edu.year}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column (Main Experience & Summary) */}
                  <div className="col-span-8 space-y-5">
                    {/* Summary */}
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Profile Overview
                      </h2>
                      <p className="text-xs leading-relaxed text-neutral-700">
                        {displaySummary}
                      </p>
                    </div>

                    {/* Experience Timeline */}
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-3" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Professional Experience
                      </h2>
                      <div className="space-y-4">
                        {displayExperiences.map((exp, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-baseline justify-between text-xs font-bold">
                              <span style={{ color: selectedColor.primary }}>
                                {exp.role} <span className="font-normal text-neutral-600">— {exp.company}</span>
                              </span>
                              <span className="text-[10.5px] font-mono font-normal text-neutral-500">
                                {exp.period}
                              </span>
                            </div>
                            <ul className="space-y-1 text-xs list-disc list-outside pl-4 leading-relaxed text-neutral-700">
                              {exp.bullets.map((b, bIdx) => (
                                <li key={bIdx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Projects */}
                    {displayProjects?.length > 0 && (
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                          Projects
                        </h2>
                        <div className="space-y-2">
                          {displayProjects.map((p, idx) => {
                            const projectLink = getProjectLink(p);
                            return (
                              <div key={idx} className="text-xs">
                                <div className="font-semibold text-neutral-900 flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span>{p.name}</span>
                                    {projectLink && (
                                      <a
                                        href={projectLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center transition-transform hover:scale-110 cursor-pointer p-0.5"
                                        style={{ color: selectedColor.primary }}
                                        title={`View ${p.name} live`}
                                      >
                                        <ExternalLink className="w-3 h-3 stroke-[2.2]" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                                <p className="text-[11px] text-neutral-600">{p.description}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 4: NORDIC MINIMAL */}
              {/* ======================================================== */}
              {selectedTemplate === 'nordic' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: selectedColor.border }}>
                    <div>
                      <h1 className="text-3xl font-light tracking-tight text-neutral-950">
                        {profile.fullName || 'Candidate Name'}
                      </h1>
                      <div className="text-xs font-medium tracking-wide mt-1 uppercase" style={{ color: selectedColor.primary }}>
                        {displayHeadline}
                      </div>
                    </div>
                    <div className="text-right text-[11px] font-mono text-neutral-500 space-y-0.5">
                      {profile.email && (
                        <div>
                          <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a>
                        </div>
                      )}
                      {profile.phone && (
                        <div>
                          <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="hover:underline">{profile.phone}</a>
                        </div>
                      )}
                      {profile.location && <div>{profile.location}</div>}
                      {profile.portfolioUrl && (
                        <div>
                          <a
                            href={profile.portfolioUrl.startsWith('http') ? profile.portfolioUrl : `https://${profile.portfolioUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium"
                            style={{ color: selectedColor.secondary }}
                          >
                            {profile.portfolioUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="border-l-2 pl-3" style={{ borderColor: selectedColor.primary }}>
                    <p className="text-xs leading-relaxed text-neutral-700">
                      {displaySummary}
                    </p>
                  </div>

                  {/* Skills Tag Cloud */}
                  <div>
                    <h2 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      // Core Competencies
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {displaySkills.map((s, idx) => (
                        <span key={idx} className="text-[11px] font-mono px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h2 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
                      // Professional Track Record
                    </h2>
                    <div className="space-y-4">
                      {displayExperiences.map((exp, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-neutral-900">
                              {exp.role} <span className="font-normal text-neutral-500">at {exp.company}</span>
                            </span>
                            <span className="text-[10px] font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">
                              {exp.period}
                            </span>
                          </div>
                          <ul className="space-y-1 text-xs list-disc list-outside pl-4 text-neutral-700">
                            {exp.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Projects */}
                  {displayProjects?.length > 0 && (
                    <div>
                      <h2 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                        // Key Projects & Open Source
                      </h2>
                      <div className="space-y-2">
                        {displayProjects.map((p, idx) => {
                          const projectLink = getProjectLink(p);
                          return (
                            <div key={idx} className="space-y-0.5">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-neutral-900">{p.name}</span>
                                  {projectLink && (
                                    <a
                                      href={projectLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center transition-transform hover:scale-110 cursor-pointer p-0.5"
                                      style={{ color: selectedColor.primary }}
                                      title={`View ${p.name} live`}
                                    >
                                      <ExternalLink className="w-3 h-3 stroke-[2.2]" />
                                    </a>
                                  )}
                                </div>
                                {(p as any).technologies && (
                                  <span className="text-[10px] font-mono text-neutral-400">
                                    {Array.isArray((p as any).technologies) ? (p as any).technologies.join(', ') : (p as any).technologies}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-600">{p.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {displayEducation?.length > 0 && (
                    <div>
                      <h2 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                        // Education
                      </h2>
                      <div className="space-y-1 text-xs text-neutral-800">
                        {displayEducation.map((edu, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{edu.degree} — {edu.school}</span>
                            <span className="font-mono text-[11px] text-neutral-500">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 5: COMPACT HIGH-DENSITY ATS */}
              {/* ======================================================== */}
              {selectedTemplate === 'compact' && (
                <div className="space-y-3.5 text-xs">
                  {/* Top Header */}
                  <div className="border-b pb-2 text-center" style={{ borderColor: '#e5e7eb' }}>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
                      {profile.fullName || 'Candidate Name'}
                    </h1>
                    <div className="text-xs font-semibold text-neutral-700 mt-0.5">
                      {displayHeadline}
                    </div>
                    <div className="text-[10.5px] mt-1 text-neutral-600 font-sans flex items-center justify-center gap-2 flex-wrap">
                      {profile.email && (
                        <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a>
                      )}
                      {profile.phone && (
                        <span>
                          • <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="hover:underline">{profile.phone}</a>
                        </span>
                      )}
                      {profile.location && <span>• {profile.location}</span>}
                      {profile.portfolioUrl && (
                        <span>
                          •{' '}
                          <a
                            href={profile.portfolioUrl.startsWith('http') ? profile.portfolioUrl : `https://${profile.portfolioUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium"
                            style={{ color: selectedColor.primary }}
                          >
                            {profile.portfolioUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </span>
                      )}
                      {profile.linkedinUrl && (
                        <span>
                          •{' '}
                          <a
                            href={profile.linkedinUrl.startsWith('http') ? profile.linkedinUrl : `https://${profile.linkedinUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {profile.linkedinUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h2 className="text-[11px] font-bold uppercase tracking-wider pb-0.5 border-b mb-1 text-neutral-900">
                      Professional Summary
                    </h2>
                    <p className="text-[11px] leading-snug text-neutral-800">
                      {displaySummary}
                    </p>
                  </div>

                  {/* Technical Skills */}
                  <div>
                    <h2 className="text-[11px] font-bold uppercase tracking-wider pb-0.5 border-b mb-1 text-neutral-900">
                      Technical Skills & Competencies
                    </h2>
                    <p className="text-[11px] text-neutral-800 font-mono leading-relaxed">
                      {displaySkills.join('  •  ')}
                    </p>
                  </div>

                  {/* Experience */}
                  <div>
                    <h2 className="text-[11px] font-bold uppercase tracking-wider pb-0.5 border-b mb-1.5 text-neutral-900">
                      Professional Experience
                    </h2>
                    <div className="space-y-2.5">
                      {displayExperiences.map((exp, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between font-bold text-[11px] text-neutral-950">
                            <span>{exp.role} — <span className="font-medium text-neutral-700">{exp.company}</span></span>
                            <span className="font-mono text-[10px] text-neutral-600">{exp.period}</span>
                          </div>
                          <ul className="list-disc list-outside pl-4 text-[11px] leading-tight text-neutral-800 space-y-0.5 mt-0.5">
                            {exp.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Projects */}
                  {displayProjects?.length > 0 && (
                    <div>
                      <h2 className="text-[11px] font-bold uppercase tracking-wider pb-0.5 border-b mb-1 text-neutral-900">
                        Technical Highlights & Projects
                      </h2>
                      <div className="space-y-1">
                        {displayProjects.map((p, idx) => {
                          const projectLink = getProjectLink(p);
                          return (
                            <div key={idx} className="text-[11px]">
                              <span className="font-semibold">{p.name}</span>
                              {projectLink && (
                                <a
                                  href={projectLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center align-middle ml-1 transition-transform hover:scale-110 cursor-pointer"
                                  style={{ color: selectedColor.primary }}
                                  title={`View ${p.name} live`}
                                >
                                  <ExternalLink className="w-2.5 h-2.5 stroke-[2.2]" />
                                </a>
                              )}
                              <span>: </span>
                              <span className="text-neutral-700">{p.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {displayEducation?.length > 0 && (
                    <div>
                      <h2 className="text-[11px] font-bold uppercase tracking-wider pb-0.5 border-b mb-1 text-neutral-900">
                        Education
                      </h2>
                      <div className="space-y-0.5 text-[11px]">
                        {displayEducation.map((edu, idx) => (
                          <div key={idx} className="flex justify-between text-neutral-800">
                            <span>{edu.degree} — {edu.school}</span>
                            <span className="font-mono text-[10px] text-neutral-600">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 6: CONTEMPORARY ACCENT BANNER */}
              {/* ======================================================== */}
              {selectedTemplate === 'accent_banner' && (
                <div className="w-full">
                  {/* Top Colored Banner - Edge-to-edge full bleed */}
                  <div
                    className="p-6 sm:p-8 rounded-none w-full"
                    style={{ backgroundColor: selectedColor.primary, color: '#ffffff' }}
                  >
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                      {profile.fullName || 'Candidate Name'}
                    </h1>
                    <div className="text-sm font-medium mt-1 text-white/90">
                      {displayHeadline}
                    </div>
                    <div className="text-[11px] mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-white/90 font-sans">
                      {profile.email && (
                        <a href={`mailto:${profile.email}`} className="hover:underline text-white font-medium">
                          {profile.email}
                        </a>
                      )}
                      {profile.phone && (
                        <span>
                          •{' '}
                          <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="hover:underline text-white">
                            {profile.phone}
                          </a>
                        </span>
                      )}
                      {profile.location && <span>• {profile.location}</span>}
                      {profile.portfolioUrl && (
                        <span>
                          •{' '}
                          <a
                            href={profile.portfolioUrl.startsWith('http') ? profile.portfolioUrl : `https://${profile.portfolioUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-white font-bold underline underline-offset-2"
                          >
                            {profile.portfolioUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </span>
                      )}
                      {profile.linkedinUrl && (
                        <span>
                          •{' '}
                          <a
                            href={profile.linkedinUrl.startsWith('http') ? profile.linkedinUrl : `https://${profile.linkedinUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-white"
                          >
                            {profile.linkedinUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={getDensityPadding()}>
                    {/* Summary */}
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Professional Summary
                      </h2>
                      <p className="text-xs leading-relaxed text-neutral-700">
                        {displaySummary}
                      </p>
                    </div>

                    {/* Skills Chips */}
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2.5" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Core Skills & Technologies
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {displaySkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2.5 py-0.5 rounded font-medium border"
                            style={{
                              backgroundColor: selectedColor.lightBg,
                              borderColor: selectedColor.border,
                              color: selectedColor.primary,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Experience with Accent Left Callouts */}
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-3.5" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Professional Experience
                      </h2>
                      <div className="space-y-4">
                        {displayExperiences.map((exp, idx) => (
                          <div
                            key={idx}
                            className="pl-3.5 border-l-2 space-y-1.5"
                            style={{ borderColor: selectedColor.secondary }}
                          >
                            <div className="flex items-baseline justify-between text-xs font-bold">
                              <span style={{ color: selectedColor.primary }}>
                                {exp.role} <span className="font-normal text-neutral-600">— {exp.company}</span>
                              </span>
                              <span className="text-[11px] font-mono font-normal text-neutral-500">
                                {exp.period}
                              </span>
                            </div>
                            <ul className="space-y-1 text-xs list-disc list-outside pl-4 leading-relaxed text-neutral-700">
                              {exp.bullets.map((b, bIdx) => (
                                <li key={bIdx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projects */}
                    {displayProjects?.length > 0 && (
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2.5" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                          Projects
                        </h2>
                        <div className="space-y-2">
                          {displayProjects.map((p, idx) => {
                            const projectLink = getProjectLink(p);
                            return (
                              <div key={idx} className="text-xs">
                                <div className="font-semibold text-neutral-900 flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span>{p.name}</span>
                                    {projectLink && (
                                      <a
                                        href={projectLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center transition-transform hover:scale-110 cursor-pointer p-0.5"
                                        style={{ color: selectedColor.primary }}
                                        title={`View ${p.name} live`}
                                      >
                                        <ExternalLink className="w-3 h-3 stroke-[2.2]" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                                <p className="text-[11px] text-neutral-600">{p.description}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {displayEducation?.length > 0 && (
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                          Education
                        </h2>
                        <div className="space-y-1">
                          {displayEducation.map((edu, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs text-neutral-800">
                              <span className="font-medium">{edu.degree} — {edu.school}</span>
                              <span className="text-[11px] font-mono text-neutral-500">{edu.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
