import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: 'What is CVUME?',
    answer: 'CVUME is a unified resume builder, portfolio studio, and career workspace designed to help professionals pass modern Applicant Tracking Systems (ATS) and land senior roles. It integrates bullet writing, keyword optimization, and shareable web links into one fast, keyboard-first environment.',
  },
  {
    question: 'Will my resume pass ATS filters (Workday, Greenhouse, Lever)?',
    answer: 'Yes, 100%. CVUME generates single-column and dual-column layouts strictly compliant with modern ATS parsers. Fonts, structural headers, and metadata are cleanly embedded so robots read your work history without text fragmentation or lost tables.',
  },
  {
    question: 'Can I import my existing LinkedIn profile or PDF?',
    answer: 'Yes! Simply upload your existing resume PDF or connect your LinkedIn profile. CVUME extracts all roles, dates, company names, educational degrees, and bullet points into organized, editable fields in seconds.',
  },
  {
    question: 'How does the 1-page auto-fitting work?',
    answer: 'Our layout engine dynamically evaluates line breaks, typographic measure, and section padding. If your content spills over by 2-3 lines onto a second page, it automatically adjusts margin density and letter tracking to produce a flawless single-page document.',
  },
  {
    question: 'What happens when my trial ends?',
    answer: 'Your 14-day free trial gives you unrestricted access to all features, exports, and AI rewrites. We remind you before your first charge, and you can cancel anytime. If you choose not to subscribe, your saved resumes and data remain intact.',
  },
  {
    question: 'Can I create multiple resume versions for different jobs?',
    answer: 'Yes! You can maintain an unlimited number of tailored resumes. Quickly duplicate your master resume to create custom versions targeting specific companies (e.g. Stripe vs Figma) or varying disciplines (Design vs Engineering Management).',
  },
  {
    question: 'Does the AI rewrite fabricate credentials or experience?',
    answer: 'Never. CVUME acts strictly as an executive editor and formatting copilot. It helps you quantify your real experiences, suggest powerful action verbs, and structure bullets using Google\'s XYZ formula without inventing false claims.',
  },
  {
    question: 'Can I download in Word (DOCX) or Markdown format?',
    answer: 'Yes. In addition to publication-grade vector PDFs, you can export editable Microsoft Word (.docx) files, raw Markdown (.md), or structured JSON for technical portfolios.',
  },
  {
    question: 'Can recruiters view my live web resume on mobile?',
    answer: 'Yes! Your public link (cvume/@you) renders as a responsive, fast-loading web profile with dark mode support, verified credentials, and direct PDF download buttons.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-14 sm:py-20 px-4 sm:px-6 relative border-t border-neutral-100">
      {/* Guideline crosshairs */}
      <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto border-x border-neutral-100 flex justify-between">
        <div className="absolute top-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute top-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Heading and Illustration */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#e0644e] uppercase tracking-[0.2em] mb-3">
              FAQ
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-[-0.03em] mb-4">
              Frequently asked questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Anything else? Email us at{' '}
              <a
                href="mailto:abdellahseid0987@gmail.com"
                className="text-neutral-900 font-medium underline underline-offset-2 hover:text-black break-all sm:break-normal"
              >
                abdellahseid0987@gmail.com
              </a>
            </p>
          </div>

          {/* Friendly Purple Speech Bubble Illustration matching screenshot */}
          <div className="mt-6 lg:mt-8 pt-2 lg:pt-4">
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 text-[#d1c4e9]"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer bubble with tail */}
              <path
                d="M20 22C20 16.4772 24.4772 12 30 12H70C75.5228 12 80 16.4772 80 22V56C80 61.5228 75.5228 66 70 66H42L26 78V66H30C24.4772 66 20 61.5228 20 56V22Z"
                fill="#d8cbe9"
                stroke="#18181b"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* 3 chat dots */}
              <circle cx="38" cy="40" r="3.5" fill="#18181b" />
              <circle cx="50" cy="40" r="3.5" fill="#18181b" />
              <circle cx="62" cy="40" r="3.5" fill="#18181b" />
            </svg>
          </div>
        </div>

        {/* Right Column: Accordion List */}
        <div className="lg:col-span-8 divide-y divide-neutral-100 border-t border-b border-neutral-100">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-sm font-semibold text-neutral-900 group-hover:text-black transition-colors pr-4">
                    {item.question}
                  </span>
                  <div className="w-5 h-5 flex items-center justify-center text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 text-xs sm:text-[13px] text-neutral-600 leading-relaxed pr-2 sm:pr-6 animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
