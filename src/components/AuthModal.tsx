import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Linkedin, Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'signin' | 'trial';
  onSuccess?: (userEmail: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signup',
  onSuccess 
}) => {
  // Normalize initial mode to 'login' or 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [step, setStep] = useState<'form' | 'success'>('form');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Post-auth sync settings
  const [selectedFields, setSelectedFields] = useState({
    experience: true,
    skills: true,
    education: true,
  });

  // Sync mode when initialMode prop changes
  useEffect(() => {
    if (initialMode === 'signin' || initialMode === 'login') {
      setMode('login');
    } else {
      setMode('signup');
    }
    setStep('form');
    setErrorMessage('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const res = await api.signup(email, password, fullName.trim());
        setStep('success');
        if (onSuccess) {
          onSuccess(res.user.email);
        }
      } else {
        const res = await api.login(email, password);
        setStep('success');
        if (onSuccess) {
          onSuccess(res.user.email);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider: 'linkedin' | 'google') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setEmail(provider === 'linkedin' ? 'alex.rivera@linkedin.com' : 'alex.rivera@gmail.com');
      setFullName('Alex Rivera');
      setStep('success');
      if (onSuccess) {
        onSuccess(provider === 'linkedin' ? 'alex.rivera@linkedin.com' : 'alex.rivera@gmail.com');
      }
    }, 600);
  };

  const handleCompleteWorkspace = () => {
    onClose();
    setStep('form');
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-neutral-950/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[440px] bg-white rounded-3xl shadow-2xl border border-neutral-200/90 overflow-hidden animate-in zoom-in-95 duration-150 transition-all"
      >
        {/* Header bar */}
        <div className="p-4 px-6 border-b border-neutral-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
              CV
            </div>
            <span className="font-bold text-sm text-neutral-950 font-sans">CVUME</span>
          </div>

          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'form' ? (
          <div className="p-6 sm:p-7">
            {/* Segmented Toggle: Log In / Sign Up */}
            <div className="grid grid-cols-2 p-1 bg-neutral-100/90 rounded-full mb-6 border border-neutral-200/60">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                className={`py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-neutral-950 shadow-2xs font-bold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(''); }}
                className={`py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-neutral-950 shadow-2xs font-bold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-neutral-950 tracking-tight">
                {mode === 'signup' ? 'Start your 14-day free trial' : 'Welcome back to CVUME'}
              </h3>
              <p className="text-xs text-neutral-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                {mode === 'signup'
                  ? 'Build ATS-optimized resumes and tailor bullets for dream jobs. No credit card required.'
                  : 'Sign in to access your master drafts, ATS audits, and tailored resumes.'}
              </p>
            </div>

            {/* Social Auth Buttons */}
            <div className="space-y-2.5 mb-5">
              <button
                type="button"
                onClick={() => handleSocialAuth('linkedin')}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#0a66c2] hover:bg-[#004182] active:scale-[0.99] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <Linkedin className="w-3.5 h-3.5 text-white" />
                <span>{mode === 'signup' ? 'Sign up with LinkedIn (Auto-Import)' : 'Continue with LinkedIn'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 active:scale-[0.99] border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-neutral-200/80" />
              <span className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">
                or with email
              </span>
              <div className="flex-1 h-px bg-neutral-200/80" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 leading-tight">
                  {errorMessage}
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Alex Rivera"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-xl focus:outline-neutral-900 bg-neutral-50/40 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="alex@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-xl focus:outline-neutral-900 bg-neutral-50/40 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to your email.')}
                      className="text-[11px] text-neutral-500 hover:text-neutral-900 underline underline-offset-2"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-9 py-2 border border-neutral-300 rounded-xl focus:outline-neutral-900 bg-neutral-50/40 focus:bg-white transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-neutral-950 hover:bg-neutral-800 active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Start 14-Day Free Trial' : 'Log In'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Mode Switcher */}
            <div className="mt-5 text-center text-xs text-neutral-500">
              {mode === 'signup' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMessage(''); }}
                    className="font-semibold text-neutral-900 hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMessage(''); }}
                    className="font-semibold text-neutral-900 hover:underline cursor-pointer"
                  >
                    Sign up free
                  </button>
                </span>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit encryption · Official ATS compliant</span>
            </div>
          </div>
        ) : (
          /* Success / Onboarding Setup Screen */
          <div className="p-6 sm:p-7 text-center animate-in fade-in">
            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-bold text-neutral-950 mb-1">
              {mode === 'signup' ? 'Welcome to CVUME!' : 'Signed In Successfully'}
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Connected as <span className="font-semibold text-neutral-800">{email}</span>. Configure your active resume studio:
            </p>

            <div className="space-y-2 text-left mb-6">
              {[
                { key: 'experience', label: 'Work Experience', detail: '3 positions · 8 years verified' },
                { key: 'skills', label: 'Core Technical Competencies', detail: '14 skills extracted' },
                { key: 'education', label: 'Education & Honors', detail: 'BS in Computer Science' },
              ].map(sec => (
                <label 
                  key={sec.key}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold text-neutral-900">{sec.label}</div>
                    <div className="text-[10.5px] text-neutral-400">{sec.detail}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedFields[sec.key as keyof typeof selectedFields]}
                    onChange={() => setSelectedFields(prev => ({
                      ...prev,
                      [sec.key]: !prev[sec.key as keyof typeof selectedFields]
                    }))}
                    className="w-4 h-4 accent-neutral-900 rounded cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={handleCompleteWorkspace}
              className="w-full py-3 bg-neutral-950 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
            >
              Open Resume Studio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
