import React, { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userEmail?: string;
  userName?: string;
  isLoading?: boolean;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userEmail,
  userName,
  isLoading = false,
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={() => {
        if (!isLoading) onClose();
      }}
      className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[390px] bg-white rounded-2xl shadow-2xl border border-neutral-200/90 overflow-hidden animate-in zoom-in-95 duration-200 p-5 sm:p-7 text-center"
      >
        {/* Top-Right Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          title="Close dialog"
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Centered Elevated Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-red-100/70 flex items-center justify-center">
            <LogOut className="w-5 h-5 ml-0.5 text-red-600" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-neutral-950 tracking-tight">
            Sign out of Cvume?
          </h3>
          <p className="mt-2 text-xs sm:text-[13px] text-neutral-500 leading-relaxed max-w-[310px] mx-auto">
            Are you sure you want to end your session? Your profile data, resume drafts, and tailored applications are safely synced to your account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-2.5 px-3 text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/80 active:scale-98 rounded-xl transition-all border border-neutral-200/80 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-98 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
