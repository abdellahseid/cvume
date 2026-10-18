import React from 'react';
import { 
  FileCheck2, 
  Layers, 
  Sliders, 
  Sparkles, 
  Type, 
  Search,
  Linkedin,
  FileText
} from 'lucide-react';

interface MoreFeaturesSectionProps {
  onOpenShortcuts?: () => void;
  onOpenCommand?: () => void;
}

export const MoreFeaturesSection: React.FC<MoreFeaturesSectionProps> = ({ 
  onOpenShortcuts,
  onOpenCommand 
}) => {
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
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="text-[11px] font-bold text-[#e0644e] uppercase tracking-[0.2em] mb-3">
          THE DETAILS
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 tracking-[-0.03em]">
          More features you will use to stand out
        </h2>
      </div>

      {/* 2-Column Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* 1. Connect all your career profiles */}
        <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-neutral-50/60 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
            <Linkedin className="w-3.5 h-3.5 text-[#0a66c2]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 leading-tight">
              Connect all your career profiles
            </h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Import from LinkedIn, GitHub, or previous PDF in one click.
            </p>
          </div>
        </div>

        {/* 2. Keyboard shortcuts for everything */}
        <div 
          onClick={onOpenShortcuts}
          className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-neutral-50/60 transition-colors cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200/80 font-mono text-xs flex items-center justify-center font-bold text-neutral-700 shrink-0 mt-0.5 group-hover:border-neutral-400 transition-colors">
            ?
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 leading-tight group-hover:text-black">
              Keyboard shortcuts for everything
            </h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Do everything without the mouse. Press ? to see every shortcut.
            </p>
          </div>
        </div>

        {/* 3. Real-time ATS compliance scores */}
        <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-neutral-50/60 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
            <FileCheck2 className="w-3.5 h-3.5 text-neutral-700" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 leading-tight">
              Real-time ATS compliance scores
            </h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Get an instant warning if any table, header, or font fails automated parsing.
            </p>
          </div>
        </div>

        {/* 4. Cover letter generator */}
        <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-neutral-50/60 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
            <FileText className="w-3.5 h-3.5 text-neutral-700" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 leading-tight">
              Cover letter generator
            </h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Press Z to generate a matching tailored cover letter in identical typography.
            </p>
          </div>
        </div>

        {/* 5. Multi-version resume manager */}
        <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-neutral-50/60 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
            <Layers className="w-3.5 h-3.5 text-neutral-700" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 leading-tight">
              Multi-version resume manager
            </h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Maintain separate tailored drafts for Product, Engineering, and Management.
            </p>
          </div>
        </div>

        {/* 6. Smart 1-page auto-fitting */}
        <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-neutral-50/60 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
            <Sliders className="w-3.5 h-3.5 text-neutral-700" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 leading-tight">
              Smart 1-page auto-fitting
            </h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Intelligently balances margins and tracking so your content fits onto exactly 1 page.
            </p>
          </div>
        </div>

        {/* 7. Undo any change */}
        <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-neutral-50/60 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200/80 font-mono text-[10px] flex items-center justify-center font-bold text-neutral-700 shrink-0 mt-0.5">
            ⌘Z
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 leading-tight">
              Undo any change
            </h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Press ⌘Z to undo, even an AI bullet rewrite or accidental deletion.
            </p>
          </div>
        </div>

        {/* 8. Search career history & skills */}
        <div 
          onClick={onOpenCommand}
          className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-neutral-50/60 transition-colors cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200/80 font-mono text-xs flex items-center justify-center font-bold text-neutral-700 shrink-0 mt-0.5 group-hover:border-neutral-400 transition-colors">
            /
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 leading-tight group-hover:text-black">
              Search career history & skills
            </h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Search by title, metrics, tools, achievements, or project scope.
            </p>
          </div>
        </div>

        {/* 9. Adjust typography & line height */}
        <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-neutral-50/60 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
            <Type className="w-3.5 h-3.5 text-neutral-700" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 leading-tight">
              Adjust typography & line height
            </h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Pick from recruiter-approved fonts (Plus Jakarta, Inter, Garamond, JetBrains).
            </p>
          </div>
        </div>

        {/* 10. Free ATS scanner & keyword checker */}
        <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-neutral-50/60 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
            <Search className="w-3.5 h-3.5 text-neutral-700" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 leading-tight">
              Free ATS scanner & keyword checker
            </h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Compare any job post at cvume.com/ats-check. No account needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
