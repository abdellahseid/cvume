import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  Search, 
  Building, 
  ChevronDown,
  Terminal,
  X,
  Copy,
  Check,
  Briefcase
} from 'lucide-react';
import { SavedApplication } from '../../services/api';
import { AppliedTrackerSkeleton } from './SkeletonLoaders';

interface AppliedTrackerViewProps {
  applications: SavedApplication[];
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onDeleteApplication: (id: string) => Promise<void>;
  onOpenTemplates?: (app: SavedApplication) => void;
  isLoading?: boolean;
}

export const AppliedTrackerView: React.FC<AppliedTrackerViewProps> = ({
  applications,
  onUpdateStatus,
  onDeleteApplication,
  onOpenTemplates,
  isLoading = false,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppForModal, setSelectedAppForModal] = useState<SavedApplication | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Display skeleton rows when loading applications pipeline
  if (isLoading) {
    return <AppliedTrackerSkeleton />;
  }

  const statuses = [
    { id: 'all', label: 'All Applications' },
    { id: 'applied', label: 'Applied' },
    { id: 'reviewing', label: 'Reviewing' },
    { id: 'interviewing', label: 'Interviewing' },
    { id: 'offer', label: 'Offer' },
    { id: 'rejected', label: 'Rejected' },
  ];

  const filtered = useMemo(() => {
    return applications.filter(app => {
      if (statusFilter !== 'all' && (app.status || 'applied') !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          app.job_title.toLowerCase().includes(q) ||
          app.company_name.toLowerCase().includes(q) ||
          (app.platform || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [applications, statusFilter, search]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'interviewing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'offer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'reviewing':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Application Pipeline</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Track and manage all positions submitted via CVUME Auto-Pilot across Telegram, Greenhouse, Lever, and job boards.
          </p>
        </div>
        <div className="text-xs font-mono bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 shrink-0">
          Total Applied: <strong>{applications.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by company, role title, or platform..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {statuses.map(s => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === s.id
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((app) => {
            const currentStatus = app.status || 'applied';
            const matchScore = app.match_score || 90;
            const appliedDate = app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recent';

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {app.platform || 'Auto-Pilot'}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      Applied on {appliedDate}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {matchScore}% Fit
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 leading-snug">
                    {app.job_title}
                  </h3>
                  <p className="text-xs font-semibold text-neutral-600 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{app.company_name}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Status Dropdown */}
                  <div className="relative">
                    <select
                      value={currentStatus}
                      onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-hidden appearance-none pr-7 ${getStatusBadge(currentStatus)}`}
                    >
                      <option value="applied">Status: Applied</option>
                      <option value="reviewing">Status: Under Review</option>
                      <option value="interviewing">Status: Interviewing</option>
                      <option value="offer">Status: Offer Extended</option>
                      <option value="rejected">Status: Rejected</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                  </div>

                  {/* View Details / Submission Modal */}
                  <button
                    onClick={() => setSelectedAppForModal(app)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer border border-neutral-200"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Inspect Package</span>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteApplication(app.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-rose-50"
                    title="Remove from tracker"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 p-6">
            <Briefcase className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-neutral-800">No applications in this view</h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
              Run the Auto-Pilot or select jobs from the Discovered Job Board to submit your first batch!
            </p>
          </div>
        )}
      </div>

      {/* INSPECT SUBMITTED PACKAGE MODAL */}
      {selectedAppForModal && (
        <div className="fixed inset-0 bg-neutral-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-neutral-900">
                  {selectedAppForModal.job_title}
                </h3>
                <p className="text-xs text-neutral-500">
                  {selectedAppForModal.company_name} • Dispatched via {selectedAppForModal.platform?.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppForModal(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Tailored Headline & Summary */}
              {selectedAppForModal.result?.resume && (
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">Tailored Resume Headline & Summary</span>
                    <button
                      onClick={() => handleCopy(`${selectedAppForModal.result?.resume.headline}\n\n${selectedAppForModal.result?.resume.summary}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="font-bold text-neutral-800 text-xs">
                    {selectedAppForModal.result.resume.headline}
                  </p>
                  <p className="text-neutral-600 leading-relaxed">
                    {selectedAppForModal.result.resume.summary}
                  </p>
                </div>
              )}

              {/* Cover Letter */}
              {selectedAppForModal.result?.gmailLetter && (
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">Cover Letter Dispatched</span>
                    <button
                      onClick={() => handleCopy(selectedAppForModal.result?.gmailLetter?.fullText || selectedAppForModal.result?.gmailLetter?.body || '')}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="text-neutral-700 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto font-sans">
                    {selectedAppForModal.result.gmailLetter.fullText || selectedAppForModal.result.gmailLetter.body}
                  </div>
                </div>
              )}

              {/* Execution Logs */}
              {selectedAppForModal.logs && selectedAppForModal.logs.length > 0 && (
                <div className="p-4 rounded-2xl bg-neutral-950 text-neutral-200 font-mono space-y-2">
                  <span className="font-bold text-neutral-300 block text-[11px] pb-1 border-b border-neutral-800">
                    Auto-Pilot Submission Audit Trail
                  </span>
                  <div className="space-y-1.5 text-[11px]">
                    {selectedAppForModal.logs.map((lg, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <div>
                          <strong className="text-white mr-1">{lg.step}:</strong>
                          <span className="text-neutral-300">{lg.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedAppForModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

