import React, { useState } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  Check, 
  Star 
} from 'lucide-react';
import { api } from '../services/api';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onBackToHome: () => void;
  onAuthSuccess: (email: string, mode: 'login' | 'signup', fullName?: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onBackToHome,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setForgotPasswordNotice(false);

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const response = await api.signup(email, password, fullName.trim());
        setIsSuccess(true);
        setTimeout(() => {
          onAuthSuccess(response.user.email, 'signup', response.user.name);
        }, 500);
      } else {
        const response = await api.login(email, password);
        setIsSuccess(true);
        setTimeout(() => {
          onAuthSuccess(response.user.email, 'login', response.user.name);
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter your email above to receive password reset instructions.');
    } else {
      setErrorMessage('');
      setForgotPasswordNotice(true);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-white text-neutral-900 selection:bg-neutral-200 selection:text-neutral-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-neutral-100 bg-white/95 backdrop-blur-md h-14 shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 group select-none cursor-pointer text-left"
          >
            <div className="w-5 h-5 rounded-md bg-neutral-900 text-white flex items-center justify-center relative shadow-2xs">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-neutral-950 font-sans">
              CVUME
            </span>
          </button>

          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-neutral-600 hover:text-neutral-950 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to landing page</span>
          </button>
        </div>
      </header>

      {/* Main Two-Column Layout (Non-scrollable, vertically balanced) */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 relative overflow-y-auto lg:overflow-hidden py-6 lg:py-0">
        {/* Subtle grid guideline marks */}
        <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto border-x border-neutral-100 flex justify-between">
          <div className="absolute top-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
          <div className="absolute top-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
          <div className="absolute bottom-0 -left-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
          <div className="absolute bottom-0 -right-1.5 text-neutral-300 font-mono text-xs select-none">+</div>
        </div>

        <div className="w-full max-w-5xl mx-auto relative z-10 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* LEFT COLUMN: SIMPLIFIED FORM SECTION */}
            <div className="lg:col-span-6 w-full">
              <div className="p-4 sm:p-8">
                
                {/* Heading */}
                <div className="mb-5">
                  <h1 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-[-0.03em]">
                    {mode === 'login' ? 'Welcome back' : 'Create an account'}
                  </h1>
                  <p className="text-xs text-neutral-500 mt-1">
                    {mode === 'login'
                      ? 'Sign in to access your resumes and tailored applications.'
                      : 'Start building ATS-optimized resumes in minutes.'}
                  </p>
                </div>

                {/* Success State */}
                {isSuccess ? (
                  <div className="py-8 text-center animate-in fade-in space-y-2.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <h3 className="text-sm font-bold text-neutral-950">
                      {mode === 'login' ? 'Signed in successfully!' : 'Account created successfully!'}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Loading your CVUME workspace...
                    </p>
                  </div>
                ) : (
                  /* Form strictly containing INPUT FIELDS ONLY */
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {errorMessage && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 leading-tight">
                        {errorMessage}
                      </div>
                    )}

                    {forgotPasswordNotice && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 leading-tight">
                        Password reset instructions have been sent to <strong>{email}</strong>.
                      </div>
                    )}

                    {/* Sign Up: Full Name */}
                    {mode === 'signup' && (
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Alex Rivera"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            autoComplete="name"
                            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-neutral-950 bg-neutral-50/30 focus:bg-white transition-all placeholder:text-neutral-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Address */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="alex@example.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          autoComplete="email"
                          className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-neutral-950 bg-neutral-50/30 focus:bg-white transition-all placeholder:text-neutral-400"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
                          Password
                        </label>
                        {mode === 'login' && (
                          <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-[11px] text-neutral-500 hover:text-neutral-900 underline underline-offset-2 cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                          className="w-full text-xs sm:text-sm pl-9 pr-9 py-2 border border-neutral-300 rounded-lg focus:outline-neutral-950 bg-neutral-50/30 focus:bg-white transition-all font-mono placeholder:font-sans placeholder:text-neutral-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Log In: Remember Me */}
                    {mode === 'login' && (
                      <div className="flex items-center gap-2 pt-0.5">
                        <input
                          type="checkbox"
                          id="remember"
                          checked={rememberMe}
                          onChange={e => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
                        />
                        <label htmlFor="remember" className="text-xs text-neutral-600 cursor-pointer select-none">
                          Remember me for 30 days
                        </label>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 active:scale-[0.99] text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <span>Authenticating...</span>
                      ) : (
                        <>
                          <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Bottom Toggle Note: Only place with the toggle */}
                <div className="mt-5 pt-4 border-t border-neutral-100 text-center text-xs text-neutral-500">
                  {mode === 'login' ? (
                    <span>
                      New to CVUME?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('signup');
                          setErrorMessage('');
                          setForgotPasswordNotice(false);
                        }}
                        className="font-semibold text-neutral-900 hover:underline cursor-pointer"
                      >
                        Create an account free
                      </button>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setErrorMessage('');
                          setForgotPasswordNotice(false);
                        }}
                        className="font-semibold text-neutral-900 hover:underline cursor-pointer"
                      >
                        Sign in
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: VERY SIMPLIFIED CONTENT & DESIGN LIKE LANDING PAGE */}
            <div className="lg:col-span-6 w-full">
              <div className="bg-[#FAF5EE] border border-[#f0e3d2] rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xs">
                
                {/* Header Tag matching Landing Page */}
                <div className="text-[10px] font-bold tracking-widest text-[#e0644e] uppercase font-sans mb-1.5">
                  RESUME STUDIO & ATS OPTIMIZER
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-neutral-950 tracking-[-0.03em] leading-snug mb-2">
                  Built for candidates who want interviews, not silence.
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  CVUME analyzes every sentence against modern applicant tracking systems and highlights quantifiable achievements.
                </p>

                {/* Compact macOS-style Resume Snippet */}
                <div className="bg-white rounded-xl border border-neutral-200/90 shadow-2xs overflow-hidden mb-4">
                  {/* Traffic dots */}
                  <div className="h-7 bg-neutral-50 border-b border-neutral-200/80 px-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                      <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                      <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="text-[10px] font-medium text-neutral-500">
                      Alex Rivera — Senior Engineer
                    </span>
                    <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      98% ATS Pass
                    </span>
                  </div>

                  {/* Snippet Content */}
                  <div className="p-3.5 space-y-2 text-[11px] text-neutral-600 leading-relaxed">
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>
                        Spearheaded cloud architecture migration cutting render latency by <strong className="text-neutral-950 bg-emerald-50 px-1 rounded">42%</strong>.
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>
                        Designed resilient TypeScript services with <strong className="text-neutral-950 bg-emerald-50 px-1 rounded">99.99% SLA</strong> uptime.
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1.5 border-t border-neutral-100">
                      {['TypeScript', 'React', 'System Design', 'ATS Ready'].map((tag, i) => (
                        <span key={i} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Compact Social Proof Quote */}
                <div className="p-3 rounded-xl bg-white/90 border border-[#f0e3d2] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    SL
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400 stroke-amber-400" />
                      ))}
                      <span className="text-[10px] font-bold text-neutral-700 ml-1">5.0</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 italic truncate">
                      "Landed 4 interviews at Stripe & Linear in 2 weeks."
                    </p>
                    <div className="text-[9px] text-neutral-400">Sarah Lin · Product Designer</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer (Compact single row) */}
      <footer className="py-2.5 border-t border-neutral-100 text-center text-[11px] text-neutral-400 bg-white shrink-0">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <span>© 2026 Cvume · Resume Builder & ATS Studio</span>
          <div className="flex items-center gap-4">
            <button onClick={onBackToHome} className="hover:text-neutral-700 transition-colors cursor-pointer">
              Home
            </button>
            <a href="mailto:abdellahseid0987@gmail.com" className="hover:text-neutral-700 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
