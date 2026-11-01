import React, { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle2, Download, Plus, Link2, Sparkles, X } from 'lucide-react';

interface CommandMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionSelect: (action: string) => void;
}

export const CommandMenuModal: React.FC<CommandMenuModalProps> = ({ 
  isOpen, 
  onClose,
  onActionSelect
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    { id: 'ats_scan', title: 'Run full ATS keyword audit (Score: 98/100)', category: 'Audits', icon: CheckCircle2, shortcut: '⌘A' },
    { id: 'export_pdf', title: 'Export ATS-friendly single-page PDF', category: 'Exports', icon: Download, shortcut: '⌘P' },
    { id: 'new_bullet', title: 'Add new bullet point with AI...', category: 'Actions', icon: Plus, shortcut: 'E' },
    { id: 'copy_link', title: 'Copy live resume link (cvume/@alex)', category: 'Links', icon: Link2, shortcut: 'B' },
    { id: 'tailor_stripe', title: 'Tailor resume for Staff Engineer @ Stripe (96% Match)', category: 'Tailoring', icon: Sparkles, shortcut: '↵' },
    { id: 'tailor_figma', title: 'Tailor resume for Senior UX Lead @ Figma (92% Match)', category: 'Tailoring', icon: Sparkles, shortcut: '↵' },
    { id: 'template_minimal', title: 'Switch template to Minimal ATS', category: 'Templates', icon: FileText, shortcut: '1' },
    { id: 'template_modern', title: 'Switch template to Modern Tech', category: 'Templates', icon: FileText, shortcut: '2' },
    { id: 'exp_acme', title: 'Experience: Acme Cloud Platform (2023 - Present)', category: 'Career', icon: FileText, shortcut: '↵' },
    { id: 'exp_stripe', title: 'Experience: Stripe Ecosystem ($140M ARR)', category: 'Career', icon: FileText, shortcut: '↵' },
  ];

  const filtered = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-2xs flex items-start justify-center pt-12 sm:pt-24 p-3 sm:p-4 animate-in fade-in duration-150"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="p-3.5 px-4 border-b border-neutral-100 flex items-center gap-2.5">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search career history..."
            autoFocus
            className="w-full text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
          />
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[340px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              No matching commands or resume entries found for "{query}"
            </div>
          ) : (
            filtered.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onActionSelect(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-left group cursor-pointer gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComponent className="w-4 h-4 text-neutral-400 group-hover:text-neutral-800 shrink-0" />
                    <span className="text-xs font-medium text-neutral-700 group-hover:text-neutral-950 truncate">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="text-[10px] text-neutral-400 group-hover:text-neutral-500 font-sans hidden xs:inline">
                      {item.category}
                    </span>
                    <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-200/80 rounded font-mono text-[10px] text-neutral-600">
                      {item.shortcut}
                    </kbd>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Bottom Helper Bar */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-100 px-4 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <span className="font-mono bg-white px-1 rounded border border-neutral-200 text-neutral-600">↑↓</span>
            <span>Select:</span>
            <span className="font-mono bg-white px-1 rounded border border-neutral-200 text-neutral-600">↵</span>
          </div>
          <div>
            <span>Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
