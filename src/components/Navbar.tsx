import React from 'react';
import { FileText, Sparkles, User, LogOut, Palette } from 'lucide-react';

interface NavbarProps {
  onSignInClick: () => void;
  onSignUpClick?: () => void;
  onOpenCommand?: () => void;
  user?: { email: string; name?: string } | null;
  currentAppTab?: 'generator' | 'profile' | 'templates';
  onNavigateTab?: (tab: 'generator' | 'profile' | 'templates') => void;
  onSignOut?: () => void;
  isLoggedInView?: boolean;
  onNavigateHome?: () => void;
  onOpenStudio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSignInClick,
  onSignUpClick,
  user,
  currentAppTab,
  onNavigateTab,
  onSignOut,
  isLoggedInView,
  onNavigateHome,
  onOpenStudio,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 group select-none cursor-pointer text-left"
        >
          <div className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center relative shadow-2xs">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-neutral-950 font-sans">
            Cvume
          </span>
        </button>

        {/* Center Navigation */}
        {isLoggedInView ? (
          <div className="flex items-center gap-1 sm:gap-2 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200/80">
            <button
              onClick={() => onNavigateTab?.('generator')}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentAppTab === 'generator'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e0644e]" />
              <span>Job Tailor & Copilot</span>
            </button>
            <button
              onClick={() => onNavigateTab?.('profile')}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentAppTab === 'profile'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Candidate Profile</span>
            </button>
            <button
              onClick={() => onNavigateTab?.('templates')}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentAppTab === 'templates'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-purple-600" />
              <span>Resume Templates & PDF</span>
            </button>
          </div>
        ) : (
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-neutral-600">
            <a href="#features" className="hover:text-neutral-950 transition-colors">
              Features
            </a>
            <a href="#tailoring" className="hover:text-neutral-950 transition-colors">
              AI Tailoring
            </a>
            <a href="#pricing" className="hover:text-neutral-950 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-neutral-950 transition-colors">
              FAQ
            </a>
          </nav>
        )}

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {!isLoggedInView && onOpenStudio && (
                <button
                  onClick={onOpenStudio}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#e0644e]" />
                  <span>Open Studio</span>
                </button>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
                <div className="w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-700">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-neutral-700 max-w-[120px] truncate">
                  {user.name || user.email.split('@')[0]}
                </span>
                <button
                  onClick={onSignOut}
                  title="Sign out"
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={onSignInClick}
                className="text-xs md:text-sm font-medium text-neutral-600 hover:text-neutral-950 px-2.5 py-1.5 transition-colors cursor-pointer"
              >
                Sign in
              </button>
              <button
                onClick={onSignUpClick || onSignInClick}
                className="px-4 py-2 text-xs md:text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 active:scale-98 rounded-full transition-all shadow-xs cursor-pointer"
              >
                Build Resume
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
