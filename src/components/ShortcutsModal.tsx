import React from 'react';
import { X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'E', desc: 'Add new bullet point with natural language' },
    { key: 'Q', desc: 'Toggle job requirements matching dock' },
    { key: '⌘K', desc: 'Open command menu' },
    { key: '/', desc: 'Search past metrics and skills' },
    { key: '1, 2, 3', desc: 'Switch template (Modern, Minimal, Executive)' },
    { key: 'Z', desc: 'Compare with target job description' },
    { key: 'B', desc: 'Copy shareable link (cvume/@you)' },
    { key: '⌘P', desc: 'Export ATS-friendly single-page PDF' },
    { key: '⌘Z', desc: 'Undo last bullet edit or rewrite' },
    { key: '?', desc: 'Show this keyboard shortcuts guide' },
    { key: 'Esc', desc: 'Close dialog or modal' },
  ];

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <div className="p-4 px-4 sm:px-6 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900 text-sm">Keyboard Shortcuts</h3>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto divide-y divide-neutral-100">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs gap-3">
              <span className="text-neutral-600 min-w-0 pr-1">{s.desc}</span>
              <kbd className="px-2 py-1 bg-neutral-100 border border-neutral-200/80 rounded font-mono font-medium text-neutral-800 shrink-0 text-right">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 bg-neutral-50 border-t border-neutral-100 text-center text-[11px] text-neutral-500">
          Press <kbd className="px-1.5 py-0.5 bg-white border border-neutral-200 rounded font-mono">Esc</kbd> anytime to dismiss
        </div>
      </div>
    </div>
  );
};
