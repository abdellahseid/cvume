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
  ExternalLink,
  Terminal,
  Grid,
  BookOpen,
  Sidebar
} from 'lucide-react';
import { UserProfile, ApplicationGenerationResult } from '../types/profile';
import { getStoredProfile, DEFAULT_USER_PROFILE } from '../services/profileService';

export interface ResumeTemplateStudioProps {
  initialResult?: ApplicationGenerationResult | null;
  onBackToStudio: () => void;
  onToast: (msg: string) => void;
}

export type TemplateId = 
  | 'modern' 
  | 'executive' 
  | 'split' 
  | 'nordic' 
  | 'compact' 
  | 'accent_banner'
  | 'developer'
  | 'swiss'
  | 'elegant_ivy'
  | 'minimal_stripe';

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

export interface TemplateOption {
  id: TemplateId;
  name: string;
  badge: string;
  category: 'all' | 'tech' | 'executive' | 'ats' | 'creative';
  description: string;
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'modern',
    name: 'Modern Clean',
    badge: 'Popular',
    category: 'tech',
    description: 'Crisp sans-serif, accent timeline bullets, and balanced section spacing.',
  },
  {
    id: 'developer',
    name: 'Silicon Valley Pro',
    badge: 'Tech Lead',
    category: 'tech',
    description: 'Developer console styling, full project cards with live links and tech badges.',
  },
  {
    id: 'executive',
    name: 'Executive Serif',
    badge: 'Leadership',
    category: 'executive',
    description: 'Prestigious serif headings, double horizontal rule, centered contact header.',
  },
  {
    id: 'split',
    name: 'Two-Column Split',
    badge: 'Visual',
    category: 'creative',
    description: 'Sidebar for contact, skills & education with a wide main column for experience.',
  },
  {
    id: 'swiss',
    name: 'Swiss International',
    badge: 'Architectural',
    category: 'creative',
    description: 'Asymmetric 2-column modernist grid with clean lines and high-contrast typography.',
  },
  {
    id: 'nordic',
    name: 'Nordic Minimal',
    badge: 'Minimalist',
    category: 'ats',
    description: 'Generous whitespace, thin line dividers, and clean monospace date tags.',
  },
  {
    id: 'compact',
    name: 'High-Density ATS',
    badge: '1-Page Fit',
    category: 'ats',
    description: 'Maximized efficiency, sharp dividers, and tight line height for dense metrics.',
  },
  {
    id: 'elegant_ivy',
    name: 'Ivy League Academic',
    badge: 'Classic',
    category: 'executive',
    description: 'Refined roman letterhead, formal rule styling, publication and project layout.',
  },
  {
    id: 'minimal_stripe',
    name: 'Metro Accent Rail',
    badge: 'Corporate',
    category: 'creative',
    description: 'Solid left vertical accent rail, high-contrast sections, and prominent project cards.',
  },
  {
    id: 'accent_banner',
    name: 'Contemporary Banner',
    badge: 'Creative',
    category: 'creative',
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
  const [templateCategory, setTemplateCategory] = useState<'all' | 'tech' | 'executive' | 'ats' | 'creative'>('all');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    if (initialResult) {
      setResult(initialResult);
    }
    setProfile(getStoredProfile());
  }, [initialResult]);

  // Candidate Data Resolution
  const displayHeadline = result?.resume?.headline || profile.targetRole || 'Senior Full-Stack Engineer / Systems Architect';
  const displaySummary = result?.resume?.summary || profile.bio || 'Experienced engineer with proven success delivering resilient, high-impact systems.';
  const displaySkills = result?.resume?.matchedSkills?.length ? result.resume.matchedSkills : profile.skills;
  const displayExperiences = result?.resume?.experiences?.length
    ? result.resume.experiences
    : profile.experiences.map(e => ({
        role: e.role,
        company: e.company,
        period: `${e.startDate} – ${e.endDate}`,
        bullets: e.bullets,
      }));

  // Ensure ALL candidate projects from result and profile are combined completely without truncation
  const displayProjects = (() => {
    const resultProjects = Array.isArray(result?.resume?.projects) ? result.resume.projects : [];
    const profileProjects = Array.isArray(profile?.projects) ? profile.projects : [];
    const combined: any[] = [...resultProjects];
    const existingNames = new Set(combined.map((p: any) => (p?.name || '').toLowerCase().trim()));

    for (const p of profileProjects) {
      const pName = (p?.name || '').toLowerCase().trim();
      if (pName && !existingNames.has(pName)) {
        combined.push(p);
        existingNames.add(pName);
      }
    }

    if (combined.length === 0) {
      return DEFAULT_USER_PROFILE.projects;
    }
    return combined;
  })();

  const getProjectLink = (proj: any) => {
    if (proj.link && proj.link.trim()) return proj.link.trim();
    const foundInProfile = profile.projects?.find((p: any) => (p.name || '').toLowerCase() === (proj.name || '').toLowerCase());
    if (foundInProfile?.link && foundInProfile.link.trim()) return foundInProfile.link.trim();
    const foundInDefault = DEFAULT_USER_PROFILE.projects.find((p: any) => (p.name || '').toLowerCase() === (proj.name || '').toLowerCase());
    if (foundInDefault?.link && foundInDefault.link.trim()) return foundInDefault.link.trim();
    const slug = (proj.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (profile.githubUrl && profile.githubUrl.trim()) {
      return `${profile.githubUrl.replace(/\/$/, '')}/${slug}`;
    }
    return '';
  };

  const normalizeUrl = (url?: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed.replace(/^\/\//, '')}`;
  };

  const displayEducation = result?.resume?.education?.length ? result.resume.education : profile.education;

  // Filter templates by category
  const filteredTemplates = TEMPLATE_OPTIONS.filter(t => {
    if (templateCategory === 'all') return true;
    return t.category === templateCategory;
  });

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
    onToast('Rendering high-resolution vector PDF document...');

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

  /**
   * Reusable Project Item Renderer for Templates
   * Guarantees all projects are displayed with their link and description
   */
  const renderProjectItem = (p: any, idx: number, options?: { border?: boolean; bg?: boolean }) => {
    const projectLink = getProjectLink(p);

    return (
      <div 
        key={idx} 
        data-pdf-block="true"
        className={`pdf-item-block text-xs space-y-1 ${
          options?.bg ? 'p-3 rounded-xl bg-neutral-50/70 border border-neutral-200/80' : ''
        } ${options?.border ? 'pb-2.5 border-b border-neutral-100 last:border-b-0' : ''}`}
      >
        <div className="font-semibold flex flex-wrap items-center justify-between gap-2 text-neutral-900">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-neutral-900">{p.name}</span>
            {projectLink && (
              <a
                href={projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-1 -m-1 rounded hover:opacity-80 transition-opacity cursor-pointer"
                style={{ color: selectedColor.primary }}
                title={`Open ${p.name} live project in new tab (${projectLink})`}
                aria-label={`Open project ${p.name} in new tab`}
              >
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
              </a>
            )}
          </div>
        </div>
        <p className="text-[11px] text-neutral-600 leading-relaxed whitespace-pre-line">
          {p.description}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-neutral-100/70 pb-36 overflow-y-visible">
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
                Pick from 10 industry layouts and 8 color palettes. All projects and active links included.
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
          {/* LEFT COLUMN: DESIGN CONTROLS (Scrollable and sticky) */}
          <div className="lg:col-span-4 space-y-6 pb-12">
            {/* 1. Template Layouts Selection Box */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-neutral-500" />
                  <span>1. Select Resume Template</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  {filteredTemplates.length} designs
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {(
                  [
                    { id: 'all', label: 'All (10)' },
                    { id: 'tech', label: 'Tech & Code' },
                    { id: 'executive', label: 'Executive' },
                    { id: 'ats', label: 'ATS Minimal' },
                    { id: 'creative', label: 'Creative' },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setTemplateCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      templateCategory === cat.id
                        ? 'bg-neutral-900 text-white shadow-2xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Template List Cards */}
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredTemplates.map((tpl) => {
                  const isSelected = selectedTemplate === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-50/80 shadow-xs ring-2'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                      }`}
                      style={{
                        ringColor: isSelected ? selectedColor.primary : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
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

                      {/* Mini visual layout wireframe indicator */}
                      <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center gap-1.5">
                        <div className="h-1.5 w-12 bg-neutral-300 rounded-full" />
                        <div className="h-1.5 w-6 bg-neutral-200 rounded-full" />
                        <div className="h-1.5 flex-1 bg-neutral-100 rounded-full" />
                      </div>
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

          {/* RIGHT COLUMN: LIVE A4 RESUME CANVAS (Properly scrollable down to the bottom) */}
          <div className="lg:col-span-8 space-y-4 pb-28">
            {/* Canvas Header Bar */}
            <div className="bg-white rounded-xl border border-neutral-200 p-3 px-4 flex items-center justify-between shadow-2xs text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span className="font-semibold text-neutral-800">
                  Live Preview: {TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.name} · {selectedColor.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  All {displayProjects.length} Projects & Links Active
                </span>
                <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
                  A4 Standard (210 × 297mm)
                </span>
              </div>
            </div>

            {/* THE ACTUAL A4 RESUME DOCUMENT CANVAS (Captured for PDF) */}
            <div className="bg-neutral-100/90 p-2 sm:p-5 rounded-2xl flex justify-center border border-neutral-200/80 overflow-x-auto shadow-inner">
              <div
                id="export-resume-paper"
                className={`bg-white w-[794px] min-w-[794px] max-w-[794px] text-neutral-900 border-0 rounded-none shadow-none outline-none ${getFontFamilyClass()} ${selectedTemplate === 'accent_banner' ? 'p-0 space-y-0' : getDensityPadding()}`}
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
                    <div className="text-[10.5px] mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-sans text-neutral-600">
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
                            href={normalizeUrl(profile.portfolioUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title="Open Portfolio in new tab"
                          >
                            <span>Portfolio</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.githubUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={normalizeUrl(profile.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title="Open GitHub in new tab"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.linkedinUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={normalizeUrl(profile.linkedinUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title="Open LinkedIn in new tab"
                          >
                            <span>LinkedIn</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {displaySummary && (
                    <div data-pdf-block="true" className="pdf-item-block">
                      <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Professional Summary
                      </h2>
                      <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                        {displaySummary}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {displaySkills?.length > 0 && (
                    <div data-pdf-block="true" className="pdf-item-block">
                      <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Core Competencies & Technologies
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {displaySkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md border"
                            style={{
                              backgroundColor: selectedColor.lightBg,
                              color: selectedColor.primary,
                              borderColor: selectedColor.border,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {displayExperiences?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-3" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Work Experience
                      </h2>
                      <div className="space-y-4">
                        {displayExperiences.map((exp, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block space-y-1">
                            <div className="flex items-baseline justify-between text-xs">
                              <span className="font-bold text-neutral-900 text-sm">
                                {exp.role} · <span style={{ color: selectedColor.primary }}>{exp.company}</span>
                              </span>
                              <span className="text-[11px] font-mono text-neutral-500">
                                {exp.period}
                              </span>
                            </div>
                            <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-neutral-700 font-sans">
                              {exp.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="leading-relaxed">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Projects - ALL projects rendered with link & description */}
                  {displayProjects?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2.5" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Key Projects & Engineering Highlights
                      </h2>
                      <div className="space-y-3">
                        {displayProjects.map((p, idx) => renderProjectItem(p, idx))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {displayEducation?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Education
                      </h2>
                      <div className="space-y-1">
                        {displayEducation.map((edu, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block flex items-center justify-between text-xs text-neutral-800">
                            <span className="font-semibold">{edu.degree} — {edu.school}</span>
                            <span className="text-[11px] font-mono text-neutral-500">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 2: SILICON VALLEY PRO (DEVELOPER CONSOLE) */}
              {/* ======================================================== */}
              {selectedTemplate === 'developer' && (
                <div className="space-y-5">
                  {/* Terminal Header */}
                  <div className="p-4 rounded-xl bg-neutral-950 text-white space-y-2.5 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span className="text-[11px] font-mono text-neutral-400">cvume-profile.sh</span>
                        <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          PROD READY
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400/80">
                        {displayHeadline}
                      </div>
                    </div>

                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-white">
                        {profile.fullName || 'Candidate Name'}
                      </h1>
                    </div>

                    {/* Seamless Horizontal Contact Row */}
                    <div className="pt-2 border-t border-neutral-800 text-[10px] font-mono flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-neutral-300">
                      {profile.email && (
                        <a 
                          href={`mailto:${profile.email}`} 
                          className="text-emerald-400 hover:underline cursor-pointer"
                          title={`Email ${profile.email}`}
                        >
                          {profile.email}
                        </a>
                      )}
                      {profile.phone && (
                        <>
                          <span className="text-neutral-600">·</span>
                          <a 
                            href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} 
                            className="text-emerald-400 hover:underline cursor-pointer"
                            title={`Call ${profile.phone}`}
                          >
                            {profile.phone}
                          </a>
                        </>
                      )}
                      {profile.location && (
                        <>
                          <span className="text-neutral-600">·</span>
                          <span className="text-neutral-400">{profile.location}</span>
                        </>
                      )}
                      {profile.portfolioUrl && (
                        <>
                          <span className="text-neutral-600">·</span>
                          <a
                            href={normalizeUrl(profile.portfolioUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                            title="Open Portfolio in new tab"
                          >
                            <span>portfolio</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.githubUrl && (
                        <>
                          <span className="text-neutral-600">·</span>
                          <a
                            href={normalizeUrl(profile.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                            title="Open GitHub in new tab"
                          >
                            <span>github</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.linkedinUrl && (
                        <>
                          <span className="text-neutral-600">·</span>
                          <a
                            href={normalizeUrl(profile.linkedinUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                            title="Open LinkedIn in new tab"
                          >
                            <span>linkedin</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {displaySummary && (
                    <div data-pdf-block="true" className="pdf-item-block p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
                      <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                        {displaySummary}
                      </p>
                    </div>
                  )}

                  {/* Skills Grid */}
                  {displaySkills?.length > 0 && (
                    <div data-pdf-block="true" className="pdf-item-block">
                      <h2 data-pdf-heading="true" className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b mb-2 flex items-center gap-1.5" style={{ borderColor: selectedColor.border }}>
                        <span>$ tech_stack --list</span>
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {displaySkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Work Experience */}
                  {displayExperiences?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b mb-3" style={{ borderColor: selectedColor.border }}>
                        <span>$ cat experience.log</span>
                      </h2>
                      <div className="space-y-4">
                        {displayExperiences.map((exp, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block space-y-1">
                            <div className="flex items-baseline justify-between text-xs">
                              <span className="font-bold text-neutral-900 text-sm">
                                {exp.role} <span className="font-mono text-emerald-600">@{exp.company}</span>
                              </span>
                              <span className="text-[11px] font-mono text-neutral-500">
                                {exp.period}
                              </span>
                            </div>
                            <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-neutral-700 font-sans">
                              {exp.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="leading-relaxed">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Projects - Full Boxed Cards */}
                  {displayProjects?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b mb-3" style={{ borderColor: selectedColor.border }}>
                        <span>$ git log --projects --all ({displayProjects.length} active repos)</span>
                      </h2>
                      <div className="space-y-2.5">
                        {displayProjects.map((p, idx) => renderProjectItem(p, idx, { bg: true }))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {displayEducation?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b mb-2" style={{ borderColor: selectedColor.border }}>
                        <span>$ ls /education</span>
                      </h2>
                      <div className="space-y-1 text-xs">
                        {displayEducation.map((edu, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block flex items-center justify-between">
                            <span className="font-semibold">{edu.degree} — {edu.school}</span>
                            <span className="text-[11px] font-mono text-neutral-500">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 3: EXECUTIVE SERIF */}
              {/* ======================================================== */}
              {selectedTemplate === 'executive' && (
                <div className="space-y-6">
                  {/* Centered Formal Letterhead Header */}
                  <div className="text-center pb-4 border-b-2" style={{ borderColor: selectedColor.primary }}>
                    <h1 className="text-3xl font-serif font-bold tracking-tight uppercase" style={{ color: selectedColor.primary }}>
                      {profile.fullName || 'Candidate Name'}
                    </h1>
                    <div className="text-xs font-serif font-semibold tracking-widest uppercase mt-1" style={{ color: selectedColor.secondary }}>
                      {displayHeadline}
                    </div>

                    <div className="text-[10px] mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 font-serif text-neutral-600">
                      {profile.email && (
                        <a 
                          href={`mailto:${profile.email}`} 
                          className="hover:underline cursor-pointer"
                          style={{ color: selectedColor.primary }}
                          title={`Email ${profile.email}`}
                        >
                          {profile.email}
                        </a>
                      )}
                      {profile.phone && (
                        <>
                          <span>•</span>
                          <a 
                            href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} 
                            className="hover:underline cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title={`Call ${profile.phone}`}
                          >
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
                            href={normalizeUrl(profile.portfolioUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title="Open Portfolio in new tab"
                          >
                            <span>Portfolio</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.linkedinUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={normalizeUrl(profile.linkedinUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title="Open LinkedIn in new tab"
                          >
                            <span>LinkedIn</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.githubUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={normalizeUrl(profile.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title="Open GitHub in new tab"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {displaySummary && (
                    <div data-pdf-block="true" className="pdf-item-block">
                      <h2 data-pdf-heading="true" className="text-xs font-serif font-bold uppercase tracking-widest text-center mb-2 pb-1 border-b" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Executive Profile
                      </h2>
                      <p className="text-xs text-neutral-800 leading-relaxed font-serif text-center max-w-2xl mx-auto">
                        {displaySummary}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {displaySkills?.length > 0 && (
                    <div data-pdf-block="true" className="pdf-item-block">
                      <h2 data-pdf-heading="true" className="text-xs font-serif font-bold uppercase tracking-widest text-center mb-2 pb-1 border-b" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Core Strategic & Technical Competencies
                      </h2>
                      <div className="flex flex-wrap justify-center gap-2">
                        {displaySkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-serif px-2.5 py-0.5 rounded border"
                            style={{
                              backgroundColor: selectedColor.lightBg,
                              color: selectedColor.primary,
                              borderColor: selectedColor.border,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {displayExperiences?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-serif font-bold uppercase tracking-widest text-center mb-3 pb-1 border-b" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Leadership & Professional Experience
                      </h2>
                      <div className="space-y-4">
                        {displayExperiences.map((exp, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block space-y-1 text-left">
                            <div className="flex items-baseline justify-between text-xs">
                              <span className="font-bold font-serif text-neutral-900 text-sm">
                                {exp.role} · <span style={{ color: selectedColor.primary }}>{exp.company}</span>
                              </span>
                              <span className="text-[11px] font-mono text-neutral-500">
                                {exp.period}
                              </span>
                            </div>
                            <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-neutral-700 font-serif">
                              {exp.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="leading-relaxed">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Projects */}
                  {displayProjects?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-serif font-bold uppercase tracking-widest text-center mb-2 pb-1 border-b" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Key Projects & Technical Highlights
                      </h2>
                      <div className="space-y-3">
                        {displayProjects.map((p, idx) => renderProjectItem(p, idx, { border: true }))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {displayEducation?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-serif font-bold uppercase tracking-widest text-center mb-2 pb-1 border-b" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Education
                      </h2>
                      <div className="space-y-1 font-serif">
                        {displayEducation.map((edu, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block flex items-center justify-between text-xs text-neutral-800">
                            <span className="font-semibold">{edu.degree} — {edu.school}</span>
                            <span className="text-[11px] font-mono text-neutral-500">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 4: TWO-COLUMN SPLIT */}
              {/* ======================================================== */}
              {selectedTemplate === 'split' && (
                <div className="space-y-5">
                  {/* Full-width Horizontal Top Header */}
                  <div className="border-b-2 pb-3.5" style={{ borderColor: selectedColor.primary }}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: selectedColor.primary }}>
                        {profile.fullName || 'Candidate Name'}
                      </h1>
                      <div className="text-xs sm:text-sm font-semibold" style={{ color: selectedColor.secondary }}>
                        {displayHeadline}
                      </div>
                    </div>
                    {/* Seamless Horizontal Contact Row */}
                    <div className="text-[10px] mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-neutral-600">
                      {profile.email && (
                        <a href={`mailto:${profile.email}`} className="hover:underline cursor-pointer" title={`Email ${profile.email}`}>
                          {profile.email}
                        </a>
                      )}
                      {profile.phone && (
                        <>
                          <span className="opacity-60">•</span>
                          <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="hover:underline cursor-pointer" title={`Call ${profile.phone}`}>
                            {profile.phone}
                          </a>
                        </>
                      )}
                      {profile.location && (
                        <>
                          <span className="opacity-60">•</span>
                          <span>{profile.location}</span>
                        </>
                      )}
                      {profile.portfolioUrl && (
                        <>
                          <span className="opacity-60">•</span>
                          <a href={normalizeUrl(profile.portfolioUrl)} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer" style={{ color: selectedColor.primary }} title="Open Portfolio in new tab">
                            <span>Portfolio</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.githubUrl && (
                        <>
                          <span className="opacity-60">•</span>
                          <a href={normalizeUrl(profile.githubUrl)} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer" style={{ color: selectedColor.primary }} title="Open GitHub in new tab">
                            <span>GitHub</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.linkedinUrl && (
                        <>
                          <span className="opacity-60">•</span>
                          <a href={normalizeUrl(profile.linkedinUrl)} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer" style={{ color: selectedColor.primary }} title="Open LinkedIn in new tab">
                            <span>LinkedIn</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Body Grid: Left Column Skills & Education (4 cols), Right Column Overview, Experience & Projects (8 cols) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 space-y-5 p-4 rounded-xl" style={{ backgroundColor: selectedColor.lightBg, borderRight: `2px solid ${selectedColor.border}` }}>
                      {/* Skills */}
                      {displaySkills?.length > 0 && (
                        <div data-pdf-block="true" className="pdf-item-block space-y-2">
                          <span data-pdf-heading="true" className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: selectedColor.primary }}>
                            Technical Skills
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {displaySkills.map((s, idx) => (
                              <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white border border-neutral-200">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {displayEducation?.length > 0 && (
                        <div data-pdf-block="true" className="pdf-item-block space-y-2">
                          <span data-pdf-heading="true" className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: selectedColor.primary }}>
                            Education
                          </span>
                          <div className="space-y-1.5 text-xs">
                            {displayEducation.map((edu, idx) => (
                              <div key={idx} data-pdf-block="true" className="pdf-item-block">
                                <div className="font-semibold text-neutral-900">{edu.degree}</div>
                                <div className="text-[11px] text-neutral-600">{edu.school}</div>
                                <div className="text-[10px] font-mono text-neutral-500">{edu.year}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Summary, Experience, Projects */}
                    <div className="md:col-span-8 space-y-6">
                      {displaySummary && (
                        <div data-pdf-block="true" className="pdf-item-block">
                          <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                            Profile Overview
                          </h2>
                          <p className="text-xs text-neutral-700 leading-relaxed">
                            {displaySummary}
                          </p>
                        </div>
                      )}

                      {displayExperiences?.length > 0 && (
                        <div>
                          <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-3" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                            Experience
                          </h2>
                          <div className="space-y-4">
                            {displayExperiences.map((exp, idx) => (
                              <div key={idx} data-pdf-block="true" className="pdf-item-block space-y-1">
                                <div className="flex items-baseline justify-between text-xs">
                                  <span className="font-bold text-neutral-900 text-sm">
                                    {exp.role} · <span style={{ color: selectedColor.primary }}>{exp.company}</span>
                                  </span>
                                  <span className="text-[11px] font-mono text-neutral-500">
                                    {exp.period}
                                  </span>
                                </div>
                                <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-neutral-700">
                                  {exp.bullets.map((b, bIdx) => (
                                    <li key={bIdx} className="leading-relaxed">
                                      {b}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Key Projects - Full list with links & descriptions */}
                      {displayProjects?.length > 0 && (
                        <div>
                          <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2.5" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                            Projects & Engineering Highlights
                          </h2>
                          <div className="space-y-3">
                            {displayProjects.map((p, idx) => renderProjectItem(p, idx))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 5: SWISS INTERNATIONAL GRID */}
              {/* ======================================================== */}
              {selectedTemplate === 'swiss' && (
                <div className="space-y-6">
                  {/* Full-width Horizontal Header */}
                  <div className="pb-3.5 border-b-2" style={{ borderColor: selectedColor.primary }}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: selectedColor.primary }}>
                        {profile.fullName || 'Candidate Name'}
                      </h1>
                      <div className="text-sm font-semibold" style={{ color: selectedColor.secondary }}>
                        {displayHeadline}
                      </div>
                    </div>
                    {/* Seamless Horizontal Contact Row */}
                    <div className="text-[10px] font-mono mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-neutral-600">
                      {profile.email && (
                        <a href={`mailto:${profile.email}`} className="hover:underline cursor-pointer" title={`Email ${profile.email}`}>
                          {profile.email}
                        </a>
                      )}
                      {profile.phone && (
                        <>
                          <span className="opacity-50">/</span>
                          <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="hover:underline cursor-pointer" title={`Call ${profile.phone}`}>
                            {profile.phone}
                          </a>
                        </>
                      )}
                      {profile.location && (
                        <>
                          <span className="opacity-50">/</span>
                          <span>{profile.location}</span>
                        </>
                      )}
                      {profile.portfolioUrl && (
                        <>
                          <span className="opacity-50">/</span>
                          <a href={normalizeUrl(profile.portfolioUrl)} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer font-sans" style={{ color: selectedColor.primary }} title="Open Portfolio in new tab">
                            <span>Portfolio</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.githubUrl && (
                        <>
                          <span className="opacity-50">/</span>
                          <a href={normalizeUrl(profile.githubUrl)} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer font-sans" style={{ color: selectedColor.primary }} title="Open GitHub in new tab">
                            <span>GitHub</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.linkedinUrl && (
                        <>
                          <span className="opacity-50">/</span>
                          <a href={normalizeUrl(profile.linkedinUrl)} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer font-sans" style={{ color: selectedColor.primary }} title="Open LinkedIn in new tab">
                            <span>LinkedIn</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {displaySummary && (
                    <div data-pdf-block="true" className="pdf-item-block grid grid-cols-12 gap-4">
                      <div data-pdf-heading="true" className="col-span-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        Profile
                      </div>
                      <div className="col-span-9 text-xs text-neutral-700 leading-relaxed">
                        {displaySummary}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {displaySkills?.length > 0 && (
                    <div data-pdf-block="true" className="pdf-item-block grid grid-cols-12 gap-4 pt-2 border-t border-neutral-100">
                      <div data-pdf-heading="true" className="col-span-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        Skills
                      </div>
                      <div className="col-span-9 flex flex-wrap gap-1.5">
                        {displaySkills.map((s, idx) => (
                          <span key={idx} className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {displayExperiences?.length > 0 && (
                    <div className="grid grid-cols-12 gap-4 pt-2 border-t border-neutral-100">
                      <div data-pdf-heading="true" className="col-span-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        Experience
                      </div>
                      <div className="col-span-9 space-y-4">
                        {displayExperiences.map((exp, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block space-y-1">
                            <div className="flex items-baseline justify-between text-xs">
                              <span className="font-bold text-neutral-900">
                                {exp.role} <span style={{ color: selectedColor.primary }}>/ {exp.company}</span>
                              </span>
                              <span className="text-[11px] font-mono text-neutral-500">
                                {exp.period}
                              </span>
                            </div>
                            <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-neutral-700">
                              {exp.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="leading-relaxed">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {displayProjects?.length > 0 && (
                    <div className="grid grid-cols-12 gap-4 pt-2 border-t border-neutral-100">
                      <div data-pdf-heading="true" className="col-span-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        Projects ({displayProjects.length})
                      </div>
                      <div className="col-span-9 space-y-3">
                        {displayProjects.map((p, idx) => renderProjectItem(p, idx))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {displayEducation?.length > 0 && (
                    <div className="grid grid-cols-12 gap-4 pt-2 border-t border-neutral-100">
                      <div data-pdf-heading="true" className="col-span-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        Education
                      </div>
                      <div className="col-span-9 space-y-1 text-xs">
                        {displayEducation.map((edu, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block flex items-center justify-between">
                            <span className="font-semibold">{edu.degree} — {edu.school}</span>
                            <span className="text-[11px] font-mono text-neutral-500">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 6: METRO LEFT ACCENT RAIL */}
              {/* ======================================================== */}
              {selectedTemplate === 'minimal_stripe' && (
                <div className="border-l-4 pl-6 space-y-6" style={{ borderColor: selectedColor.primary }}>
                  {/* Header */}
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: selectedColor.primary }}>
                      {profile.fullName || 'Candidate Name'}
                    </h1>
                    <div className="text-sm font-semibold mt-1" style={{ color: selectedColor.secondary }}>
                      {displayHeadline}
                    </div>

                    <div className="text-[10.5px] mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-neutral-600">
                      {profile.email && (
                        <a 
                          href={`mailto:${profile.email}`} 
                          className="hover:underline cursor-pointer"
                          style={{ color: selectedColor.primary }}
                          title={`Email ${profile.email}`}
                        >
                          {profile.email}
                        </a>
                      )}
                      {profile.phone && (
                        <>
                          <span>•</span>
                          <a 
                            href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} 
                            className="hover:underline cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title={`Call ${profile.phone}`}
                          >
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
                            href={normalizeUrl(profile.portfolioUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title="Open Portfolio in new tab"
                          >
                            <span>Portfolio</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.githubUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={normalizeUrl(profile.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title="Open GitHub in new tab"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.linkedinUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={normalizeUrl(profile.linkedinUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title="Open LinkedIn in new tab"
                          >
                            <span>LinkedIn</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {displaySummary && (
                    <div data-pdf-block="true" className="pdf-item-block">
                      <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Professional Summary
                      </h2>
                      <p className="text-xs text-neutral-700 leading-relaxed">
                        {displaySummary}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {displaySkills?.length > 0 && (
                    <div data-pdf-block="true" className="pdf-item-block">
                      <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Technical Stack
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {displaySkills.map((s, idx) => (
                          <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded-md border" style={{ backgroundColor: selectedColor.lightBg, color: selectedColor.primary, borderColor: selectedColor.border }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {displayExperiences?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-3" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Experience
                      </h2>
                      <div className="space-y-4">
                        {displayExperiences.map((exp, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block space-y-1">
                            <div className="flex items-baseline justify-between text-xs">
                              <span className="font-bold text-neutral-900 text-sm">
                                {exp.role} · <span style={{ color: selectedColor.primary }}>{exp.company}</span>
                              </span>
                              <span className="text-[11px] font-mono text-neutral-500">
                                {exp.period}
                              </span>
                            </div>
                            <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-neutral-700">
                              {exp.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="leading-relaxed">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Projects */}
                  {displayProjects?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2.5" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Key Projects & Engineering Work
                      </h2>
                      <div className="space-y-3">
                        {displayProjects.map((p, idx) => renderProjectItem(p, idx, { bg: true }))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {displayEducation?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                        Education
                      </h2>
                      <div className="space-y-1 text-xs">
                        {displayEducation.map((edu, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block flex items-center justify-between">
                            <span className="font-semibold">{edu.degree} — {edu.school}</span>
                            <span className="text-[11px] font-mono text-neutral-500">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 7: NORDIC MINIMAL */}
              {/* ======================================================== */}
              {selectedTemplate === 'nordic' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h1 className="text-3xl font-light tracking-tight text-neutral-950">
                      {profile.fullName || 'Candidate Name'}
                    </h1>
                    <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase mt-1">
                      // {displayHeadline}
                    </div>

                    <div className="text-[10px] mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-neutral-500">
                      {profile.email && (
                        <a 
                          href={`mailto:${profile.email}`} 
                          className="hover:underline text-neutral-700 cursor-pointer"
                          title={`Email ${profile.email}`}
                        >
                          {profile.email}
                        </a>
                      )}
                      {profile.phone && (
                        <>
                          <span>·</span>
                          <a 
                            href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} 
                            className="hover:underline text-neutral-700 cursor-pointer"
                            title={`Call ${profile.phone}`}
                          >
                            {profile.phone}
                          </a>
                        </>
                      )}
                      {profile.location && (
                        <>
                          <span>·</span>
                          <span>{profile.location}</span>
                        </>
                      )}
                      {profile.portfolioUrl && (
                        <>
                          <span>·</span>
                          <a
                            href={normalizeUrl(profile.portfolioUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-neutral-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                            title="Open Portfolio in new tab"
                          >
                            <span>portfolio</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.githubUrl && (
                        <>
                          <span>·</span>
                          <a
                            href={normalizeUrl(profile.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-neutral-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                            title="Open GitHub in new tab"
                          >
                            <span>github</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.linkedinUrl && (
                        <>
                          <span>·</span>
                          <a
                            href={normalizeUrl(profile.linkedinUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-neutral-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                            title="Open LinkedIn in new tab"
                          >
                            <span>linkedin</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {displaySummary && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                        // Summary
                      </h2>
                      <p className="text-xs text-neutral-700 leading-relaxed font-light">
                        {displaySummary}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {displaySkills?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                        // Core Stack
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {displaySkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {displayExperiences?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
                        // Experience
                      </h2>
                      <div className="space-y-4">
                        {displayExperiences.map((exp, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block space-y-1">
                            <div className="flex items-baseline justify-between text-xs">
                              <span className="font-medium text-neutral-900 text-sm">
                                {exp.role} <span className="text-neutral-400">at</span> {exp.company}
                              </span>
                              <span className="text-[11px] font-mono text-neutral-400">
                                {exp.period}
                              </span>
                            </div>
                            <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-neutral-600 font-light">
                              {exp.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="leading-relaxed">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Projects */}
                  {displayProjects?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                        // Key Projects & Open Source ({displayProjects.length})
                      </h2>
                      <div className="space-y-3">
                        {displayProjects.map((p, idx) => renderProjectItem(p, idx))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {displayEducation?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                        // Education
                      </h2>
                      <div className="space-y-1 text-xs">
                        {displayEducation.map((edu, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block flex items-center justify-between font-light">
                            <span>{edu.degree} — {edu.school}</span>
                            <span className="text-[11px] font-mono text-neutral-400">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 8: HIGH-DENSITY ATS */}
              {/* ======================================================== */}
              {selectedTemplate === 'compact' && (
                <div className="space-y-4 text-xs">
                  {/* Header */}
                  <div className="border-b pb-3" style={{ borderColor: selectedColor.primary }}>
                    <div className="flex items-baseline justify-between">
                      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                        {profile.fullName || 'Candidate Name'}
                      </h1>
                      <div className="text-xs font-semibold" style={{ color: selectedColor.primary }}>
                        {displayHeadline}
                      </div>
                    </div>
                    <div className="text-[10px] text-neutral-600 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      {profile.email && (
                        <a 
                          href={`mailto:${profile.email}`} 
                          className="hover:underline cursor-pointer"
                          style={{ color: selectedColor.primary }}
                          title={`Email ${profile.email}`}
                        >
                          {profile.email}
                        </a>
                      )}
                      {profile.phone && (
                        <>
                          <span>|</span>
                          <a 
                            href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} 
                            className="hover:underline cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title={`Call ${profile.phone}`}
                          >
                            {profile.phone}
                          </a>
                        </>
                      )}
                      {profile.location && (
                        <>
                          <span>|</span>
                          <span>{profile.location}</span>
                        </>
                      )}
                      {profile.portfolioUrl && (
                        <>
                          <span>|</span>
                          <a
                            href={normalizeUrl(profile.portfolioUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title="Open Portfolio in new tab"
                          >
                            <span>Portfolio</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.githubUrl && (
                        <>
                          <span>|</span>
                          <a
                            href={normalizeUrl(profile.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title="Open GitHub in new tab"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.linkedinUrl && (
                        <>
                          <span>|</span>
                          <a
                            href={normalizeUrl(profile.linkedinUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                            style={{ color: selectedColor.primary }}
                            title="Open LinkedIn in new tab"
                          >
                            <span>LinkedIn</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {displaySummary && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: selectedColor.primary }}>
                        Professional Summary
                      </h2>
                      <p className="text-[11px] text-neutral-700 leading-snug">
                        {displaySummary}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {displaySkills?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: selectedColor.primary }}>
                        Core Skills
                      </h2>
                      <div className="text-[11px] text-neutral-800">
                        {displaySkills.join(' • ')}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {displayExperiences?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: selectedColor.primary }}>
                        Experience
                      </h2>
                      <div className="space-y-3">
                        {displayExperiences.map((exp, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block space-y-0.5">
                            <div className="flex items-baseline justify-between font-semibold text-neutral-900">
                              <span>{exp.role} — <span style={{ color: selectedColor.primary }}>{exp.company}</span></span>
                              <span className="text-[10px] font-mono text-neutral-500">{exp.period}</span>
                            </div>
                            <ul className="list-disc list-outside pl-4 space-y-0.5 text-[11px] text-neutral-700">
                              {exp.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="leading-snug">{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Projects */}
                  {displayProjects?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: selectedColor.primary }}>
                        Featured Projects
                      </h2>
                      <div className="space-y-2">
                        {displayProjects.map((p, idx) => renderProjectItem(p, idx))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {displayEducation?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: selectedColor.primary }}>
                        Education
                      </h2>
                      <div className="space-y-0.5 text-[11px]">
                        {displayEducation.map((edu, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block flex items-center justify-between">
                            <span className="font-medium">{edu.degree} — {edu.school}</span>
                            <span className="font-mono text-neutral-500">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 9: ELEGANT IVY ACADEMIC */}
              {/* ======================================================== */}
              {selectedTemplate === 'elegant_ivy' && (
                <div className="space-y-6 font-serif">
                  {/* Classical Letterhead Header */}
                  <div className="text-center pb-5 border-b border-neutral-300">
                    <h1 className="text-3xl font-serif tracking-widest uppercase font-bold text-neutral-900">
                      {profile.fullName || 'Candidate Name'}
                    </h1>
                    <div className="text-xs font-serif italic text-neutral-600 mt-1">
                      {displayHeadline}
                    </div>

                    <div className="text-[10px] mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-neutral-600 font-sans">
                      {profile.email && (
                        <a 
                          href={`mailto:${profile.email}`} 
                          className="hover:underline text-neutral-800 cursor-pointer"
                          title={`Email ${profile.email}`}
                        >
                          {profile.email}
                        </a>
                      )}
                      {profile.phone && (
                        <>
                          <span>•</span>
                          <a 
                            href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} 
                            className="hover:underline text-neutral-800 cursor-pointer"
                            title={`Call ${profile.phone}`}
                          >
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
                            href={normalizeUrl(profile.portfolioUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-neutral-900 font-medium inline-flex items-center gap-0.5 cursor-pointer"
                            title="Open Portfolio in new tab"
                          >
                            <span>Portfolio</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.githubUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={normalizeUrl(profile.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-neutral-900 font-medium inline-flex items-center gap-0.5 cursor-pointer"
                            title="Open GitHub in new tab"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.linkedinUrl && (
                        <>
                          <span>•</span>
                          <a
                            href={normalizeUrl(profile.linkedinUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-neutral-900 font-medium inline-flex items-center gap-0.5 cursor-pointer"
                            title="Open LinkedIn in new tab"
                          >
                            <span>LinkedIn</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {displaySummary && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-serif font-bold uppercase tracking-widest text-neutral-900 pb-1 border-b border-neutral-200 mb-2">
                        Statement of Qualifications
                      </h2>
                      <p className="text-xs text-neutral-800 leading-relaxed font-serif">
                        {displaySummary}
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {displayExperiences?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-serif font-bold uppercase tracking-widest text-neutral-900 pb-1 border-b border-neutral-200 mb-3">
                        Professional Appointments & Experience
                      </h2>
                      <div className="space-y-4">
                        {displayExperiences.map((exp, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block space-y-1">
                            <div className="flex items-baseline justify-between text-xs">
                              <span className="font-bold text-neutral-900 text-sm">
                                {exp.role}, <span className="italic font-normal">{exp.company}</span>
                              </span>
                              <span className="text-[11px] font-mono text-neutral-500">
                                {exp.period}
                              </span>
                            </div>
                            <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-neutral-700">
                              {exp.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="leading-relaxed font-serif">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {displayProjects?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-serif font-bold uppercase tracking-widest text-neutral-900 pb-1 border-b border-neutral-200 mb-2.5">
                        Selected Projects & Systems
                      </h2>
                      <div className="space-y-3 font-sans">
                        {displayProjects.map((p, idx) => renderProjectItem(p, idx, { border: true }))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {displayEducation?.length > 0 && (
                    <div>
                      <h2 data-pdf-heading="true" className="text-xs font-serif font-bold uppercase tracking-widest text-neutral-900 pb-1 border-b border-neutral-200 mb-2">
                        Degrees & Education
                      </h2>
                      <div className="space-y-1 text-xs font-serif">
                        {displayEducation.map((edu, idx) => (
                          <div key={idx} data-pdf-block="true" className="pdf-item-block flex items-center justify-between text-neutral-800">
                            <span className="font-semibold">{edu.degree} — {edu.school}</span>
                            <span className="text-[11px] font-mono text-neutral-500">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TEMPLATE 10: CONTEMPORARY ACCENT BANNER */}
              {/* ======================================================== */}
              {selectedTemplate === 'accent_banner' && (
                <div className="space-y-0">
                  {/* Full-bleed Header Banner */}
                  <div className="p-6 sm:p-8 text-white rounded-t-none" style={{ backgroundColor: selectedColor.primary }}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        {profile.fullName || 'Candidate Name'}
                      </h1>
                      <div className="text-sm font-semibold opacity-90">
                        {displayHeadline}
                      </div>
                    </div>

                    <div className="text-[10px] sm:text-[10.5px] mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-sans text-white/95">
                      {profile.email && (
                        <a 
                          href={`mailto:${profile.email}`} 
                          className="hover:underline text-white cursor-pointer"
                          title={`Email ${profile.email}`}
                        >
                          {profile.email}
                        </a>
                      )}
                      {profile.phone && (
                        <>
                          <span className="opacity-70">•</span>
                          <a 
                            href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} 
                            className="hover:underline text-white cursor-pointer"
                            title={`Call ${profile.phone}`}
                          >
                            {profile.phone}
                          </a>
                        </>
                      )}
                      {profile.location && (
                        <>
                          <span className="opacity-70">•</span>
                          <span className="text-white/80">{profile.location}</span>
                        </>
                      )}
                      {profile.portfolioUrl && (
                        <>
                          <span className="opacity-70">•</span>
                          <a
                            href={normalizeUrl(profile.portfolioUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-white font-medium inline-flex items-center gap-0.5 cursor-pointer"
                            title="Open Portfolio in new tab"
                          >
                            <span>Portfolio</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.githubUrl && (
                        <>
                          <span className="opacity-70">•</span>
                          <a
                            href={normalizeUrl(profile.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-white font-medium inline-flex items-center gap-0.5 cursor-pointer"
                            title="Open GitHub in new tab"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                      {profile.linkedinUrl && (
                        <>
                          <span className="opacity-70">•</span>
                          <a
                            href={normalizeUrl(profile.linkedinUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-white font-medium inline-flex items-center gap-0.5 cursor-pointer"
                            title="Open LinkedIn in new tab"
                          >
                            <span>LinkedIn</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Summary */}
                    {displaySummary && (
                      <div>
                        <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                          Professional Profile
                        </h2>
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          {displaySummary}
                        </p>
                      </div>
                    )}

                    {/* Skills */}
                    {displaySkills?.length > 0 && (
                      <div>
                        <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                          Skills & Competencies
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                          {displaySkills.map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium px-2 py-0.5 rounded-md border"
                              style={{
                                backgroundColor: selectedColor.lightBg,
                                color: selectedColor.primary,
                                borderColor: selectedColor.border,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {displayExperiences?.length > 0 && (
                      <div>
                        <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-3" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                          Experience
                        </h2>
                        <div className="space-y-4">
                          {displayExperiences.map((exp, idx) => (
                            <div key={idx} data-pdf-block="true" className="pdf-item-block border-l-2 pl-3 space-y-1" style={{ borderColor: selectedColor.primary }}>
                              <div className="flex items-baseline justify-between text-xs">
                                <span className="font-bold text-neutral-900 text-sm">
                                  {exp.role} · <span style={{ color: selectedColor.primary }}>{exp.company}</span>
                                </span>
                                <span className="text-[11px] font-mono text-neutral-500">
                                  {exp.period}
                                </span>
                              </div>
                              <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-neutral-700">
                                {exp.bullets.map((b, bIdx) => (
                                  <li key={bIdx} className="leading-relaxed">
                                    {b}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Projects */}
                    {displayProjects?.length > 0 && (
                      <div>
                        <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2.5" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                          Key Projects & Engineering Work
                        </h2>
                        <div className="space-y-3">
                          {displayProjects.map((p, idx) => renderProjectItem(p, idx))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {displayEducation?.length > 0 && (
                      <div>
                        <h2 data-pdf-heading="true" className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: selectedColor.primary, borderColor: selectedColor.border }}>
                          Education
                        </h2>
                        <div className="space-y-1 text-xs">
                          {displayEducation.map((edu, idx) => (
                            <div key={idx} data-pdf-block="true" className="pdf-item-block flex items-center justify-between text-neutral-800">
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
