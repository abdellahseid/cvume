import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Send, 
  Copy, 
  Check, 
  FileText, 
  MessageSquare, 
  Clock, 
  Globe,
  Share2,
  Building,
  AlertCircle,
  RefreshCw,
  Layers
} from 'lucide-react';
import { DiscoveredJob, ApplicationLog } from '../../services/api';

interface JobDetailPageProps {
  job: DiscoveredJob;
  isApplied: boolean;
  onBack: () => void;
  onAutoApply: (jobId: string) => Promise<void>;
  isApplying: boolean;
  onViewInApplied: () => void;
  appliedLogs?: ApplicationLog[];
  userProfile?: { fullName: string; email: string; phone?: string; portfolioUrl?: string; targetRole?: string } | null;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({
  job,
  isApplied,
  onBack,
  onAutoApply,
  isApplying,
  onViewInApplied,
  appliedLogs,
  userProfile,
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'resume' | 'letter' | 'telegram'>('resume');
  const [copiedText, setCopiedText] = useState(false);

  const matchScore = job.matchScore || 88;
  const isTelegram = job.source === 'telegram';

  const candidateName = userProfile?.fullName || 'Candidate';
  const candidatePhone = userProfile?.phone || '';
  const candidatePortfolio = userProfile?.portfolioUrl || '';
  const candidateEmail = userProfile?.email || '';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Tailored preview text generated dynamically from real job and candidate profile
  const tailoredResumeHeadline = `${job.title} | Software Engineering & Scalable Platforms`;
  const tailoredSummary = `Dedicated software engineer with verified experience across ${(job.matchedSkills || job.tags || ['TypeScript', 'React']).slice(0, 4).join(', ')}. Strong background in shipping performant, user-centered applications and reliable architectures for ${job.company}.`;

  const contactLine = [
    candidateEmail ? `Email: ${candidateEmail}` : '',
    candidatePhone ? `Phone: ${candidatePhone}` : '',
    candidatePortfolio ? `Portfolio: ${candidatePortfolio}` : '',
  ].filter(Boolean).join(' | ');

  const tailoredLetter = `Dear ${job.company} Hiring Team,

I am writing to express my enthusiastic interest in the ${job.title} position at ${job.company}. Having built scalable web architectures and developer-facing platforms, I am excited about your team's mission.

My background aligns directly with your requirements:
• Core technical skills: ${(job.matchedSkills || job.tags || ['TypeScript', 'React']).slice(0, 4).join(', ')}
• Experience designing scalable, reliable platforms with high performance standards
• Proven track record collaborating on modern, maintainable codebases

I welcome the opportunity to discuss how my skill set can accelerate ${job.company}'s roadmap.

Warm regards,
${candidateName}
${contactLine}`;

  const telegramPitch = `Hi ${job.company} hiring team! 👋 I saw the opening for ${job.title} and wanted to reach out directly. I specialize in ${(job.matchedSkills || job.tags || ['TypeScript', 'React']).slice(0, 3).join(', ')} and have a track record building high-performance scalable systems. Would love to connect and share my portfolio${candidatePortfolio ? `: ${candidatePortfolio}` : ''}${candidatePhone ? ` | Phone: ${candidatePhone}` : ''}. Thank you! — ${candidateName}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer bg-white px-3 py-2 rounded-xl border border-neutral-200/80 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovered Jobs</span>
        </button>

        <div className="flex items-center gap-2">
          {job.source_url && (
            <a
              href={job.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 transition-colors"
            >
              <span>Original Post</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
              {job.source}
            </span>
            {job.remote && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>Remote Role</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-600 font-medium">
            <span className="flex items-center gap-1.5 text-neutral-900 font-bold">
              <Building className="w-4 h-4 text-neutral-400" />
              <span>{job.company}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-neutral-400" />
              <span>{job.location}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold font-mono">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>{job.salary}</span>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex flex-col gap-2">
          {isApplied ? (
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Application Submitted</span>
              </div>
              <button
                onClick={onViewInApplied}
                className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700 underline cursor-pointer"
              >
                View in Applied Tracker →
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAutoApply(job.id)}
              disabled={isApplying}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold shadow-md transition-all cursor-pointer ${
                isApplying
                  ? 'bg-neutral-800 text-neutral-300 cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-95'
              }`}
            >
              {isApplying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Auto-Applying...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current text-amber-400" />
                  <span>Auto-Apply to {job.company}</span>
                </>
              )}
            </button>
          )}
          <span className="text-[11px] text-neutral-400 text-center font-mono">
            {isTelegram ? `Direct Dispatch to ${job.contact_info}` : 'ATS Form Dispatch'}
          </span>
        </div>
      </div>

      {/* Two Column Layout: Description vs AI Match Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Full Job Description (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-neutral-900 mb-2">Role Overview & Requirements</h2>
              <div className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line font-sans space-y-4">
                {job.description}
              </div>
            </div>

            {/* Tech Stack Tags */}
            <div className="pt-4 border-t border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                Key Technologies & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {(job.tags || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1 rounded-lg bg-neutral-100 text-neutral-800 border border-neutral-200/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Recruiter / Submission Channel info */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5 text-xs">
              <span className="font-bold text-neutral-900 block">
                {isTelegram ? '✈️ Telegram Recruitment Channel Dispatch' : '🏢 Platform Application Endpoint'}
              </span>
              <p className="text-neutral-600">
                {isTelegram
                  ? `This post was sourced from Telegram. CVUME dispatches your tailored application packet directly to recruiter handle ${job.contact_info}.`
                  : `Discovered on ${job.source.toUpperCase()}. Applications are prepared with ATS-compliant format and transmitted to their careers portal.`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: AI Semantic Match & Tailored Submission Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Semantic Match Card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>AI Candidate Match</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                High Priority Match
              </span>
            </div>

            {/* Score Radial Visual */}
            <div className="flex items-center gap-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-mono font-extrabold shadow-sm shrink-0">
                <span className="text-xl leading-none">{matchScore}</span>
                <span className="text-[10px] text-emerald-200">/100</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-neutral-900">
                  {matchScore >= 90 ? 'Exceptional Fit' : 'Strong Fit for this Role'}
                </h4>
                <p className="text-xs text-neutral-600 leading-snug">
                  {job.matchRationale || 'Your skills and architecture background align strongly with this job.'}
                </p>
              </div>
            </div>

            {/* Verified Skills */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Matching Profile Skills ({job.matchedSkills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(job.matchedSkills || job.tags || []).map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {job.missingSkills && job.missingSkills.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Keywords to emphasize in interview
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.missingSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tailored Application Package Preview */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Tailored Application Package</span>
              </h3>
              <button
                onClick={() => handleCopy(
                  activePreviewTab === 'resume' ? `${tailoredResumeHeadline}\n\n${tailoredSummary}` :
                  activePreviewTab === 'letter' ? tailoredLetter : telegramPitch
                )}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Tab switch */}
            <div className="flex rounded-xl bg-neutral-100 p-1 text-xs">
              <button
                onClick={() => setActivePreviewTab('resume')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activePreviewTab === 'resume' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
                }`}
              >
                Resume
              </button>
              <button
                onClick={() => setActivePreviewTab('letter')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activePreviewTab === 'letter' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
                }`}
              >
                Letter
              </button>
              <button
                onClick={() => setActivePreviewTab('telegram')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activePreviewTab === 'telegram' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
                }`}
              >
                Telegram DM
              </button>
            </div>

            {/* Preview Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 leading-relaxed font-sans max-h-64 overflow-y-auto">
              {activePreviewTab === 'resume' ? (
                <div className="space-y-2">
                  <p className="font-bold text-neutral-900 text-sm">{tailoredResumeHeadline}</p>
                  <p className="text-neutral-600">{tailoredSummary}</p>
                </div>
              ) : activePreviewTab === 'letter' ? (
                <div className="whitespace-pre-line text-[11px]">{tailoredLetter}</div>
              ) : (
                <div className="whitespace-pre-line text-neutral-900 font-medium">{telegramPitch}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

