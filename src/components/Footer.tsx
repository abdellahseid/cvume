import React from 'react';
import { FileText } from 'lucide-react';

interface FooterProps {
  onSignInClick: () => void;
  onDownloadApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSignInClick, onDownloadApp }) => {
  return (
    <footer className="relative pt-16 pb-12 px-4 sm:px-6 border-t border-neutral-100 bg-white">
      {/* Guideline crosshairs */}
      <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto border-x border-neutral-100 flex justify-between">
        <div className="absolute top-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute top-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-10 pb-12 md:pb-16">
          {/* Brand info */}
          <div className="col-span-2 md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-neutral-900 text-white flex items-center justify-center relative shadow-2xs">
                <FileText className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight text-neutral-950 font-sans">
                Cvume
              </span>
            </div>

            <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
              Your resume, portfolio and cover letters in one place, optimized for modern hiring.
            </p>
          </div>

          {/* Links 1: PRODUCT */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-wider">
              Product
            </div>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <a href="#features" className="hover:text-neutral-950 transition-colors">
                  Templates
                </a>
              </li>
              <li>
                <a href="#tailoring" className="hover:text-neutral-950 transition-colors">
                  AI Tailoring
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-neutral-950 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-neutral-950 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Links 2: APPS AND TOOLS */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <div className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-wider">
              Apps & tools
            </div>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <button 
                  onClick={onDownloadApp} 
                  className="hover:text-neutral-950 transition-colors cursor-pointer text-left"
                >
                  Desktop app
                </button>
              </li>
              <li>
                <a href="#tailoring" className="hover:text-neutral-950 transition-colors">
                  Free ATS scanner
                </a>
              </li>
              <li>
                <button 
                  onClick={onSignInClick} 
                  className="hover:text-neutral-950 transition-colors cursor-pointer text-left"
                >
                  Sign in
                </button>
              </li>
            </ul>
          </div>

          {/* Links 3: LEGAL */}
          <div className="col-span-2 sm:col-span-1 md:col-span-3 space-y-3">
            <div className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-wider">
              Legal & Support
            </div>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <a href="#" className="hover:text-neutral-950 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neutral-950 transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a 
                  href="mailto:abdellahseid0987@gmail.com" 
                  className="hover:text-neutral-950 transition-colors break-all"
                >
                  abdellahseid0987@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
          <div>© 2026 CVUME · All rights reserved.</div>
          <div className="text-neutral-400 text-[11px]">Pass ATS filters with confidence</div>
        </div>
      </div>
    </footer>
  );
};
