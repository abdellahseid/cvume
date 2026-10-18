import React, { useState } from 'react';
import { 
  RotateCcw, 
  Sparkles, 
  Crosshair, 
  TrendingUp, 
  Monitor, 
  Terminal, 
  Check, 
  Copy, 
  FileCode, 
  AlertCircle,
  Building,
  Rocket,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const AssistantSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<'assistant' | 'clashes' | 'colleague' | 'travel' | 'menubar' | 'coding'>('assistant');
  const [optimizedState, setOptimizedState] = useState(true);
  const [selectedVerb, setSelectedVerb] = useState<'Architected' | 'Overhauled' | 'Championed'>('Architected');
  const [toneMode, setToneMode] = useState<'startup' | 'enterprise'>('startup');
  const [selectedMetric, setSelectedMetric] = useState<'conversion' | 'latency' | 'revenue'>('conversion');
  const [exportLang, setExportLang] = useState<'latex' | 'markdown' | 'json'>('latex');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleReplay = () => {
    setOptimizedState(false);
    setTimeout(() => {
      setOptimizedState(true);
    }, 500);
  };

  const handleUndo = () => {
    setOptimizedState(false);
  };

  const handleCopyCode = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 relative border-t border-neutral-100">
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
          AI REWRITE AND COPILOT
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 tracking-[-0.03em] mb-4">
          Get help polishing every bullet
        </h2>
        <p className="text-sm sm:text-base text-neutral-600">
          Ask the assistant to quantify achievements, strengthen action verbs, and tailor keywords for target roles.
        </p>
      </div>

      {/* 2-Column Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Feature Items List */}
        <div className="lg:col-span-5 space-y-1">
          {/* Feature 1: Ask the resume copilot */}
          <button
            onClick={() => setActiveFeature('assistant')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'assistant'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Ask the resume copilot
                </h3>
                {activeFeature === 'assistant' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Select any bullet point and tell the copilot: "Make it more executive" or "Highlight leadership."
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Feature 2: Detect weak verbs and vague passive voice */}
          <button
            onClick={() => setActiveFeature('clashes')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'clashes'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
                <Crosshair className="w-3.5 h-3.5 text-neutral-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Detect weak verbs and vague passive voice
                </h3>
                {activeFeature === 'clashes' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Flags "assisted with", "helped manage", or "responsible for" and swaps them with strong executive verbs.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Feature 3: Tailor tone: startup vs. enterprise */}
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
                T
              </span>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Tailor tone: startup vs. enterprise
                </h3>
                {activeFeature === 'colleague' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Shift tone seamlessly between zero-to-one velocity narratives and enterprise governance depth.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Feature 4: Quantify metrics & business impact */}
          <button
            onClick={() => setActiveFeature('travel')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'travel'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5 text-neutral-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Quantify metrics & business impact
                </h3>
                {activeFeature === 'travel' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Prompts you with smart estimation questions to back every responsibility with real business data.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Feature 5: Live split-screen preview */}
          <button
            onClick={() => setActiveFeature('menubar')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'menubar'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
                <Monitor className="w-3.5 h-3.5 text-neutral-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Live split-screen preview
                </h3>
                {activeFeature === 'menubar' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Instant rendering shows page height, margin balance, and typographic rhythm as you type.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Feature 6: Export from markdown or LaTeX */}
          <button
            onClick={() => setActiveFeature('coding')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'coding'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
                <Terminal className="w-3.5 h-3.5 text-neutral-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Export from markdown or LaTeX
                </h3>
                {activeFeature === 'coding' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    For technical professionals who prefer source control, export pristine JSON, Markdown, or TeX.
                  </p>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Right Preview Box (Lavender container) with DYNAMIC CONTENT FOR ALL 6 BUTTONS */}
        <div className="lg:col-span-7 bg-[#F4F1F9] border border-[#e4dff2] rounded-2xl p-6 sm:p-7 relative min-h-[440px] flex flex-col justify-between shadow-xs">
          {/* Top Bar with Replay */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e4dff2]/70">
            <span className="text-[11px] font-semibold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              {activeFeature === 'assistant' && 'AI XYZ-Format Bullet Optimization'}
              {activeFeature === 'clashes' && 'Action Verb Linter & Weak Phrase Detector'}
              {activeFeature === 'colleague' && 'Tone Calibration: Startup vs Enterprise'}
              {activeFeature === 'travel' && 'Metric Quantification Engine'}
              {activeFeature === 'menubar' && 'Split-Screen Page Height & Margin Inspector'}
              {activeFeature === 'coding' && 'LaTeX, Markdown & JSON Source Export'}
            </span>
            <button
              onClick={handleReplay}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-neutral-600 bg-white/90 hover:bg-white border border-neutral-200 rounded-full shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3 h-3 text-neutral-500" />
              <span>Reset</span>
            </button>
          </div>

          {/* DYNAMIC CONTENT FOR EACH BUTTON */}

          {/* DESIGN 1: COPILOT BULLET REWRITE (ASSISTANT) */}
          {activeFeature === 'assistant' && (
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-xs max-w-md mx-auto w-full relative animate-in fade-in duration-300">
              <div className="grid grid-cols-2 border-b border-neutral-100 pb-2 text-xs font-semibold text-neutral-700 mb-3">
                <div className="text-neutral-500">Original Bullet</div>
                <div className="text-purple-700">AI Optimized (XYZ Format)</div>
              </div>

              <div className="space-y-3 min-h-[160px] relative text-xs">
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-500 text-[11.5px] leading-relaxed">
                  "Helped redesign developer onboarding and made design tokens for the team."
                </div>

                {optimizedState && (
                  <div className="p-3 rounded-lg bg-purple-50/70 border border-purple-200 text-purple-900 text-[11.5px] leading-relaxed animate-in fade-in space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-700 font-bold uppercase">
                      <Sparkles className="w-3 h-3" />
                      <span>Quantified + Executive Verb</span>
                    </div>
                    <p>
                      <span className="font-semibold text-purple-950">"Spearheaded multi-brand token system</span> across 14 web products, reducing design-to-engineering handoff time by <span className="font-semibold text-purple-950">40%</span>."
                    </p>
                  </div>
                )}
              </div>

              {optimizedState && (
                <div className="mt-4 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs animate-in fade-in">
                  <div className="flex items-center gap-2 text-neutral-800">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                    </div>
                    <span className="text-[11.5px] font-medium leading-tight">
                      Quantified impact with metric and active verb
                    </span>
                  </div>
                  <button
                    onClick={handleUndo}
                    className="px-2 py-0.5 text-[11px] font-mono text-neutral-500 hover:text-neutral-900 bg-white border border-neutral-200 rounded shadow-2xs hover:bg-neutral-100 cursor-pointer"
                  >
                    Undo ⌘Z
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DESIGN 2: WEAK VERBS DETECTOR (CLASHES) */}
          {activeFeature === 'clashes' && (
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-xs max-w-md mx-auto w-full space-y-3.5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="font-bold text-xs text-neutral-900">Passive Voice & Weak Verbs Detected</span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  2 Phrases Flagged
                </span>
              </div>

              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-200 text-xs text-neutral-700 leading-relaxed">
                "<span>Was responsible for managing</span> customer database migration and <span>helped with</span> cloud stability."
              </div>

              <div>
                <div className="text-[11px] font-semibold text-neutral-700 mb-1.5">
                  Select High-Impact Replacement Verb:
                </div>
                <div className="flex gap-2">
                  {(['Architected', 'Overhauled', 'Championed'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setSelectedVerb(v)}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedVerb === v
                          ? 'bg-purple-900 text-white border-purple-900 shadow-2xs'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-sans">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 block mb-1">
                  Transformed Output:
                </span>
                "{selectedVerb} enterprise database sharding strategy, elevating cloud SLA uptime to 99.98% across 4.2M users."
              </div>
            </div>
          )}

          {/* DESIGN 3: TAILOR TONE (COLLEAGUE) */}
          {activeFeature === 'colleague' && (
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-xs max-w-md mx-auto w-full space-y-3.5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="font-bold text-xs text-neutral-900">Audience Calibration Matrix</span>
                <span className="text-[10px] font-mono uppercase bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                  Tone Engine
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setToneMode('startup')}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    toneMode === 'startup'
                      ? 'bg-purple-50 border-purple-400 shadow-2xs'
                      : 'bg-neutral-50/60 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-neutral-900">
                    <Rocket className="w-3.5 h-3.5 text-purple-600" />
                    <span>Early-Stage Startup</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Velocity, hacking & autonomy</div>
                </button>

                <button
                  onClick={() => setToneMode('enterprise')}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    toneMode === 'enterprise'
                      ? 'bg-purple-50 border-purple-400 shadow-2xs'
                      : 'bg-neutral-50/60 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-neutral-900">
                    <Building className="w-3.5 h-3.5 text-purple-600" />
                    <span>Fortune 500</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Scale, governance & cross-team</div>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 leading-relaxed">
                {toneMode === 'startup' ? (
                  <p>
                    <strong className="text-purple-950 font-semibold bg-purple-100/70 px-1 rounded">"Operated with high autonomy</strong>, writing production TypeScript, managing CI/CD pipelines solo, and shipping v1 in 4 weeks."
                  </p>
                ) : (
                  <p>
                    <strong className="text-purple-950 font-semibold bg-purple-100/70 px-1 rounded">"Orchestrated cross-functional alignment</strong> across 8 stakeholder organizations, driving compliance and reducing platform regressions by 34%."
                  </p>
                )}
              </div>
            </div>
          )}

          {/* DESIGN 4: QUANTIFY METRICS (TRAVEL) */}
          {activeFeature === 'travel' && (
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-xs max-w-md mx-auto w-full space-y-3.5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="font-bold text-xs text-neutral-900">Quantifiable Metric Inferrer</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  XYZ Format
                </span>
              </div>

              <div>
                <div className="text-[11px] text-neutral-500 mb-1.5">Pick Impact Dimension to Highlight:</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedMetric('conversion')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedMetric === 'conversion'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    +24% Conv
                  </button>
                  <button
                    onClick={() => setSelectedMetric('latency')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedMetric === 'latency'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    -45% Latency
                  </button>
                  <button
                    onClick={() => setSelectedMetric('revenue')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedMetric === 'revenue'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    $2.8M ARR
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-purple-50/80 border border-purple-200 text-xs text-purple-950 leading-relaxed">
                {selectedMetric === 'conversion' && (
                  <p>
                    "Redesigned the onboarding checkout step using optimistic UI updates, lifting end-to-end conversion rate by <strong className="font-bold text-purple-950">24%</strong> across 1.2M sessions."
                  </p>
                )}
                {selectedMetric === 'latency' && (
                  <p>
                    "Replaced legacy SQL queries with Redis distributed caching, cutting p99 API response latency by <strong className="font-bold text-purple-950">45%</strong> under peak load."
                  </p>
                )}
                {selectedMetric === 'revenue' && (
                  <p>
                    "Launched enterprise SSO and audit-logging add-ons, unlocking <strong className="font-bold text-purple-950">$2.8M ARR</strong> in new Fortune 500 deal closures."
                  </p>
                )}
              </div>
            </div>
          )}

          {/* DESIGN 5: LIVE SPLIT-SCREEN PREVIEW (MENUBAR) */}
          {activeFeature === 'menubar' && (
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-xs max-w-md mx-auto w-full space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="font-bold text-xs text-neutral-900">Page Boundary & Margin Analyzer</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  1-Page Exact Fit
                </span>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-neutral-900">Total Page Height Used</div>
                  <div className="text-[11px] text-neutral-500">96.4% · No trailing orphaned lines</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs font-mono">
                  96%
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex items-center justify-between p-1.5 rounded bg-white border border-neutral-100">
                  <span>Balanced Margins (Top/Bottom 0.75")</span>
                  <span className="text-emerald-600 font-semibold">Calibrated ✓</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-white border border-neutral-100">
                  <span>Typographic Rhythm (11pt / 14pt leading)</span>
                  <span className="text-emerald-600 font-semibold">Perfect ✓</span>
                </div>
              </div>
            </div>
          )}

          {/* DESIGN 6: EXPORT MARKDOWN & LATEX (CODING) */}
          {activeFeature === 'coding' && (
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-xs max-w-md mx-auto w-full space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="font-bold text-xs text-neutral-900">Source Code Export</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex gap-2">
                {(['latex', 'markdown', 'json'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setExportLang(l)}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold uppercase font-mono border transition-all cursor-pointer ${
                      exportLang === l
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                    }`}
                  >
                    .{l}
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 text-neutral-200 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-36">
                {exportLang === 'latex' && (
                  <pre>
{`\\section{Experience}
\\textbf{Stripe} \\hfill 2022 -- Present \\\\
\\textit{Staff Systems Architect}
\\begin{itemize}
  \\item Spearheaded cloud migration cutting compute latency by 42\\%.
\\end{itemize}`}
                  </pre>
                )}
                {exportLang === 'markdown' && (
                  <pre>
{`## Experience
**Stripe** | *Staff Systems Architect* (2022 — Present)
- Spearheaded cloud migration cutting compute latency by 42%.
- Designed TypeScript micro-frontends with 99.98% SLA uptime.`}
                  </pre>
                )}
                {exportLang === 'json' && (
                  <pre>
{`{
  "basics": { "name": "Alex Rivera" },
  "work": [{
    "company": "Stripe",
    "position": "Staff Systems Architect",
    "highlights": ["Cut latency by 42%"]
  }]
}`}
                  </pre>
                )}
              </div>
            </div>
          )}

          <div className="text-[11px] text-neutral-500 text-center pt-2">
            The copilot preserves your authentic achievements while polishing phrasing for maximum recruiter resonance.
          </div>
        </div>
      </div>
    </section>
  );
};
