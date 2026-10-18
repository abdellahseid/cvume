import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  onStartTrial: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onStartTrial }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const price = billingCycle === 'monthly' ? '$7' : '$6';
  const billingNote = billingCycle === 'monthly' ? 'Billed monthly.' : 'Billed annually ($72/year).';

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 relative border-t border-neutral-100">
      {/* Guideline crosshairs */}
      <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto border-x border-neutral-100 flex justify-between">
        <div className="absolute top-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute top-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="text-[11px] font-bold text-[#e0644e] uppercase tracking-[0.2em] mb-3">
          PRICING
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 tracking-[-0.03em] mb-4">
          One simple plan
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto">
          Try every feature free for 14 days. We remind you before your first charge, and you can cancel anytime.
        </p>

        {/* Toggle (Monthly / Yearly) */}
        <div className="mt-8 inline-flex items-center p-1 bg-neutral-100 rounded-full text-xs font-medium border border-neutral-200/70">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              billingCycle === 'yearly'
                ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Yearly</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
              Save 15%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Card (Warm sand container) */}
      <div className="max-w-4xl mx-auto bg-[#FAF5EE] border border-[#f0e3d2] rounded-2xl p-8 sm:p-12 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Column: Price & Button */}
          <div className="space-y-6">
            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                {billingCycle === 'monthly' ? 'Monthly plan' : 'Yearly plan'}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-neutral-950 tracking-tight font-mono">
                  {price}
                </span>
                <span className="text-sm text-neutral-500 font-medium">a month</span>
              </div>
              <div className="text-xs text-neutral-500 mt-2 font-medium">
                {billingNote}
              </div>
            </div>

            <div>
              <button
                onClick={onStartTrial}
                className="w-full py-3.5 px-6 bg-neutral-950 hover:bg-neutral-800 active:scale-98 text-white rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                Start your 14-day free trial
              </button>
              <p className="text-[11px] text-neutral-500 text-center mt-2">
                Nothing is charged for 14 days.
              </p>
            </div>
          </div>

          {/* Right Column: Features Checklist */}
          <div className="space-y-4 md:border-l md:border-neutral-200/60 md:pl-10">
            <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              Everything included
            </h4>

            <ul className="space-y-2.5 text-xs text-neutral-700">
              {[
                'Unlimited tailored resume versions',
                'Full ATS keyword score & gap analysis',
                'Export to PDF, Word (DOCX), and Markdown',
                'Cover letter builder with custom job matching',
                'Live shareable web resume link (cvume/@you)',
                'AI bullet quantifier and executive verb enhancer',
                'No CVUME watermark on exported documents',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-neutral-700 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-neutral-200/50 text-[11px] text-neutral-400 leading-relaxed">
              Modern, Minimal, and Executive templates, 1-page auto-fit, skills audit, and every shortcut are included too.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
