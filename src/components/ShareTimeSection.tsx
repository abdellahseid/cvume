import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { 
  RotateCcw, 
  FileText, 
  Shield, 
  Check, 
  Eye, 
  Copy, 
  Download, 
  Smartphone, 
  Monitor, 
  Lock, 
  Building, 
  Sliders, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const ShareTimeSection: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'Word' | 'TXT'>('PDF');
  const [activeFeature, setActiveFeature] = useState<'booking' | 'guests' | 'onetime' | 'everyone' | 'double' | 'accounts'>('booking');
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedCompany, setSelectedCompany] = useState<'stripe' | 'linear' | 'airbnb'>('stripe');
  const [targetSalary, setTargetSalary] = useState<number>(210);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [autoFillDone, setAutoFillDone] = useState(false);

  const handleCopy = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulateExport = () => {
    setIsExporting(true);
    setExportComplete(false);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      if (selectedFormat === 'PDF') {
        try {
          const doc = new jsPDF('p', 'mm', 'a4');
          doc.setFontSize(22);
          doc.setTextColor(17, 24, 39);
          doc.text('Alex Rivera', 15, 20);
          doc.setFontSize(12);
          doc.setTextColor(224, 100, 78);
          doc.text('Staff Product Designer & Systems Architect', 15, 27);
          doc.setFontSize(9);
          doc.setTextColor(107, 114, 128);
          doc.text('alex@rivera.design • +1 (555) 234-5678 • San Francisco, CA • linkedin.com/in/alexrivera', 15, 33);
          doc.setDrawColor(229, 231, 235);
          doc.line(15, 36, 195, 36);
          doc.setFontSize(11);
          doc.setTextColor(17, 24, 39);
          doc.text('PROFESSIONAL SUMMARY', 15, 43);
          doc.setFontSize(9);
          doc.setTextColor(55, 65, 81);
          doc.text('Product design leader with 8+ years designing scalable systems and developer tooling.', 15, 49);
          doc.setFontSize(11);
          doc.setTextColor(17, 24, 39);
          doc.text('EXPERIENCE', 15, 59);
          doc.setFontSize(10);
          doc.text('Senior Systems Designer — Stripe (2021 - Present)', 15, 65);
          doc.setFontSize(9);
          doc.setTextColor(55, 65, 81);
          doc.text('• Architected component token library adopted across 14 product squads.', 18, 71);
          doc.text('• Decreased design-to-production deployment cycles by 38%.', 18, 77);
          doc.save('Alex_Rivera_Resume.pdf');
        } catch (e) {
          console.error(e);
        }
      }
      setTimeout(() => setExportComplete(false), 2500);
    }, 800);
  };

  const handleSimulateAutoFill = () => {
    setAutoFillDone(true);
    setTimeout(() => setAutoFillDone(false), 2500);
  };

  const handleReplay = () => {
    setCopiedLink(false);
    setExportComplete(false);
    setAutoFillDone(false);
    setSelectedFormat('PDF');
  };

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
      <div className="max-w-3xl mx-auto text-center mb-14">
        <div className="text-[11px] font-bold text-[#e0644e] uppercase tracking-[0.2em] mb-3">
          PORTFOLIO & LINKS
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 tracking-[-0.03em] mb-4">
          Let recruiters review your work
        </h2>
        <p className="text-sm sm:text-base text-neutral-600">
          Shareable resume pages, private links, and real-time viewing analytics.
        </p>
      </div>

      {/* 2-Column Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Interactive Live Resume Card (Sage/Mint container) */}
        <div className="lg:col-span-7 bg-[#EDF5F2] border border-[#d2e6df] rounded-2xl p-6 sm:p-7 relative min-h-[460px] flex flex-col justify-between shadow-xs">
          {/* Top Bar with Replay */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#d2e6df]/70">
            <span className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              {activeFeature === 'booking' && 'Live Public Profile & Handle'}
              {activeFeature === 'guests' && 'Recruiter PDF & DOCX Export Studio'}
              {activeFeature === 'onetime' && 'One-Time Company Application Link'}
              {activeFeature === 'everyone' && 'Salary & Role Preferences Filter'}
              {activeFeature === 'double' && 'ATS Strict Parser Validator'}
              {activeFeature === 'accounts' && 'LinkedIn & Greenhouse Auto-Fill'}
            </span>
            <button
              onClick={handleReplay}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-neutral-600 bg-white/90 hover:bg-white border border-neutral-200 rounded-full shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3 h-3 text-neutral-500" />
              <span>Reset</span>
            </button>
          </div>

          {/* DYNAMIC CONTENT FOR ALL 6 BUTTONS */}

          {/* DESIGN 1: LIVE RESUME LINK (BOOKING) */}
          {activeFeature === 'booking' && (
            <div className="space-y-4 my-auto animate-in fade-in duration-300">
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs max-w-sm mx-auto w-full">
                {/* Candidate info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f48b71] text-white font-bold text-xs flex items-center justify-center">
                      A
                    </div>
                    <div>
                      <div className="font-bold text-xs text-neutral-900">Alex Rivera</div>
                      <div className="text-[11px] text-neutral-500">cvume/@alexrivera</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400'}`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400'}`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Shareable Link Box */}
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono text-neutral-600 truncate">
                    https://cvume.com/@alexrivera
                  </span>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 flex items-center gap-1 px-2 py-1 text-[11px] font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-md transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                {/* Live Stats */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs border-t border-neutral-100 pt-3">
                  <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <div className="font-bold text-emerald-950">248 Views</div>
                    <div className="text-[10px] text-emerald-700">Past 7 days</div>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                    <div className="font-bold text-neutral-900">Stripe & Figma</div>
                    <div className="text-[10px] text-neutral-500">Recent hiring view</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DESIGN 2: DOWNLOAD PDF OR WORD (GUESTS) */}
          {activeFeature === 'guests' && (
            <div className="space-y-4 my-auto animate-in fade-in duration-300">
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs max-w-md mx-auto w-full space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div>
                    <div className="font-bold text-xs text-neutral-900">Format Selection</div>
                    <div className="text-[11px] text-neutral-500">Standard 1-Page Exact Export</div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    ATS Compliant
                  </span>
                </div>

                {/* Format Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedFormat('PDF')}
                    className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      selectedFormat === 'PDF'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-neutral-50/60 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <FileText className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs font-bold">Vector PDF</div>
                    <div className={`text-[9px] ${selectedFormat === 'PDF' ? 'text-neutral-300' : 'text-neutral-400'}`}>Recommended</div>
                  </button>

                  <button
                    onClick={() => setSelectedFormat('Word')}
                    className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      selectedFormat === 'Word'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-neutral-50/60 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <FileText className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs font-bold">MS Word</div>
                    <div className={`text-[9px] ${selectedFormat === 'Word' ? 'text-neutral-300' : 'text-neutral-400'}`}>.docx format</div>
                  </button>

                  <button
                    onClick={() => setSelectedFormat('TXT')}
                    className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      selectedFormat === 'TXT'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-neutral-50/60 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <FileText className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs font-bold">Plain Text</div>
                    <div className={`text-[9px] ${selectedFormat === 'TXT' ? 'text-neutral-300' : 'text-neutral-400'}`}>Raw ATS feed</div>
                  </button>
                </div>

                {/* File Details */}
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-neutral-900">Alex_Rivera_Resume.{selectedFormat.toLowerCase()}</div>
                    <div className="text-[10px] text-neutral-400">1 Page · 240 KB · High Resolution Vector</div>
                  </div>
                  <button
                    onClick={handleSimulateExport}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExporting ? 'Generating...' : exportComplete ? 'Downloaded!' : 'Export File'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DESIGN 3: ONE-TIME APPLICATION LINKS (ONETIME) */}
          {activeFeature === 'onetime' && (
            <div className="space-y-4 my-auto animate-in fade-in duration-300">
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs max-w-md mx-auto w-full space-y-3.5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-xs text-neutral-900">Private Requisition Link</span>
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                    Auto-Expires 14 Days
                  </span>
                </div>

                {/* Company Selector */}
                <div className="flex gap-2">
                  {(['stripe', 'linear', 'airbnb'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedCompany(c)}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold capitalize border transition-all cursor-pointer ${
                        selectedCompany === c
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                          : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {c} Application
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/90 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-700 text-[11px]">
                      cvume/apply/{selectedCompany}-9a84f
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Notifies your phone when hiring manager opens</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Tracks read duration per experience bullet</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DESIGN 4: SALARY & ROLE PREFERENCES (EVERYONE) */}
          {activeFeature === 'everyone' && (
            <div className="space-y-4 my-auto animate-in fade-in duration-300">
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs max-w-md mx-auto w-full space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <span className="font-bold text-xs text-neutral-900">Inbound Recruiter Filter</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Screen Mismatches
                  </span>
                </div>

                {/* Salary slider */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-neutral-500">Minimum Base Compensation:</span>
                    <span className="font-bold text-neutral-900 font-mono text-sm">${targetSalary}k/year</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="260"
                    step="10"
                    value={targetSalary}
                    onChange={(e) => setTargetSalary(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1">
                    <span>$150k</span>
                    <span>$200k</span>
                    <span>$260k+</span>
                  </div>
                </div>

                {/* Location preferences */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 font-semibold">
                    ✓ Remote
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-600">
                    Hybrid SF/NYC
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-400">
                    On-site (Filtered)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DESIGN 5: AVOID ATS REJECTIONS (DOUBLE) */}
          {activeFeature === 'double' && (
            <div className="space-y-4 my-auto animate-in fade-in duration-300">
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs max-w-md mx-auto w-full space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="font-bold text-xs text-neutral-900">ATS Parsing Verification</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    100% Parsable
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                    <span className="font-medium text-neutral-800">Greenhouse ATS Parser</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 0 Warnings
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                    <span className="font-medium text-neutral-800">Workday Recruitment Engine</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 100% Section Match
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                    <span className="font-medium text-neutral-800">Lever Intelligence</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 18 Skills Parsed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DESIGN 6: SYNC WITH LINKEDIN & GREENHOUSE (ACCOUNTS) */}
          {activeFeature === 'accounts' && (
            <div className="space-y-4 my-auto animate-in fade-in duration-300">
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs max-w-md mx-auto w-full space-y-3.5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <span className="font-bold text-xs text-neutral-900">1-Click ATS Application Auto-Fill</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Browser Extension Ready
                  </span>
                </div>

                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                    <span>Contact Info & Portfolio Links</span>
                    <span className="font-semibold text-emerald-600">Auto-Mapped ✓</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                    <span>3 Work History Records</span>
                    <span className="font-semibold text-emerald-600">Auto-Mapped ✓</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                    <span>Tailored PDF Attachment</span>
                    <span className="font-semibold text-emerald-600">Attached ✓</span>
                  </div>
                </div>

                <button
                  onClick={handleSimulateAutoFill}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{autoFillDone ? 'Application Fields Filled in 0.3s!' : 'Test 1-Click Form Fill'}</span>
                </button>
              </div>
            </div>
          )}

          <div className="text-[11px] text-neutral-500 text-center pt-2">
            {activeFeature === 'booking' && 'Recruiters browse your interactive profile without software barriers.'}
            {activeFeature === 'guests' && 'Guaranteed single-page margin calibration for print and PDF exports.'}
            {activeFeature === 'onetime' && 'Tailor private links with recruiter viewing analytics.'}
            {activeFeature === 'everyone' && 'Align your salary and location expectations upfront.'}
            {activeFeature === 'double' && 'Eliminates formatting glitches that drop candidates in ATS filters.'}
            {activeFeature === 'accounts' && 'Skip repetitive application forms with one-click data population.'}
          </div>
        </div>

        {/* Right Feature List */}
        <div className="lg:col-span-5 space-y-1">
          {/* Feature 1: Share your live resume link */}
          <button
            onClick={() => setActiveFeature('booking')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'booking'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Share your live resume link
                </h3>
                {activeFeature === 'booking' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Set your public handle once and share cvume/@you. Recruiters view responsive profiles on any device.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Feature 2: Recruiters can download PDF or Word */}
          <button
            onClick={() => setActiveFeature('guests')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'guests'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-3.5 h-3.5 text-neutral-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Recruiters can download PDF or Word
                </h3>
                {activeFeature === 'guests' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Hiring managers export clean, uncorrupted ATS-compliant files directly to their applicant tracking system.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Feature 3: Send one-time application links */}
          <button
            onClick={() => setActiveFeature('onetime')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'onetime'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 font-mono text-xs flex items-center justify-center font-medium text-neutral-700 shrink-0 mt-0.5">
                S
              </span>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Send one-time application links
                </h3>
                {activeFeature === 'onetime' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Generate tailored versions for specific companies with private viewing tracking.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Feature 4: Match salary & role preferences */}
          <button
            onClick={() => setActiveFeature('everyone')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'everyone'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 font-mono text-xs flex items-center justify-center font-medium text-neutral-700 shrink-0 mt-0.5">
                F
              </span>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Match salary & role preferences
                </h3>
                {activeFeature === 'everyone' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Filter out mismatches upfront by specifying desired base pay and remote flexibility.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Feature 5: Avoid ATS parsing rejections */}
          <button
            onClick={() => setActiveFeature('double')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'double'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-neutral-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Avoid ATS parsing rejections
                </h3>
                {activeFeature === 'double' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Validates fonts, tabular layouts, and section headers against Workday, Greenhouse, and Lever.
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Feature 6: Sync with LinkedIn & Greenhouse */}
          <button
            onClick={() => setActiveFeature('accounts')}
            className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer ${
              activeFeature === 'accounts'
                ? 'bg-neutral-50/90 shadow-2xs'
                : 'hover:bg-neutral-50/50 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-3.5 h-3.5 text-neutral-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                  Sync with LinkedIn & Greenhouse
                </h3>
                {activeFeature === 'accounts' && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    One-click auto-fill for job application forms across major ATS platforms.
                  </p>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
