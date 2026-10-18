import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

export const PlanWeekSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'type' | 'tasks' | 'command' | 'search' | 'days'>('type');
  const [typeStep, setTypeStep] = useState(3);
  const [replayKey, setReplayKey] = useState(0);

  const handleReplay = () => {
    setTypeStep(0);
    setReplayKey(prev => prev + 1);
  };

  useEffect(() => {
    if (activeTab === 'type') {
      setTypeStep(0);
      const t1 = setTimeout(() => setTypeStep(1), 300);
      const t2 = setTimeout(() => setTypeStep(2), 700);
      const t3 = setTimeout(() => setTypeStep(3), 1100);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [activeTab, replayKey]);

  return (
    <section id="features" className="py-20 px-4 sm:px-6 relative border-t border-neutral-100">
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
          CRAFT YOUR STORY
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 tracking-[-0.03em] mb-4">
          Draft your resume in one place
        </h2>
        <p className="text-sm sm:text-base text-neutral-600">
          Your achievements, metrics, and career history side by side, in one document.
        </p>
      </div>

      {/* 2-Column Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Features Tabs */}
        <div className="lg:col-span-5 space-y-1">
          {/* Tab 1: Add bullets by typing */}
          <button
            onClick={() => setActiveTab('type')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeTab === 'type'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 font-mono text-xs flex items-center justify-center font-medium text-neutral-700 shrink-0 mt-0.5">
                E
              </span>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Add bullet points by typing
                </h3>
                {activeTab === 'type' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Press E and type 'Increased team velocity by 34% through automated CI'. It formats as an action-driven bullet.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Tab 2: Job requirements next to your draft */}
          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 font-mono text-xs flex items-center justify-center font-medium text-neutral-700 shrink-0 mt-0.5">
                Q
              </span>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Job requirements next to your draft
                </h3>
                {activeTab === 'tasks' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Paste the target job posting in the dock. Match requirements line-by-line as you write.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Tab 3: Use the command menu */}
          <button
            onClick={() => setActiveTab('command')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeTab === 'command'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="px-1.5 h-6 rounded bg-neutral-100 border border-neutral-200/80 font-mono text-xs flex items-center justify-center font-medium text-neutral-700 shrink-0 mt-0.5">
                ⌘K
              </span>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Use the command menu
                </h3>
                {activeTab === 'command' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Switch templates, reorder sections, audit ATS compliance, and export PDF in a keystroke.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Tab 4: Search career history */}
          <button
            onClick={() => setActiveTab('search')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 font-mono text-xs flex items-center justify-center font-medium text-neutral-700 shrink-0 mt-0.5">
                /
              </span>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Search career history & metrics
                </h3>
                {activeTab === 'search' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Search past project wins, revenue impact numbers, and skills across all your roles.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Tab 5: Choose your layout density */}
          <button
            onClick={() => setActiveTab('days')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeTab === 'days'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 font-mono text-xs flex items-center justify-center font-medium text-neutral-700 shrink-0 mt-0.5">
                3
              </span>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Choose your layout density
                </h3>
                {activeTab === 'days' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Auto-tune margins, font sizes, and line-spacing so your resume fits perfectly on 1 page.
                  </p>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Right Preview Box (Warm sand container) */}
        <div className="lg:col-span-7 bg-[#FAF5EE] border border-[#f0e3d2] rounded-2xl p-6 sm:p-7 relative min-h-[380px] flex flex-col justify-between shadow-xs">
          {/* Top Bar with Replay */}
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={handleReplay}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-neutral-600 bg-white/90 hover:bg-white border border-neutral-200 rounded-full shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3 h-3 text-neutral-500" />
              <span>Replay</span>
            </button>
          </div>

          {/* Content depending on active tab */}
          {activeTab === 'type' && (
            <div className="space-y-4">
              {/* Floating Input Bar */}
              <div className="bg-white border border-neutral-200/80 rounded-xl p-2.5 shadow-xs flex items-center gap-2 max-w-md mx-auto">
                <span className="w-5 h-5 rounded bg-neutral-100 border border-neutral-200 font-mono text-[10px] flex items-center justify-center font-semibold text-neutral-600 shrink-0">
                  E
                </span>
                <div className="text-xs sm:text-[13px] text-neutral-800 font-medium flex items-center gap-1.5 flex-wrap">
                  <span>Increased team velocity</span>
                  {typeStep >= 2 && (
                    <span className="bg-[#ede7f6] text-[#673ab7] font-semibold text-[11px] px-1.5 py-0.5 rounded animate-in fade-in">
                      by 34%
                    </span>
                  )}
                  {typeStep >= 3 && (
                    <span className="bg-[#fef3d6] text-[#b06000] font-semibold text-[11px] px-1.5 py-0.5 rounded animate-in fade-in">
                      through automated CI
                    </span>
                  )}
                </div>
              </div>

              {/* Mini Resume Snippet Mock */}
              <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs max-w-md mx-auto space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
                  <span className="text-xs font-bold text-neutral-900">Staff Product Designer</span>
                  <span className="text-[10px] font-mono text-neutral-400">Acme Cloud</span>
                </div>

                <div className="space-y-2 text-[11px] text-neutral-600">
                  <div className="flex items-start gap-1.5">
                    <span className="text-neutral-400 mt-0.5">•</span>
                    <span>Architected core developer workspace used by 2.4M weekly active users.</span>
                  </div>

                  {/* Newly formatted bullet animating in */}
                  <div className={`p-2 rounded bg-[#fef3d6] border border-[#fcd994] text-[#b06000] text-[11px] font-medium leading-relaxed transition-all duration-300 ${
                    typeStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}>
                    <span className="font-bold">• Increased team velocity by 34%</span> through automated CI design tokens and automated testing pipelines.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs max-w-md mx-auto space-y-2.5">
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Job Requirements Matching Drawer
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-200/60">
                <span className="text-xs font-medium text-neutral-800">5+ years React & TypeScript</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Matched in Experience</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50/60 border border-purple-200/60">
                <span className="text-xs font-medium text-purple-900">Design Systems Tokens & Architecture</span>
                <span className="text-[10px] text-purple-700 font-semibold">Matched in Acme Role</span>
              </div>
            </div>
          )}

          {activeTab === 'command' && (
            <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                <span className="font-mono text-xs bg-neutral-100 px-1 rounded text-neutral-500">⌘K</span>
                <span className="text-xs font-medium text-neutral-900">Run ATS scan...</span>
              </div>
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="p-1.5 rounded bg-neutral-50 text-neutral-900 font-medium flex justify-between">
                  <span>Export ATS-friendly single-page PDF</span>
                  <span className="text-[10px] text-neutral-400 font-mono">⌘P</span>
                </div>
                <div className="p-1.5 rounded hover:bg-neutral-50 flex justify-between">
                  <span>Switch template to Minimal ATS</span>
                  <span className="text-[10px] text-neutral-400 font-mono">T</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                <span className="font-mono text-xs text-neutral-400">/</span>
                <span className="text-xs font-medium text-neutral-900">conversion</span>
              </div>
              <div className="p-2 rounded bg-amber-50/70 border border-amber-200 text-xs">
                <span className="font-semibold text-amber-900">Acme Cloud Platform</span>
                <p className="text-[11px] text-amber-800 mt-0.5">"...increasing self-serve onboarding conversion by 28%."</p>
              </div>
            </div>
          )}

          {activeTab === 'days' && (
            <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs max-w-md mx-auto text-center space-y-3">
              <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium gap-1">
                <span className="px-2.5 py-1 rounded bg-white shadow-2xs text-neutral-900">1-Page Fit</span>
                <span className="px-2.5 py-1 text-neutral-500">2-Page Exec</span>
                <span className="px-2.5 py-1 text-neutral-500">CV Longform</span>
              </div>
              <p className="text-xs text-neutral-500">
                Automatic intelligent line-compression prevents awkward orphan lines on second pages.
              </p>
            </div>
          )}

          {/* Bottom subtle note */}
          <div className="text-[11px] text-neutral-400 text-center pt-2">
            Natural language parsing automatically extracts quantifiable impact and powerful action verbs.
          </div>
        </div>
      </div>
    </section>
  );
};
