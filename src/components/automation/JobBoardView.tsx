import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Zap, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight,
  Send,
  Sparkles,
  Layers,
  Globe
} from 'lucide-react';
import { DiscoveredJob } from '../../services/api';

interface JobBoardViewProps {
  jobs: DiscoveredJob[];
  appliedJobTitles: Set<string>;
  onSelectJob: (jobId: string) => void;
  onRefreshScraper: () => Promise<void>;
  onAutoApplyAll: () => Promise<void>;
  isScraping: boolean;
  isApplyingAll: boolean;
}

export const JobBoardView: React.FC<JobBoardViewProps> = ({
  jobs,
  appliedJobTitles,
  onSelectJob,
  onRefreshScraper,
  onAutoApplyAll,
  isScraping,
  isApplyingAll,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);

  const sources = [
    { id: 'all', label: 'All Sources' },
    { id: 'telegram', label: 'Telegram Channels' },
    { id: 'greenhouse', label: 'Greenhouse ATS' },
    { id: 'lever', label: 'Lever ATS' },
    { id: 'remoteok', label: 'RemoteOK' },
    { id: 'arbeitnow', label: 'Arbeitnow' },
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Source filter
      if (selectedSource !== 'all' && job.source !== selectedSource) return false;

      // Remote filter
      if (remoteOnly && !job.remote) return false;

      // Min score filter
      if (minScoreFilter > 0 && (job.matchScore || 0) < minScoreFilter) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesTags = (job.tags || []).some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesTags) return false;
      }

      return true;
    });
  }, [jobs, selectedSource, minScoreFilter, remoteOnly, search]);

  const highMatchCount = useMemo(() => {
    return jobs.filter(j => (j.matchScore || 0) >= 80 && !appliedJobTitles.has(`${j.company.toLowerCase()}_${j.title.toLowerCase()}`)).length;
  }, [jobs, appliedJobTitles]);

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'telegram':
        return { label: 'Telegram Channel', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'greenhouse':
        return { label: 'Greenhouse ATS', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'lever':
        return { label: 'Lever ATS', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'remoteok':
        return { label: 'RemoteOK', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'arbeitnow':
        return { label: 'Arbeitnow', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: source.toUpperCase(), bg: 'bg-neutral-100 text-neutral-700 border-neutral-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Discovered Opportunities</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Aggregated live from Telegram channels, RemoteOK, and modern hiring portals. Evaluated against your CV.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onRefreshScraper()}
            disabled={isScraping}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer border border-neutral-200"
            title="Scan Telegram and Job APIs for new posts"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isScraping ? 'Scraping Feeds...' : 'Fetch Fresh Jobs'}</span>
          </button>

          <button
            onClick={() => onAutoApplyAll()}
            disabled={isApplyingAll || highMatchCount === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              highMatchCount > 0 && !isApplyingAll
                ? 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-95'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {isApplyingAll ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auto-Applying...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>Auto-Apply Matches ({highMatchCount})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, company, or tech stack (React, Node, TypeScript)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          {/* Remote Toggle */}
          <button
            onClick={() => setRemoteOnly(!remoteOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
              remoteOnly
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Remote Only</span>
          </button>

          {/* Min Match Filter */}
          <div className="flex items-center gap-1.5 bg-neutral-50 p-1 rounded-xl border border-neutral-200 shrink-0 text-xs">
            <span className="text-[11px] font-semibold text-neutral-500 px-2">Fit:</span>
            {[
              { label: 'All', score: 0 },
              { label: '≥ 80%', score: 80 },
              { label: '≥ 90%', score: 90 },
            ].map((f) => (
              <button
                key={f.score}
                onClick={() => setMinScoreFilter(f.score)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  minScoreFilter === f.score
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Source Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {sources.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSource(s.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedSource === s.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isApplied = appliedJobTitles.has(`${job.company.toLowerCase()}_${job.title.toLowerCase()}`);
            const badge = getSourceBadge(job.source);
            const matchScore = job.matchScore || 85;

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between group hover:shadow-md"
              >
                <div>
                  {/* Top line: Source pill & Match Score */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isApplied ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            matchScore >= 90
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : matchScore >= 80
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                          }`}
                        >
                          <Sparkles className="w-3 h-3 text-current" />
                          <span>{matchScore}% Match</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Company */}
                  <h3 className="font-bold text-neutral-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-neutral-600 mt-0.5">
                    {job.company}
                  </p>

                  {/* Meta (Location, Salary) */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{job.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{job.salary}</span>
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(job.tags || []).slice(0, 4).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {(job.tags || []).length > 4 && (
                      <span className="text-[10px] text-neutral-400 px-1 py-0.5">
                        +{(job.tags || []).length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {job.contact_info.startsWith('@') ? `Recruiter: ${job.contact_info}` : 'Direct Apply'}
                  </span>

                  <button
                    onClick={() => onSelectJob(job.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-colors cursor-pointer group-hover:bg-blue-600"
                  >
                    <span>View Details & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-neutral-200">
            <Layers className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-neutral-800">No matching jobs found</h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
              Try adjusting your search criteria or click below to trigger a live web and Telegram scraping sweep.
            </p>
            <button
              onClick={() => onRefreshScraper()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Fetch Fresh Jobs Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

