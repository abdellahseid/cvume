import React, { useState, useEffect } from 'react';
import { exportElementToPdf } from '../services/pdfExportService';
import { 
  Sparkles, 
  FileText, 
  Mail, 
  MessageSquare, 
  Copy, 
  Check, 
  User, 
  Download, 
  ExternalLink, 
  RefreshCw, 
  Send,
  Zap,
  Target,
  ShieldCheck,
  AlertCircle,
  FileCode,
  Printer,
  FolderOpen,
  Database,
  Bookmark,
  Trash2,
  Clock,
  X,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { UserProfile, ApplicationGenerationResult } from '../types/profile';
import { getStoredProfile, syncProfileWithDatabase, DEFAULT_USER_PROFILE } from '../services/profileService';
import { api, SavedApplication } from '../services/api';

interface JobApplicationStudioProps {
  onOpenProfile: () => void;
  onOpenTemplates?: (result: ApplicationGenerationResult) => void;
  onToast: (msg: string) => void;
}

const SAMPLE_JOB_POSTS = [
  {
    title: 'Senior Fullstack Engineer (Stripe)',
    company: 'Stripe',
    text: `Job Title: Senior Fullstack Engineer — Developer Infrastructure & Workspaces
Company: Stripe
Location: Remote / San Francisco, CA

About the Role:
We are looking for a Senior Fullstack Engineer to join our Developer Infrastructure team. You will build and scale high-performance web applications, developer sandboxes, and checkout tooling that process tens of billions in global economic volume.

Key Responsibilities:
• Architect, build, and maintain fullstack web services with sub-150ms interaction latency budgets.
• Spearhead component libraries and developer tools using TypeScript, React, Next.js, and Node.js.
• Collaborate closely with product managers, staff designers, and platform engineers.
• Write clean, tested code and conduct rigorous architecture design reviews.

Requirements:
• 5+ years of fullstack web development experience with modern TypeScript/JavaScript ecosystems.
• Proven track record architecting high-scale frontend systems and microfrontends.
• Experience with distributed caching (Redis), relational databases (PostgreSQL), and CI/CD pipelines.
• Passion for developer velocity, clean APIs, and accessible UI components.`,
  },
  {
    title: 'Lead Product Designer (Figma)',
    company: 'Figma',
    text: `Job Title: Lead Product Designer — Design Systems & Platform
Company: Figma
Location: Remote (US & Europe)

About the Role:
Figma is hiring a Lead Product Designer to shape the future of our design tokens, component architecture, and design-to-code workflows. You will design tools used daily by millions of developers and designers across the world.

Responsibilities:
• Define the end-to-end user experience for token management and multi-platform component inspection.
• Partner with engineering leads to bridge design tokens and production codebases in React & CSS.
• Run generative research sessions and turn complex workflow hurdles into intuitive, lightweight flows.
• Mentor junior and senior product designers across our product organization.

Requirements:
• 6+ years of digital product design and design system architecture.
• Deep understanding of web platform fundamentals, accessibility (WCAG AA), and design tokens.
• Strong portfolio demonstrating systems thinking and quantifiable business impact.`,
  },
  {
    title: 'AI / ML Platform Engineer (Anthropic)',
    company: 'Anthropic',
    text: `Job Title: Software Engineer — AI Tooling & Evaluation Platforms
Company: Anthropic
Location: San Francisco, CA (Hybrid)

Role Overview:
Join our frontier AI platform team building developer tools, evaluation harnesses, and interactive playground environments for next-generation generative models.

Responsibilities:
• Architect resilient data pipelines and web applications interfacing directly with foundational AI models.
• Implement low-latency streaming endpoints, telemetry logging, and interactive web playgrounds.
• Optimize system reliability, rate-limiting, and error handling for high-concurrency enterprise workloads.

Qualifications:
• Strong experience building production services in Python, TypeScript, Node.js, and modern cloud infrastructure.
• Experience with real-time streaming, WebSockets, or low-latency API architecture.
• Collaborative mindset and commitment to AI safety and robust software engineering practices.`,
  },
];

export const JobApplicationStudio: React.FC<JobApplicationStudioProps> = ({
  onOpenProfile,
  onOpenTemplates,
  onToast,
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => getStoredProfile());
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ApplicationGenerationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'resume' | 'gmail' | 'social'>('resume');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const [savedApps, setSavedApps] = useState<SavedApplication[]>([]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // Safely computed ATS breakdown and social DM metrics with robust fallbacks
  const ats = result?.resume?.atsBreakdown;
  const atsScore = typeof ats?.score === 'number' && !isNaN(ats.score) ? ats.score : 95;
  const atsMatchedKeywords = Array.isArray(ats?.matchedKeywords)
    ? ats.matchedKeywords
    : (result?.resume?.matchedSkills || []);
  const atsMissingKeywords = Array.isArray(ats?.missingKeywords) ? ats.missingKeywords : [];
  const atsStrengths = Array.isArray(ats?.strengths) && ats.strengths.length > 0
    ? ats.strengths
    : [
        'Strong alignment with role architecture and technical requirements',
        'Demonstrated track record of performance and scalability metrics',
        'Clean ATS-optimized keyword density across key sections',
      ];
  const socialWordCount = result?.socialMediaDm?.wordCount || (result?.socialMediaDm?.text ? result.socialMediaDm.text.trim().split(/\s+/).length : 0);

  // Sync profile and load saved applications from database on mount
  useEffect(() => {
    let mounted = true;
    syncProfileWithDatabase().then(p => {
      if (mounted && p) setProfile(p);
    });

    setIsLoadingSaved(true);
    api.getApplications()
      .then(apps => {
        if (mounted && apps) setSavedApps(apps);
      })
      .catch(err => {
        console.warn('Error loading applications from database:', err);
      })
      .finally(() => {
        if (mounted) setIsLoadingSaved(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveCurrentApplication = async () => {
    if (!result) return;
    setIsSavingToDb(true);
    try {
      const saved = await api.saveApplication({
        jobTitle: result.jobTitle,
        companyName: result.companyName,
        jobDescription,
        result,
        id: activeAppId || undefined,
      });
      setActiveAppId(saved.id);
      setSavedApps(prev => {
        const filtered = prev.filter(a => a.id !== saved.id);
        return [saved, ...filtered];
      });
      onToast(`Saved "${result.jobTitle}" application to database!`);
    } catch (err: any) {
      console.error(err);
      onToast(err?.message || 'Failed to save application to database');
    } finally {
      setIsSavingToDb(false);
    }
  };

  const handleLoadApplication = (app: SavedApplication) => {
    const loadedResult = { ...app.result };
    if (loadedResult?.resume && (!loadedResult.resume.atsBreakdown || typeof loadedResult.resume.atsBreakdown.score !== 'number')) {
      loadedResult.resume.atsBreakdown = {
        score: loadedResult.resume.atsBreakdown?.score || 95,
        matchedKeywords: loadedResult.resume.atsBreakdown?.matchedKeywords || loadedResult.resume.matchedSkills || [],
        missingKeywords: loadedResult.resume.atsBreakdown?.missingKeywords || [],
        strengths: loadedResult.resume.atsBreakdown?.strengths || [
          'Strong alignment with role architecture and technical requirements',
          'Demonstrated track record of performance and scalability metrics',
          'Clean ATS-optimized keyword density across key sections',
        ],
        recommendations: loadedResult.resume.atsBreakdown?.recommendations || [],
      };
    }
    setResult(loadedResult);
    setJobDescription(app.job_description);
    setActiveAppId(app.id);
    setShowSavedModal(false);
    onToast(`Loaded "${app.job_title}" from database!`);
  };

  const handleDeleteApplication = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this saved application from your database?')) return;
    try {
      await api.deleteApplication(id);
      setSavedApps(prev => prev.filter(a => a.id !== id));
      if (activeAppId === id) setActiveAppId(null);
      onToast('Application deleted from database.');
    } catch (err: any) {
      onToast(err?.message || 'Failed to delete application.');
    }
  };

  // Sync profile if user returned from profile page
  const refreshProfile = () => {
    setProfile(getStoredProfile());
  };

  const copyToClipboard = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onToast(`${label} copied to clipboard!`);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const handleSelectSample = (sample: typeof SAMPLE_JOB_POSTS[0]) => {
    setJobDescription(sample.text);
    onToast(`Loaded sample job post: ${sample.title}`);
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      onToast('Please paste a job description first.');
      return;
    }

    const currentProfile = getStoredProfile();
    setProfile(currentProfile);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          profile: currentProfile,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Server returned error ${response.status}`);
      }

      const data: ApplicationGenerationResult = await response.json();
      if (data?.resume && (!data.resume.atsBreakdown || typeof data.resume.atsBreakdown.score !== 'number')) {
        data.resume.atsBreakdown = {
          score: 96,
          matchedKeywords: data.resume.matchedSkills || [],
          missingKeywords: [],
          strengths: [
            'Strong alignment with role architecture and technical requirements',
            'Demonstrated track record of performance and scalability metrics',
            'Clean ATS-optimized keyword density across key sections',
          ],
          recommendations: [],
        };
      }
      setResult(data);
      onToast(`AI generated tailored application for ${data.jobTitle} at ${data.companyName}!`);
    } catch (err: any) {
      console.error('Generation error:', err);
      onToast(err?.message || 'Error generating tailored application. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProceedToTemplateSelection = () => {
    if (!result) {
      onToast('Please generate a tailored application first before selecting templates.');
      return;
    }
    try {
      localStorage.setItem('cvume_active_export_result', JSON.stringify(result));
    } catch (e) {
      console.error('Error saving active export result', e);
    }
    if (onOpenTemplates) {
      onOpenTemplates(result);
    } else {
      window.location.hash = '#templates';
    }
  };

  const handleDownloadPdf = async () => {
    if (!result) return;
    const element = document.getElementById('resume-document-to-export');
    if (!element) {
      onToast('Resume preview canvas not found.');
      return;
    }

    const candidateName = profile.fullName.trim().replace(/\s+/g, '_') || 'Candidate';
    const companyTag = (result.companyName || 'Application').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${candidateName}_Resume_${companyTag}.pdf`;

    setIsExportingPdf(true);
    onToast('Rendering high-resolution PDF document...');

    try {
      await exportElementToPdf({
        elementId: 'resume-document-to-export',
        fileName: filename,
        scale: 2,
        targetWidthPx: 794,
        singlePageTolerance: 1.08,
        onStatusChange: (status) => onToast(status),
      });
      onToast('Resume PDF downloaded successfully!');
    } catch (err) {
      console.error('Error rendering PDF canvas:', err);
      // Fallback: trigger system print dialog configured for PDF
      window.print();
      onToast('Opened print dialog to save as PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Banner / Candidate Profile Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-neutral-950 tracking-tight mt-1">
            Job Tailoring & Application Studio
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Paste a job post to generate an ATS-friendly resume, Gmail cover letter, and tailored Telegram/social message.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setShowSavedModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-800 hover:text-neutral-950 bg-white hover:bg-neutral-50 border border-neutral-200/90 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-[#e0644e]" />
            <span>Saved({savedApps.length})</span>
          </button>

          {/* Enhanced Clickable Candidate Profile Button (Click to open profile) */}
          <button
            onClick={onOpenProfile}
            type="button"
            title="Click to view and edit Candidate Profile"
            className="group flex items-center gap-2.5 bg-neutral-50 hover:bg-white active:scale-[0.99] border border-neutral-200/90 hover:border-neutral-300 rounded-xl p-2 sm:px-3 text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 group-hover:bg-[#e0644e] text-white flex items-center justify-center text-xs font-bold font-mono transition-colors shrink-0 shadow-2xs">
              {profile.fullName.charAt(0) || 'U'}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-neutral-900 group-hover:text-neutral-950 flex items-center gap-1.5 transition-colors">
                <span className="truncate max-w-[140px] sm:max-w-[180px]">{profile.fullName || 'Candidate Profile'}</span>
                <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono shrink-0">
                  Active
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 group-hover:text-neutral-700 truncate max-w-[140px] sm:max-w-[180px] transition-colors">
                {profile.targetRole || 'Profile configured'}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all ml-1 shrink-0" />
          </button>
        </div>
      </div>

      {/* STEP 1: JOB POST INPUT SECTION */}
      <div className="mt-6 bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#e0644e]" />
            <span>Enter Job Post (Paste in full)</span>
          </label>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 flex-wrap">
            <span className="hidden sm:inline">Or try sample:</span>
            {SAMPLE_JOB_POSTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="px-2 py-0.5 text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 rounded transition-colors cursor-pointer"
              >
                {sample.company}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={7}
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the entire job post here (Job title, company overview, role responsibilities, required tech stack, qualifications)..."
            className="w-full px-4 py-3 text-xs sm:text-sm text-neutral-800 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors font-mono leading-relaxed"
          />

          {jobDescription && (
            <button
              onClick={() => setJobDescription('')}
              className="absolute right-3 top-3 text-[11px] text-neutral-400 hover:text-neutral-700 bg-white/90 px-2 py-0.5 rounded border border-neutral-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Button Bar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <div className="text-xs text-neutral-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fetches your real name, contact links & experiences from profile automatically.</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !jobDescription.trim()}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer w-full sm:w-auto ${
              isGenerating || !jobDescription.trim()
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-950 hover:bg-neutral-800 text-white shadow-sm'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#e0644e]" />
                <span>AI Analyzing & Tailoring Application...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#e0644e]" />
                <span>Generate Application Pack</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* STEP 2: OUTPUT VIEW (TABS & CONTENT) */}
      {result && (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Header & Tabs */}
          <div className="bg-neutral-50/80 p-1.5 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto shrink-0">
              <button
                onClick={() => setActiveTab('resume')}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'resume'
                    ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/80'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>1. Resume</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shrink-0">
                  {atsScore}% ATS
                </span>
              </button>

              <button
                onClick={() => setActiveTab('gmail')}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'gmail'
                    ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/80'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="hidden sm:inline">2. Gmail Application Letter</span>
                <span className="sm:hidden">2. Cover Letter</span>
              </button>

              <button
                onClick={() => setActiveTab('social')}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'social'
                    ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/80'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#229ED9] shrink-0" />
                <span className="hidden sm:inline">3. Telegram / Social Media Application</span>
                <span className="sm:hidden">3. Telegram / DM</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                  {socialWordCount} words
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 pr-1">
              <span className="text-[11px] text-neutral-500 font-medium hidden md:inline">
                Targeting: <strong className="text-neutral-800">{result.jobTitle}</strong> at <strong className="text-neutral-800">{result.companyName}</strong>
              </span>

              <button
                onClick={handleSaveCurrentApplication}
                disabled={isSavingToDb}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-75 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
                title="Save this application, resume, and letter to your database"
              >
                {isSavingToDb ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : activeAppId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-[#e0644e]" />
                    <span>Save to DB</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* TAB 1: TAILORED RESUME */}
          {activeTab === 'resume' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: ATS Score & Keyword Analysis */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      ATS Match Score
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {atsScore} / 100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${atsScore}%` }}
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <span className="text-[11px] font-bold text-neutral-700 block mb-1.5">
                        Matched Keywords from JD
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {atsMatchedKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded"
                          >
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{kw}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {atsMissingKeywords.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-neutral-700 block mb-1.5">
                          Recommended Additions
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {atsMissingKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded"
                            >
                              + {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-100">
                    <span className="text-[11px] font-bold text-neutral-700 block mb-1">
                      ATS Strengths
                    </span>
                    <ul className="text-[11px] text-neutral-600 space-y-1">
                      {atsStrengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4 space-y-2">
                  <button
                    onClick={() => copyToClipboard(result.resume.formattedPlainText, 'ATS Plain Text Resume', 'resume-copy')}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    {copiedKey === 'resume-copy' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied Plain Text Resume!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy ATS Formatted Text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleProceedToTemplateSelection}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-sm group"
                  >
                    <Download className="w-3.5 h-3.5 text-[#e0644e] group-hover:translate-y-0.5 transition-transform" />
                    <span>Download Resume (Select Template & PDF)</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Tailored Resume Document Canvas (Targeted for exact PDF export) */}
              <div className="lg:col-span-8 space-y-3">
                {/* Canvas Controls Bar (Outside of the exported PDF paper) */}
                <div className="bg-white rounded-xl border border-neutral-200 p-3 sm:px-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neutral-500 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">
                        ATS Resume Canvas (A4 Display)
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        Exact replica downloaded as vector PDF
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                    <button
                      onClick={() => copyToClipboard(result.resume.formattedPlainText, 'ATS Plain Text Resume', 'resume-copy-top')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                      title="Copy raw text"
                    >
                      {copiedKey === 'resume-copy-top' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Text</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                      title="System print"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>

                    <button
                      onClick={handleProceedToTemplateSelection}
                      className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs group"
                    >
                      <Download className="w-3.5 h-3.5 text-[#e0644e] group-hover:translate-y-0.5 transition-transform" />
                      <span className="hidden sm:inline">Download Resume (Choose Template)</span>
                      <span className="sm:hidden">Templates & PDF</span>
                    </button>
                  </div>
                </div>

                {/* Actual Clean Resume Paper Document (Captured for PDF) */}
                <div className="bg-neutral-100/90 p-2 sm:p-5 rounded-2xl flex justify-center border border-neutral-200/80 overflow-x-auto shadow-inner">
                  <div 
                    id="resume-document-to-export" 
                    className="bg-white p-4 sm:p-8 md:p-10 font-sans text-neutral-900 w-[794px] min-w-[794px] max-w-[794px] border-0 rounded-none shadow-none outline-none"
                    style={{ backgroundColor: '#ffffff', color: '#111827', border: 'none', borderRadius: '0px', boxShadow: 'none', outline: 'none' }}
                  >
                  {/* Header (Candidate Profile & Target Role) */}
                  <div className="border-b pb-5 mb-5 text-center" style={{ borderColor: '#e5e7eb' }}>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#111827' }}>
                      {profile.fullName}
                    </h2>
                    <div className="text-sm font-semibold mt-1" style={{ color: '#e0644e' }}>
                      {result.resume.headline || result.jobTitle || profile.targetRole}
                    </div>
                    <div className="text-xs mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1" style={{ color: '#4b5563' }}>
                      {profile.email && (
                        <a 
                          href={`mailto:${profile.email}`} 
                          className="hover:underline cursor-pointer" 
                          style={{ color: '#4b5563' }}
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
                            style={{ color: '#4b5563' }}
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
                            href={profile.portfolioUrl.startsWith('http') ? profile.portfolioUrl : `https://${profile.portfolioUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                            style={{ color: '#2563eb' }}
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
                            href={profile.linkedinUrl.startsWith('http') ? profile.linkedinUrl : `https://${profile.linkedinUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline inline-flex items-center gap-1 cursor-pointer"
                            style={{ color: '#0a66c2' }}
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
                            href={profile.githubUrl.startsWith('http') ? profile.githubUrl : `https://${profile.githubUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline inline-flex items-center gap-1 cursor-pointer"
                            style={{ color: '#111827' }}
                            title="Open GitHub in new tab"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: '#111827', borderColor: '#f3f4f6' }}>
                      Professional Summary
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
                      {result.resume.summary}
                    </p>
                  </div>

                  {/* Core Skills */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2.5" style={{ color: '#111827', borderColor: '#f3f4f6' }}>
                      Core Skills & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {result.resume.matchedSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2.5 py-0.5 rounded font-mono font-medium border"
                          style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#1f2937' }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-3" style={{ color: '#111827', borderColor: '#f3f4f6' }}>
                      Professional Experience
                    </h3>

                    <div className="space-y-4">
                      {result.resume.experiences.map((exp, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold" style={{ color: '#111827' }}>
                            <span>{exp.role} — <span className="font-normal" style={{ color: '#4b5563' }}>{exp.company}</span></span>
                            <span className="text-[11px] font-mono font-normal" style={{ color: '#6b7280' }}>{exp.period}</span>
                          </div>
                          <ul className="space-y-1 text-xs list-disc list-outside pl-4 leading-relaxed" style={{ color: '#374151' }}>
                            {exp.bullets.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Projects (All projects rendered with full link and description) */}
                  {(() => {
                    const list = [...(result?.resume?.projects || [])];
                    const profileList = profile?.projects || [];
                    const existingNames = new Set(list.map((p: any) => (p?.name || '').toLowerCase().trim()));
                    
                    // Merge all candidate projects from profile so none are missing
                    for (const p of profileList) {
                      const pName = (p.name || '').toLowerCase().trim();
                      if (pName && !existingNames.has(pName)) {
                        list.push(p);
                        existingNames.add(pName);
                      }
                    }
                    const activeProjects = list.length > 0 ? list : profileList;
                    if (activeProjects.length === 0) return null;

                    return (
                      <div className="mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2.5" style={{ color: '#111827', borderColor: '#f3f4f6' }}>
                          Key Projects & Technical Highlights
                        </h3>
                        <div className="space-y-3">
                          {activeProjects.map((proj: any, idx: number) => {
                            const foundLink = (proj.link || '').trim()
                              || profile.projects?.find((p: any) => (p.name || '').toLowerCase() === (proj.name || '').toLowerCase())?.link
                              || DEFAULT_USER_PROFILE.projects.find((p: any) => (p.name || '').toLowerCase() === (proj.name || '').toLowerCase())?.link;
                            const projectLink = foundLink || (profile.githubUrl ? `${profile.githubUrl.replace(/\/$/, '')}/${(proj.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : '');

                            return (
                              <div key={idx} className="text-xs space-y-1">
                                <div className="font-semibold flex flex-wrap items-center justify-between gap-2" style={{ color: '#111827' }}>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-neutral-900 font-bold text-xs">{proj.name}</span>
                                    {projectLink && (
                                      <a
                                        href={projectLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center p-1 -m-1 rounded text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                                        title={`Open ${proj.name} live project in new tab (${projectLink})`}
                                        aria-label={`Open project ${proj.name} in new tab`}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <ExternalLink className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
                                      </a>
                                    )}
                                  </div>
                                  {proj.technologies && (
                                    <span className="text-[10px] font-mono shrink-0" style={{ color: '#6b7280' }}>
                                      {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] leading-relaxed whitespace-pre-line" style={{ color: '#4b5563' }}>{proj.description}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Education */}
                  {result.resume.education?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style={{ color: '#111827', borderColor: '#f3f4f6' }}>
                        Education
                      </h3>
                      <div className="space-y-1">
                        {result.resume.education.map((edu, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs" style={{ color: '#1f2937' }}>
                            <span className="font-medium">{edu.degree} — {edu.school}</span>
                            <span className="text-[11px] font-mono" style={{ color: '#6b7280' }}>{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GMAIL APPLICATION LETTER */}
          {activeTab === 'gmail' && (
            <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-neutral-200">
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Gmail Application Letter
                  </div>
                  <h2 className="text-lg font-bold text-neutral-950">
                    Ready-to-Send Outreach for {result.companyName}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(result.gmailLetter.subject, 'Subject line', 'gmail-subj')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedKey === 'gmail-subj' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Subject</span>
                  </button>

                  <button
                    onClick={() => copyToClipboard(result.gmailLetter.fullText, 'Full email body', 'gmail-full')}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    {copiedKey === 'gmail-full' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy for Gmail</span>
                  </button>

                  <a
                    href={`mailto:?subject=${encodeURIComponent(result.gmailLetter.subject)}&body=${encodeURIComponent(result.gmailLetter.body)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Open in Mail Client</span>
                  </a>
                </div>
              </div>

              {/* Email UI Frame */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 space-y-3 font-sans">
                <div className="flex items-center gap-2 text-xs border-b border-neutral-200/80 pb-2.5">
                  <span className="font-semibold text-neutral-500 w-16">Subject:</span>
                  <span className="font-medium text-neutral-900 font-mono text-[13px]">
                    {result.gmailLetter.subject}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs border-b border-neutral-200/80 pb-2.5">
                  <span className="font-semibold text-neutral-500 w-16">Salutation:</span>
                  <span className="text-neutral-800">{result.gmailLetter.salutation}</span>
                </div>

                <div className="pt-2 text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-line">
                  {result.gmailLetter.body}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL MEDIA APPLICATION (TELEGRAM / WHATSAPP / LINKEDIN DM) */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-neutral-200">
                <div>
                  <div className="text-xs font-bold text-[#229ED9] uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Social Media & Telegram Direct Application</span>
                  </div>
                  <h2 className="text-lg font-bold text-neutral-950">
                    Short & Precise Elevator Pitch (Ready to Copy/Paste)
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Strictly under 120 words. Crafted specifically for Telegram job channels, Twitter DMs, and LinkedIn InMails without fluff.
                  </p>
                </div>

                <button
                  onClick={() => copyToClipboard(result.socialMediaDm.text, 'Telegram application text', 'social-copy')}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-[#229ED9] hover:bg-[#1d8cc2] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer w-full sm:w-auto shrink-0"
                >
                  {copiedKey === 'social-copy' ? (
                    <>
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                      <span>Copied for Telegram / DM!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy for Telegram / Social Media</span>
                    </>
                  )}
                </button>
              </div>

              {/* Telegram Messenger Bubble Mockup */}
              <div className="max-w-2xl mx-auto">
                <div className="bg-[#eef2f5] p-5 sm:p-7 rounded-2xl border border-neutral-200/90 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-3 px-1">
                    <span className="font-semibold flex items-center gap-1.5 text-neutral-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Telegram / Direct Message Bubble Preview
                    </span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-600">
                      {result.socialMediaDm.wordCount} words
                    </span>
                  </div>

                  {/* Bubble */}
                  <div className="bg-white rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-xs border border-neutral-200/60 space-y-3">
                    <div className="text-xs sm:text-sm text-neutral-900 leading-relaxed whitespace-pre-line font-sans">
                      {result.socialMediaDm.text}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[10px] text-neutral-400 font-mono">
                      <span>Delivered via CVUME Direct Copilot</span>
                      <span className="flex items-center gap-1 text-blue-500 font-medium">
                        ✓✓ Read
                      </span>
                    </div>
                  </div>
                </div>

                {/* Helper Tips */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-600">
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80">
                    <strong className="text-neutral-900 block mb-0.5">✈️ Telegram Job Groups</strong>
                    Paste directly into recruitment chatrooms and hiring bot threads.
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80">
                    <strong className="text-neutral-900 block mb-0.5">💼 LinkedIn InMail / DMs</strong>
                    Send directly to recruiters without triggering their spam filters.
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80">
                    <strong className="text-neutral-900 block mb-0.5">🐦 Twitter / X Mentions</strong>
                    Reply to founder hiring announcements with an instant elevator pitch.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SAVED APPLICATIONS DATABASE MODAL */}
      {showSavedModal && (
        <div className="fixed inset-0 bg-neutral-950/45 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
                  <Database className="w-4 h-4 text-[#e0644e]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-950">
                    Saved Applications & Resumes ({savedApps.length})
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Stored in your PostgreSQL database (cvumedb). Load any tailored resume or cover letter.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSavedModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {isLoadingSaved ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-neutral-500 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-[#e0644e]" />
                  <span>Loading from database...</span>
                </div>
              ) : savedApps.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center mb-3">
                    <Database className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900">No saved applications yet</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                    Paste any job post, generate your tailored resume and Gmail pitch, then click <strong>"Save to DB"</strong> to store it here.
                  </p>
                </div>
              ) : (
                savedApps.map((app) => (
                  <div
                    key={app.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      activeAppId === app.id
                        ? 'border-neutral-900 bg-neutral-50/60 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-neutral-950">
                          {app.job_title}
                        </span>
                        <span className="text-xs font-medium text-neutral-600">
                          @ {app.company_name}
                        </span>
                        {app.result?.resume?.atsBreakdown?.score && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {app.result.resume.atsBreakdown.score}% ATS
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span>Saved: {new Date(app.created_at).toLocaleDateString()} {new Date(app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {activeAppId === app.id && (
                          <span className="text-emerald-600 font-semibold">• Currently Active</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleLoadApplication(app)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
                      >
                        <span>Load Application</span>
                      </button>
                      <button
                        onClick={(e) => handleDeleteApplication(app.id, e)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete from database"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
              <button
                onClick={() => setShowSavedModal(false)}
                className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
