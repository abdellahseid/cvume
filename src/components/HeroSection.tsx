import React from 'react';
import { HeroResumeWindow } from './HeroResumeWindow';

interface HeroSectionProps {
  onStartTrial: () => void;
  onDownloadApp: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartTrial, onDownloadApp }) => {
  return (
    <section className="relative pt-16 pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Background guideline crosshairs */}
      <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto border-x border-neutral-100 flex justify-between">
        <div className="absolute top-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute top-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 mb-10">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-[48px] font-bold text-neutral-950 tracking-[-0.035em] leading-[1.14] mb-6 max-w-3xl mx-auto text-balance">
          Your Resume, Portfolio, And{' '}
          <br className="hidden sm:inline" />
          Cover Letters, All In One Place.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-[18px] md:text-[19px] text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-8 tracking-[-0.01em] font-normal">
          Cvume works with your LinkedIn profile. Draft your experience, tailor for every job description, and pass every ATS filter at a glance.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <button
            onClick={onStartTrial}
            className="w-full sm:w-auto px-7 py-3 text-sm font-medium text-white bg-neutral-950 hover:bg-neutral-800 active:scale-98 rounded-full transition-all shadow-sm cursor-pointer"
          >
            Try it free for 14 days
          </button>
          <button
            onClick={onDownloadApp}
            className="w-full sm:w-auto px-7 py-3 text-sm font-medium text-neutral-800 hover:text-neutral-950 bg-white hover:bg-neutral-50 active:scale-98 border border-neutral-300/80 rounded-full transition-all shadow-2xs cursor-pointer"
          >
            Download PDF & Word
          </button>
        </div>

        {/* Interactive Try It Callout */}
        <div className="inline-flex items-center gap-2.5 py-1 px-3 bg-neutral-50/80 border border-neutral-200/60 rounded-full text-xs text-neutral-500">
          <span className="bg-neutral-900 text-white font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded-sm tracking-wider">
            TRY IT
          </span>
          <span>
            Click on any bullet to polish with AI, reorder experience or test ATS keyword match.
          </span>
        </div>
      </div>

      {/* Hero Window */}
      <div className="relative z-10">
        <HeroResumeWindow />
      </div>
    </section>
  );
};
