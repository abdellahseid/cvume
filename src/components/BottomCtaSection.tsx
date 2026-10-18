import React from 'react';

interface BottomCtaSectionProps {
  onStartTrial: () => void;
  onUploadResume: () => void;
}

export const BottomCtaSection: React.FC<BottomCtaSectionProps> = ({ 
  onStartTrial, 
  onUploadResume 
}) => {
  return (
    <section className="py-20 px-4 sm:px-6 relative">
      {/* Guideline crosshairs */}
      <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto border-x border-neutral-100 flex justify-between">
        <div className="absolute top-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute top-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
      </div>

      <div className="max-w-5xl mx-auto bg-[#FAF5EE] border border-[#f0e3d2] rounded-3xl p-8 sm:p-12 relative shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Cute Resume Document Illustration */}
        <div className="shrink-0 flex items-center justify-center">
          <svg
            className="w-24 h-24 transform -rotate-3 hover:rotate-0 transition-transform"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Resume Sheet Body */}
            <rect
              x="18"
              y="16"
              width="64"
              height="72"
              rx="8"
              fill="white"
              stroke="#18181b"
              strokeWidth="2.5"
            />
            {/* Header Red/Coral Tag */}
            <path
              d="M18 24C18 19.5817 21.5817 16 26 16H50V30H18V24Z"
              fill="#e05342"
              stroke="#18181b"
              strokeWidth="2"
            />
            {/* Avatar circle */}
            <circle cx="32" cy="42" r="5" fill="#f48b71" stroke="#18181b" strokeWidth="1.5" />
            {/* Title bars */}
            <rect x="42" y="39" width="30" height="3" rx="1.5" fill="#18181b" />
            <rect x="42" y="45" width="20" height="2.5" rx="1" fill="#71717a" />

            {/* Resume text lines */}
            <rect x="26" y="55" width="48" height="2.5" rx="1" fill="#e4e4e7" />
            <rect x="26" y="61" width="44" height="2.5" rx="1" fill="#e4e4e7" />
            <rect x="26" y="67" width="36" height="2.5" rx="1" fill="#a7f3d0" />

            {/* Bullet squares */}
            <rect x="26" y="75" width="4" height="4" rx="1" fill="#e05342" />
            <rect x="33" y="76" width="36" height="2" rx="1" fill="#71717a" />
          </svg>
        </div>

        {/* Center Content */}
        <div className="text-center md:text-left flex-1 max-w-lg">
          <h3 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-[-0.03em] leading-snug mb-2">
            Start building your dream resume with Cvume
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 mb-6">
            Import from LinkedIn and try everything free for 14 days.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
            <button
              onClick={onStartTrial}
              className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-neutral-950 hover:bg-neutral-800 active:scale-98 rounded-full transition-all shadow-sm cursor-pointer"
            >
              Start your free trial
            </button>
            <button
              onClick={onUploadResume}
              className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-neutral-950 bg-white hover:bg-neutral-50 active:scale-98 border border-neutral-300/80 rounded-full transition-all shadow-2xs cursor-pointer"
            >
              Upload existing resume
            </button>
          </div>
        </div>

        {/* Right: Cute Green Checkmark Badge */}
        <div className="shrink-0 flex items-center justify-center">
          <svg
            className="w-20 h-20 transform rotate-3 hover:rotate-0 transition-transform"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="18"
              y="18"
              width="64"
              height="64"
              rx="16"
              fill="#a7f3d0"
              stroke="#18181b"
              strokeWidth="2.5"
            />
            <path
              d="M34 50L45 61L67 39"
              stroke="#18181b"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};
