import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PlanWeekSection } from './components/PlanWeekSection';
import { TimezonesSection } from './components/TimezonesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ShareTimeSection } from './components/ShareTimeSection';
import { AssistantSection } from './components/AssistantSection';
import { MoreFeaturesSection } from './components/MoreFeaturesSection';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { BottomCtaSection } from './components/BottomCtaSection';
import { Footer } from './components/Footer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { CommandMenuModal } from './components/CommandMenuModal';
import { SignOutModal } from './components/SignOutModal';
import { AuthPage } from './components/AuthPage';
import { JobApplicationStudio } from './components/JobApplicationStudio';
import { ProfilePage } from './components/ProfilePage';
import { ResumeTemplateStudio } from './components/ResumeTemplateStudio';
import { ApplicationGenerationResult } from './types/profile';
import { getStoredProfile, saveStoredProfile, syncProfileWithDatabase } from './services/profileService';
import { api, getCachedUser } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'app'>('landing');
  const [currentAppTab, setCurrentAppTab] = useState<'generator' | 'profile' | 'templates'>('generator');
  const [activeExportResult, setActiveExportResult] = useState<ApplicationGenerationResult | null>(() => {
    try {
      const cached = localStorage.getItem('cvume_active_export_result');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(() => getCachedUser());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Verify backend database session on mount
  useEffect(() => {
    api.me().then(res => {
      if (res?.user) {
        setUser(res.user);
        syncProfileWithDatabase();
      } else {
        // If server says token is invalid, clear user
        setUser(null);
      }
    }).catch(() => {
      // Offline fallback: keep cached user
    });
  }, []);

  // Check URL hash on initial load or popstate
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#signup') {
        setAuthMode('signup');
        setCurrentView('auth');
      } else if (hash === '#auth' || hash === '#login' || hash === '#signin') {
        setAuthMode('login');
        setCurrentView('auth');
      } else if (hash === '#app' || hash === '#generator' || hash === '#dashboard') {
        setCurrentView('app');
        setCurrentAppTab('generator');
      } else if (hash === '#profile') {
        setCurrentView('app');
        setCurrentAppTab('profile');
      } else if (hash === '#templates' || hash === '#resume-templates') {
        setCurrentView('app');
        setCurrentAppTab('templates');
      } else if (hash === '' || hash === '#home' || hash === '#features' || hash === '#pricing' || hash === '#faq' || hash === '#tailoring') {
        setCurrentView('landing');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateToAuth = (mode: 'login' | 'signup') => {
    if (user) {
      // If already logged in, go straight to generator app
      setCurrentView('app');
      setCurrentAppTab('generator');
      window.location.hash = '#app';
      return;
    }
    setAuthMode(mode);
    setCurrentView('auth');
    window.location.hash = `#${mode}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentView('landing');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTrial = () => {
    navigateToAuth('login');
  };

  const handleSignIn = () => {
    navigateToAuth('login');
  };

  const handleDownloadApp = () => {
    navigateToAuth('login');
  };

  const handleUploadResume = () => {
    navigateToAuth('login');
  };

  const handleAuthSuccess = (email: string, mode: 'login' | 'signup', fullName?: string) => {
    const userName = fullName || email.split('@')[0];
    const userObj = { email, name: userName };
    setUser(userObj);
    try {
      localStorage.setItem('cvume_logged_in_user', JSON.stringify(userObj));
      // Update stored profile with user's name and email if available
      const existingProfile = getStoredProfile();
      saveStoredProfile({
        ...existingProfile,
        email: email || existingProfile.email,
        fullName: fullName || existingProfile.fullName,
      });
    } catch (e) {
      console.error(e);
    }

    // Go directly to the logged in application view
    setCurrentView('app');
    setCurrentAppTab('generator');
    window.location.hash = '#app';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(
      mode === 'signup'
        ? `Account created! Welcome to CVUME, ${userName}`
        : `Signed in as ${email}. Your profile is loaded.`
    );
  };

  const handleRequestSignOut = () => {
    setSignOutModalOpen(true);
  };

  const handleConfirmSignOut = async () => {
    setIsSigningOut(true);
    try {
      await api.logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(null);
      setIsSigningOut(false);
      setSignOutModalOpen(false);
      setCurrentView('landing');
      window.location.hash = '';
      showToast('Signed out of CVUME.');
    }
  };

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      // ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandMenuOpen(prev => !prev);
        return;
      }

      // Escape
      if (e.key === 'Escape') {
        setCommandMenuOpen(false);
        setShortcutsModalOpen(false);
        return;
      }

      // Shortcuts when not in text input
      if (!isInput && currentView === 'landing') {
        if (e.key === '?') {
          e.preventDefault();
          setShortcutsModalOpen(true);
        } else if (e.key === '/') {
          e.preventDefault();
          setCommandMenuOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  const handleActionSelect = (actionId: string) => {
    if (actionId === 'copy_link') {
      showToast('Live resume link copied: cvume/@alex');
    } else if (actionId === 'ats_scan') {
      showToast('ATS Score: 98/100 — 14 keywords matched, 0 format warnings');
    } else if (actionId === 'export_pdf' || actionId.startsWith('template_')) {
      if (user) {
        setCurrentView('app');
        setCurrentAppTab('templates');
        window.location.hash = '#templates';
      } else {
        navigateToAuth('login');
      }
    } else if (actionId.startsWith('tailor_')) {
      if (user) {
        setCurrentView('app');
        setCurrentAppTab('generator');
      } else {
        const el = document.getElementById('tailoring');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      showToast(`Tailored resume for ${actionId.replace('tailor_', '').toUpperCase()}`);
    } else if (actionId.startsWith('template_')) {
      showToast(`Switched layout template to ${actionId.replace('template_', '')}`);
    } else if (actionId === 'new_bullet') {
      window.scrollTo({ top: 350, behavior: 'smooth' });
      showToast('Click any bullet in the Resume Studio to polish with AI');
    }
  };

  // If in Auth View, render the dedicated AuthPage!
  if (currentView === 'auth') {
    return (
      <>
        <AuthPage
          initialMode={authMode}
          onBackToHome={navigateToHome}
          onAuthSuccess={handleAuthSuccess}
        />
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg border border-neutral-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {toastMessage}
          </div>
        )}
      </>
    );
  }

  // If in Logged-In App View (Job Generator & Profile)
  if (currentView === 'app') {
    return (
      <div className="min-h-screen bg-neutral-50/50 text-neutral-900 selection:bg-neutral-200 selection:text-neutral-900 flex flex-col font-sans">
        {/* Studio Top Navbar */}
        <Navbar
          onSignInClick={handleSignIn}
          onSignUpClick={handleStartTrial}
          user={user}
          isLoggedInView={true}
          currentAppTab={currentAppTab}
          onNavigateTab={(tab) => {
            setCurrentAppTab(tab);
            window.location.hash = `#${tab}`;
          }}
          onSignOut={handleRequestSignOut}
          onNavigateHome={navigateToHome}
        />

        {/* Studio Main Workspace */}
        <main className="flex-1">
          {currentAppTab === 'generator' ? (
            <JobApplicationStudio
              onOpenProfile={() => {
                setCurrentAppTab('profile');
                window.location.hash = '#profile';
              }}
              onOpenTemplates={(applicationResult) => {
                setActiveExportResult(applicationResult);
                try {
                  localStorage.setItem('cvume_active_export_result', JSON.stringify(applicationResult));
                } catch (e) {
                  console.error('Error saving active export result', e);
                }
                setCurrentAppTab('templates');
                window.location.hash = '#templates';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onToast={showToast}
            />
          ) : currentAppTab === 'profile' ? (
            <ProfilePage
              onGoToGenerator={() => {
                setCurrentAppTab('generator');
                window.location.hash = '#generator';
              }}
              onToast={showToast}
            />
          ) : (
            <ResumeTemplateStudio
              initialResult={activeExportResult}
              onBackToStudio={() => {
                setCurrentAppTab('generator');
                window.location.hash = '#generator';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onToast={showToast}
            />
          )}
        </main>

        {/* Minimal Studio Footer */}
        <footer className="border-t border-neutral-200 bg-white py-4 px-6 text-xs text-neutral-500">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-neutral-800">Cvume Studio</span>
              <span>•</span>
              <span>AI Tailoring & Profile Engine</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={navigateToHome}
                className="hover:text-neutral-950 transition-colors cursor-pointer"
              >
                View Public Landing Page
              </button>
              <span>•</span>
              <button
                onClick={handleRequestSignOut}
                className="hover:text-neutral-950 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </footer>

        {/* Sign Out Confirmation Modal */}
        <SignOutModal
          isOpen={signOutModalOpen}
          onClose={() => setSignOutModalOpen(false)}
          onConfirm={handleConfirmSignOut}
          userEmail={user?.email}
          userName={user?.name}
          isLoading={isSigningOut}
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg border border-neutral-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  // Otherwise, render full Landing Page
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-200 selection:text-neutral-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onSignInClick={handleSignIn}
        onSignUpClick={handleStartTrial}
        user={user}
        onSignOut={handleRequestSignOut}
        onOpenStudio={() => {
          setCurrentView('app');
          setCurrentAppTab('generator');
          window.location.hash = '#app';
        }}
        onNavigateHome={navigateToHome}
        onOpenCommand={() => setCommandMenuOpen(true)}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          onStartTrial={handleStartTrial}
          onDownloadApp={handleDownloadApp}
        />

        {/* 2. Draft Your Story */}
        <PlanWeekSection />

        {/* 3. ATS and Recruiters */}
        <TimezonesSection />

        {/* 4. How It Works */}
        <HowItWorksSection onSignInClick={handleSignIn} />

        {/* 5. Portfolio & Links */}
        <ShareTimeSection />

        {/* 6. AI Rewrite and Copilot */}
        <AssistantSection />

        {/* 7. The Details (More features you will use to stand out) */}
        <MoreFeaturesSection
          onOpenShortcuts={() => setShortcutsModalOpen(true)}
          onOpenCommand={() => setCommandMenuOpen(true)}
        />

        {/* 8. Pricing */}
        <PricingSection onStartTrial={handleStartTrial} />

        {/* 9. Frequently Asked Questions */}
        <FaqSection />

        {/* 10. Bottom CTA */}
        <BottomCtaSection
          onStartTrial={handleStartTrial}
          onUploadResume={handleUploadResume}
        />
      </main>

      {/* Footer */}
      <Footer
        onSignInClick={handleSignIn}
        onDownloadApp={handleDownloadApp}
      />

      {/* Overlays for Command Menu and Shortcuts */}
      <CommandMenuModal
        isOpen={commandMenuOpen}
        onClose={() => setCommandMenuOpen(false)}
        onActionSelect={handleActionSelect}
      />

      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* Sign Out Confirmation Modal */}
      <SignOutModal
        isOpen={signOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        onConfirm={handleConfirmSignOut}
        userEmail={user?.email}
        userName={user?.name}
        isLoading={isSigningOut}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg border border-neutral-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
