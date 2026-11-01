import React, { useState } from 'react';
import { FileText, Sparkles, User, LogOut, Menu, X } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => {
            closeMobileMenu();
            onNavigateHome?.();
          }}
          className="flex items-center gap-2 group select-none cursor-pointer text-left shrink-0"
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
              <span className="hidden sm:inline">Job Tailor & Copilot</span>
              <span className="sm:hidden">Tailor</span>
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
              <span className="hidden sm:inline">Candidate Profile</span>
              <span className="sm:hidden">Profile</span>
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
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {!isLoggedInView && onOpenStudio && (
                <button
                  onClick={onOpenStudio}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#e0644e]" />
                  <span className="hidden sm:inline">Open Studio</span>
                  <span className="sm:hidden">Studio</span>
                </button>
              )}

              <div className="flex items-center gap-1.5 sm:gap-2 pl-2 border-l border-neutral-200">
                <div className="w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-700 shrink-0">
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
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                onClick={onSignInClick}
                className="text-xs md:text-sm font-medium text-neutral-600 hover:text-neutral-950 px-2 sm:px-2.5 py-1.5 transition-colors cursor-pointer"
              >
                Sign in
              </button>
              <button
                onClick={onSignUpClick || onSignInClick}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs md:text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 active:scale-98 rounded-full transition-all shadow-xs cursor-pointer shrink-0"
              >
                <span className="hidden xs:inline sm:inline">Build Resume</span>
                <span className="xs:hidden sm:hidden">Build</span>
              </button>

              {/* Hamburger Button for Mobile Landing Navigation */}
              {!isLoggedInView && (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(prev => !prev)}
                  className="md:hidden p-2 text-neutral-600 hover:text-neutral-950 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer ml-1"
                  aria-label="Toggle navigation menu"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu for Landing View */}
      {!isLoggedInView && mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-md">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-neutral-700">
            <a
              href="#features"
              onClick={closeMobileMenu}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
            >
              Features
            </a>
            <a
              href="#tailoring"
              onClick={closeMobileMenu}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
            >
              AI Tailoring
            </a>
            <a
              href="#pricing"
              onClick={closeMobileMenu}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={closeMobileMenu}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
            >
              FAQ
            </a>
          </nav>

          {!user && (
            <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  closeMobileMenu();
                  onSignInClick();
                }}
                className="w-full py-2 text-center text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  closeMobileMenu();
                  (onSignUpClick || onSignInClick)();
                }}
                className="w-full py-2 text-center text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Build Resume Free
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
