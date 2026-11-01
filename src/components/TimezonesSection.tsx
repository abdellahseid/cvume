import React, { useState } from 'react';
import { 
  RotateCcw, 
  CheckCircle2, 
  Target, 
  Users, 
  Sparkles, 
  Building2, 
  Flame, 
  Check, 
  Search, 
  ChevronRight,
  ShieldCheck,
  Zap,
  TrendingUp
} from 'lucide-react';

export const TimezonesSection: React.FC = () => {
  // Experience filter scrubber (e.g., 5 to 12 years)
  const [expYears, setExpYears] = useState<number>(8);
  const [activeFeature, setActiveFeature] = useState<'clocks' | 'travel' | 'moved' | 'colleague'>('clocks');

  // State for Target Role Switcher (Feature 2)
  const [selectedRole, setSelectedRole] = useState<'stripe' | 'linear' | 'figma'>('stripe');
  const [addedKeyword, setAddedKeyword] = useState<boolean>(false);

  // State for Company Culture (Feature 3)
  const [cultureMode, setCultureMode] = useState<'startup' | 'enterprise' | 'product'>('startup');

  // Dynamic match scores based on scrubber
  const staffScore = Math.min(99, Math.round(84 + expYears * 1.5));
  const uiScore = Math.min(98, Math.round(76 + expYears * 1.8));
  const mgmtScore = Math.min(95, Math.round(62 + expYears * 2.1));

  const handleReset = () => {
    setExpYears(8);
    setAddedKeyword(false);
    setSelectedRole('stripe');
    setCultureMode('startup');
  };

  return (
    <section id="tailoring" className="py-20 px-4 sm:px-6 relative border-t border-neutral-100">
      {/* Guideline crosshairs */}
      <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto border-x border-neutral-100 flex justify-between">
        <div className="absolute top-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute top-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-14">
        <div className="text-[11px] font-bold text-[#e0644e] uppercase tracking-[0.2em] mb-3">
          ATS AND RECRUITERS
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 tracking-[-0.03em] mb-4">
          Tailor for roles in any industry
        </h2>
        <p className="text-sm sm:text-base text-neutral-600">
          See your match score next to the job description, and keyword gaps highlighted instantly.
        </p>
      </div>

      {/* 2-Column Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Interactive Match Visualizer Card */}
        <div className="lg:col-span-7 bg-[#FAF5EE] border border-[#f0e3d2] rounded-2xl p-4 sm:p-6 lg:p-7 relative min-h-[420px] flex flex-col justify-between shadow-xs">
          {/* Top Bar with Replay */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#f0e3d2]/70 gap-2">
            <span className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-[#e0644e] shrink-0" />
              <span className="truncate">
                {activeFeature === 'clocks' && 'Interactive ATS Keyword Scrubber'}
                {activeFeature === 'travel' && 'Target Role Switcher & Gap Matcher'}
                {activeFeature === 'moved' && 'Company Culture & Tone Alignment'}
                {activeFeature === 'colleague' && 'Recruiter 6-Second Screen Simulator'}
              </span>
            </span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-neutral-600 bg-white/90 hover:bg-white border border-neutral-200 rounded-full shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <RotateCcw className="w-3 h-3 text-neutral-500" />
              <span>Reset</span>
            </button>
          </div>

          {/* DYNAMIC CONTENT BASED ON ACTIVE BUTTON */}

          {/* DESIGN 1: KEYWORD GAP ANALYSIS (CLOCKS) */}
          {activeFeature === 'clocks' && (
            <div className="space-y-4 sm:space-y-5 my-auto relative pt-2 pb-2 animate-in fade-in duration-300">
              {/* Bars list container with relative positioning for scrubber pin */}
              <div className="relative space-y-3.5">
                {/* Role 1: Staff Systems Designer */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-20 sm:w-28 shrink-0">
                    <div className="text-xs font-semibold text-neutral-900 leading-tight truncate">Staff Designer</div>
                    <div className="text-[10px] text-neutral-500 font-mono">Stripe</div>
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-neutral-900 w-10 sm:w-14 shrink-0 tabular-nums">
                    {staffScore}%
                  </div>
                  {/* Keyword match segments */}
                  <div className="flex-1 h-6 rounded-md overflow-hidden bg-neutral-200 flex relative shadow-2xs">
                    <div className="w-[45%] bg-[#a7f3d0] opacity-95" title="Design Systems Match" />
                    <div className="w-[35%] bg-[#ffe082] opacity-90" title="TypeScript & React" />
                    <div className="w-[20%] bg-[#b39ddb] opacity-80" title="Leadership" />
                  </div>
                </div>

                {/* Role 2: Principal UI Architect */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-20 sm:w-28 shrink-0">
                    <div className="text-xs font-semibold text-neutral-900 leading-tight truncate">UI Architect</div>
                    <div className="text-[10px] text-neutral-500 font-mono">Figma</div>
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-neutral-900 w-10 sm:w-14 shrink-0 tabular-nums">
                    {uiScore}%
                  </div>
                  {/* Keyword match segments */}
                  <div className="flex-1 h-6 rounded-md overflow-hidden bg-neutral-200 flex relative shadow-2xs">
                    <div className="w-[40%] bg-[#ffe082] opacity-90" title="Component Tokens" />
                    <div className="w-[40%] bg-[#a7f3d0] opacity-95" title="Core Architecture" />
                    <div className="w-[20%] bg-[#b39ddb] opacity-80" title="A/B Testing" />
                  </div>
                </div>

                {/* Role 3: Engineering Manager */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-20 sm:w-28 shrink-0">
                    <div className="text-xs font-semibold text-neutral-900 leading-tight truncate">Eng Manager</div>
                    <div className="text-[10px] text-neutral-500 font-mono">Linear</div>
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-neutral-900 w-10 sm:w-14 shrink-0 tabular-nums">
                    {mgmtScore}%
                  </div>
                  {/* Keyword match segments */}
                  <div className="flex-1 h-6 rounded-md overflow-hidden bg-neutral-200 flex relative shadow-2xs">
                    <div className="w-[25%] bg-[#b39ddb] opacity-80" />
                    <div className="w-[45%] bg-[#ffe082] opacity-90" />
                    <div className="w-[30%] bg-[#9fa8da] opacity-90" />
                  </div>
                </div>
              </div>

              {/* Scrubber slider range */}
              <div className="pt-3">
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={expYears}
                  onChange={(e) => setExpYears(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
                  aria-label="Filter by years of experience"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1">
                  <span>4 yrs</span>
                  <span>6 yrs</span>
                  <span>8 yrs</span>
                  <span>10 yrs</span>
                  <span>12+ yrs</span>
                </div>
              </div>
            </div>
          )}

          {/* DESIGN 2: TARGET ROLE SWITCHER (TRAVEL) */}
          {activeFeature === 'travel' && (
            <div className="space-y-4 my-auto animate-in fade-in duration-300">
              {/* Role Tabs */}
              <div className="flex gap-1.5 sm:gap-2 p-1 bg-white/80 rounded-xl border border-neutral-200/80">
                <button
                  onClick={() => { setSelectedRole('stripe'); setAddedKeyword(false); }}
                  className={`flex-1 py-1.5 px-1 sm:px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer truncate ${
                    selectedRole === 'stripe'
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span className="hidden sm:inline">Stripe · Staff Frontend</span>
                  <span className="sm:hidden">Stripe</span>
                </button>
                <button
                  onClick={() => { setSelectedRole('linear'); setAddedKeyword(false); }}
                  className={`flex-1 py-1.5 px-1 sm:px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer truncate ${
                    selectedRole === 'linear'
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span className="hidden sm:inline">Linear · Tech Lead</span>
                  <span className="sm:hidden">Linear</span>
                </button>
                <button
                  onClick={() => { setSelectedRole('figma'); setAddedKeyword(false); }}
                  className={`flex-1 py-1.5 px-1 sm:px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer truncate ${
                    selectedRole === 'figma'
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span className="hidden sm:inline">Figma · UI Systems</span>
                  <span className="sm:hidden">Figma</span>
                </button>
              </div>

              {/* Match Card */}
              <div className="bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-neutral-900 truncate">
                      {selectedRole === 'stripe' && 'Staff Frontend Infrastructure'}
                      {selectedRole === 'linear' && 'Full-Stack Performance Lead'}
                      {selectedRole === 'figma' && 'Design Systems Principal'}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate">
                      Target Job Description · Greenhouse ATS #4928
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-base font-bold text-emerald-600">
                      {addedKeyword ? '98%' : selectedRole === 'stripe' ? '92%' : selectedRole === 'linear' ? '89%' : '94%'}
                    </span>
                    <span className="text-[10px] text-neutral-400 block -mt-0.5">Match Score</span>
                  </div>
                </div>

                {/* Keyword Comparison */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/60 gap-2">
                    <span className="text-emerald-950 flex items-center gap-1.5 text-[11px] sm:text-[11.5px] truncate">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">React 19 & TypeScript Strict Mode</span>
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded shrink-0">
                      Exact Match
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/60 gap-2">
                    <span className="text-emerald-950 flex items-center gap-1.5 text-[11px] sm:text-[11.5px] truncate">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">Distributed State & WebSockets</span>
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded shrink-0">
                      Exact Match
                    </span>
                  </div>

                  {addedKeyword ? (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-300 animate-in fade-in gap-2">
                      <span className="text-emerald-950 flex items-center gap-1.5 text-[11px] sm:text-[11.5px] font-medium truncate">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">Micro-Frontend Architecture</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-1.5 py-0.5 rounded shrink-0">
                        +6% Added
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/80 border border-amber-200/70 gap-2">
                      <span className="text-amber-950 flex items-center gap-1.5 text-[11px] sm:text-[11.5px] truncate">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">Micro-Frontend Architecture <span className="text-amber-600">(Missing)</span></span>
                      </span>
                      <button
                        onClick={() => setAddedKeyword(true)}
                        className="text-[10px] font-bold text-white bg-amber-600 hover:bg-amber-700 px-2 py-0.5 rounded transition-colors cursor-pointer shadow-2xs shrink-0"
                      >
                        + Auto-Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DESIGN 3: COMPANY CULTURE ALIGNMENT (MOVED) */}
          {activeFeature === 'moved' && (
            <div className="space-y-4 my-auto animate-in fade-in duration-300">
              {/* Culture Selector */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  onClick={() => setCultureMode('startup')}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    cultureMode === 'startup'
                      ? 'bg-white border-neutral-900 shadow-2xs'
                      : 'bg-white/60 border-neutral-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-900">
                    <Flame className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>Startup</span>
                  </div>
                  <div className="text-[9.5px] sm:text-[10px] text-neutral-500 mt-0.5 truncate">Speed & Ownership</div>
                </button>

                <button
                  onClick={() => setCultureMode('enterprise')}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    cultureMode === 'enterprise'
                      ? 'bg-white border-neutral-900 shadow-2xs'
                      : 'bg-white/60 border-neutral-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-900">
                    <Building2 className="w-3 h-3 text-blue-500 shrink-0" />
                    <span>Enterprise</span>
                  </div>
                  <div className="text-[9.5px] sm:text-[10px] text-neutral-500 mt-0.5 truncate">Governance & Scale</div>
                </button>

                <button
                  onClick={() => setCultureMode('product')}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    cultureMode === 'product'
                      ? 'bg-white border-neutral-900 shadow-2xs'
                      : 'bg-white/60 border-neutral-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-900">
                    <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>PLG</span>
                  </div>
                  <div className="text-[9.5px] sm:text-[10px] text-neutral-500 mt-0.5 truncate">Metrics & UX</div>
                </button>
              </div>

              {/* Dynamic Phrasing Comparison */}
              <div className="bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="font-semibold text-neutral-900">Tailored Phrasing Analysis</span>
                  <span className="text-[10px] font-mono uppercase bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded shrink-0">
                    {cultureMode} calibrated
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/90 text-xs text-neutral-700 leading-relaxed font-sans">
                  {cultureMode === 'startup' && (
                    <p>
                      <strong className="text-neutral-950 font-semibold bg-rose-50 text-rose-950 px-1 rounded">"Owned end-to-end checkout MVP</strong>, shipping from wireframe to production in 3 weeks and unlocking <strong className="text-neutral-950 font-semibold bg-rose-50 text-rose-950 px-1 rounded">$1.4M ARR</strong> with zero dedicated QA."
                    </p>
                  )}
                  {cultureMode === 'enterprise' && (
                    <p>
                      <strong className="text-neutral-950 font-semibold bg-blue-50 text-blue-950 px-1 rounded">"Architected multi-region checkout infrastructure</strong> compliant with SOC2 and ISO-27001, maintaining <strong className="text-neutral-950 font-semibold bg-blue-50 text-blue-950 px-1 rounded">99.99% uptime</strong> across 18M enterprise end users."
                    </p>
                  )}
                  {cultureMode === 'product' && (
                    <p>
                      <strong className="text-neutral-950 font-semibold bg-amber-50 text-amber-950 px-1 rounded">"Spearheaded self-serve onboarding experimentation</strong>, running 12 A/B multivariate tests to lift 30-day product activation by <strong className="text-neutral-950 font-semibold bg-amber-50 text-amber-950 px-1 rounded">28%</strong>."
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-500 pt-1 gap-1">
                  <span>ATS Keyword Match: <strong className="text-emerald-600 font-semibold">97%</strong></span>
                  <span className="text-neutral-400">Calibrated for hiring team priorities</span>
                </div>
              </div>
            </div>
          )}

          {/* DESIGN 4: RECRUITER VIEW SIMULATION (COLLEAGUE) */}
          {activeFeature === 'colleague' && (
            <div className="space-y-4 my-auto animate-in fade-in duration-300">
              {/* Recruiter Screen Status */}
              <div className="bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-4 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-2.5 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      #1
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-950">Applicant Rank in Greenhouse</div>
                      <div className="text-[10px] text-neutral-500">Screened against 148 candidates</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full self-start sm:self-auto">
                    Fast-Track to Interview
                  </span>
                </div>

                {/* 6-Second Heatmap Attention breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="text-[11px] font-semibold text-neutral-700">
                    Recruiter 6-Second Glance Heatmap:
                  </div>

                  <div className="space-y-1.5">
                    <div>
                      <div className="flex justify-between text-[10px] text-neutral-500 mb-0.5">
                        <span>Role Title & Seniority Progression</span>
                        <span className="font-mono text-emerald-700 font-bold">2.4s (High Attention)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[85%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-neutral-500 mb-0.5">
                        <span>Quantified Business Metrics in Bullets</span>
                        <span className="font-mono text-emerald-700 font-bold">2.1s (High Attention)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[75%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-neutral-500 mb-0.5">
                        <span>Technical Skills & Core Stack</span>
                        <span className="font-mono text-neutral-600">1.5s</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full w-[50%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ATS Parser Verification */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-600">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Clean Workday & Greenhouse Parser Test</span>
                  </span>
                  <span className="font-bold text-emerald-700 shrink-0">0 Errors</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer note inside card */}
          <div className="text-[11px] text-neutral-500 text-center pt-2">
            {activeFeature === 'clocks' && 'Adjust seniority to see ATS match scores recomputed across target roles.'}
            {activeFeature === 'travel' && 'Switch between live job requisitions to test your resume alignment.'}
            {activeFeature === 'moved' && 'Phrasing automatically adapts to match what hiring managers value most.'}
            {activeFeature === 'colleague' && 'Simulation shows how internal hiring software categorizes your resume.'}
          </div>
        </div>

        {/* Right Feature List */}
        <div className="lg:col-span-5 space-y-1">
          {/* Feature 1: Live keyword gap analysis */}
          <button
            onClick={() => setActiveFeature('clocks')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'clocks'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Live keyword gap analysis
                </h3>
                {activeFeature === 'clocks' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Highlights hard skills and ATS search terms missing from your bullet points.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Feature 2: Target role switcher */}
          <button
            onClick={() => setActiveFeature('travel')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'travel'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 font-mono text-xs flex items-center justify-center font-medium text-neutral-700 shrink-0 mt-0.5">
                Z
              </span>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Target role switcher
                </h3>
                {activeFeature === 'travel' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Press Z to compare your draft against a different job posting in real time.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Feature 3: Company culture alignment */}
          <button
            onClick={() => setActiveFeature('moved')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'moved'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
                <Target className="w-3.5 h-3.5 text-neutral-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Company culture alignment
                </h3>
                {activeFeature === 'moved' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Adapts phrasing for early-stage startups vs. Fortune 500 enterprises automatically.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Feature 4: Recruiter view simulation */}
          <button
            onClick={() => setActiveFeature('colleague')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'colleague'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 font-mono text-xs flex items-center justify-center font-medium text-neutral-700 shrink-0 mt-0.5">
                P
              </span>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Recruiter view simulation
                </h3>
                {activeFeature === 'colleague' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    See exactly how internal hiring teams and automated ATS parsers grade your resume.
                  </p>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
