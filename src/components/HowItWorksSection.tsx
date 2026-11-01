import React, { useState } from 'react';
import { Check, Linkedin, FileText } from 'lucide-react';

interface HowItWorksSectionProps {
  onSignInClick: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onSignInClick }) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('PDF');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopy = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 relative border-t border-neutral-100">
      {/* Guideline crosshairs */}
      <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto border-x border-neutral-100 flex justify-between">
        <div className="absolute top-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute top-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16">
        <div className="text-[11px] font-bold text-[#e0644e] uppercase tracking-[0.2em] mb-3">
          HOW IT WORKS
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-950 tracking-[-0.03em] mb-3 sm:mb-4">
          Get hired in three steps
        </h2>
        <p className="text-sm sm:text-base text-neutral-600">
          You keep your career history. CVUME formats, tailors, and exports it.
        </p>
      </div>

      {/* 3 Steps Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        {/* Step 1 */}
        <div className="flex flex-col justify-between">
          <div className="mb-4 sm:mb-6">
            <div className="w-6 h-6 rounded-full bg-neutral-900 text-white font-mono text-xs font-bold flex items-center justify-center mb-3">
              1
            </div>
            <h3 className="text-base font-bold text-neutral-950 mb-1.5">
              Import with LinkedIn or PDF
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Your roles and skills show up in seconds. Every bullet is automatically formatted.
            </p>
          </div>

          {/* Visual Card 1 */}
          <div className="bg-[#FAF5EE] border border-[#f0e3d2] rounded-xl p-4 sm:p-5 flex flex-col justify-center min-h-[190px] shadow-2xs">
            <button
              onClick={onSignInClick}
              className="w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 mb-3.5 shadow-xs transition-colors cursor-pointer"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0a66c2]" />
              <span>Import with LinkedIn</span>
            </button>

            <div className="space-y-1.5 text-[11px] font-medium text-neutral-700 bg-white/80 p-2.5 rounded-lg border border-neutral-200/60">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Work Experience
                </span>
                <span className="text-emerald-600 font-normal text-[10px]">Synced</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Core Skills (14)
                </span>
                <span className="text-emerald-600 font-normal text-[10px]">Synced</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Education & Honors
                </span>
                <span className="text-emerald-600 font-normal text-[10px]">Synced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col justify-between">
          <div className="mb-4 sm:mb-6">
            <div className="w-6 h-6 rounded-full bg-neutral-900 text-white font-mono text-xs font-bold flex items-center justify-center mb-3">
              2
            </div>
            <h3 className="text-base font-bold text-neutral-950 mb-1.5">
              Tailor with AI copilot
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Paste the job post. Cvume matches keywords, quantifies metrics, and reorders bullets.
            </p>
          </div>

          {/* Visual Card 2 */}
          <div className="bg-[#FAF5EE] border border-[#f0e3d2] rounded-xl p-4 sm:p-5 flex flex-col justify-center min-h-[190px] shadow-2xs">
            <div className="bg-white/90 p-2.5 rounded-lg border border-neutral-200/60">
              {/* Role match badges */}
              <div className="grid grid-cols-3 gap-1 mb-2 text-center text-[10px]">
                <div className="text-neutral-500">Stripe</div>
                <div className="text-neutral-900 font-semibold">Figma</div>
                <div className="text-neutral-500">Linear</div>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-neutral-400 mb-2 text-center">
                <span className="bg-emerald-50 text-emerald-700 py-0.5 rounded font-medium">96% ATS</span>
                <span className="bg-emerald-50 text-emerald-700 py-0.5 rounded font-medium">98% ATS</span>
                <span className="bg-neutral-100 py-0.5 rounded">91% ATS</span>
              </div>

              {/* Bullet blocks */}
              <div className="space-y-1.5">
                <div className="p-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-medium truncate">
                  Architected multi-brand design tokens (+40% velocity)
                </div>
                <div className="p-1 rounded bg-[#fef3d6] border border-[#fcd994] text-[#b06000] text-[10px] font-medium truncate">
                  Increased onboarding conversion by 28%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col justify-between">
          <div className="mb-4 sm:mb-6">
            <div className="w-6 h-6 rounded-full bg-neutral-900 text-white font-mono text-xs font-bold flex items-center justify-center mb-3">
              3
            </div>
            <h3 className="text-base font-bold text-neutral-950 mb-1.5">
              Share or export ATS-ready
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Export pixel-perfect PDF, Word, or send a live web link with real-time viewer tracking.
            </p>
          </div>

          {/* Visual Card 3 */}
          <div className="bg-[#FAF5EE] border border-[#f0e3d2] rounded-xl p-4 sm:p-5 flex flex-col justify-center min-h-[190px] relative shadow-2xs mb-2 md:mb-0">
            <div className="bg-white/90 p-3 rounded-lg border border-neutral-200/60 space-y-2.5">
              <div className="text-[11px] font-semibold text-neutral-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neutral-500" />
                <span className="truncate">Alex Rivera · Resume (ATS Pass)</span>
              </div>

              {/* Format selection */}
              <div className="flex items-center gap-1.5">
                {['PDF', 'DOCX', 'Web Link'].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`flex-1 py-1 text-center text-[10.5px] rounded-md transition-all font-mono ${
                      selectedFormat === fmt
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Floating Copied Badge */}
            <div
              onClick={handleCopy}
              className="absolute -bottom-2 right-4 bg-neutral-950 text-white text-[10px] py-1 px-2.5 rounded-md flex items-center gap-1.5 shadow-md cursor-pointer hover:bg-neutral-800 transition-all select-none"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="font-sans">Link copied!</span>
                </>
              ) : (
                <>
                  <span className="text-neutral-400 font-sans">Share link</span>
                  <span className="font-mono text-neutral-200">cvume/@alex</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
