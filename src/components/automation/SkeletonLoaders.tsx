import React from 'react';

/**
 * Base Shimmer Skeleton Element
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-neutral-200/80 rounded-md ${className}`}
      aria-hidden="true"
    />
  );
};

/**
 * Skeleton for KPI values (rendered just under the metric card headers and icons)
 */
export const KpiMetricSkeleton: React.FC = () => {
  return (
    <div className="space-y-1.5 animate-in fade-in duration-200">
      <Skeleton className="h-7 w-16 rounded-lg my-1" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
};

/**
 * Skeleton for Velocity Bars (rendered just under the "Application Velocity" header)
 */
export const VelocityBarsSkeleton: React.FC = () => {
  return (
    <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 animate-in fade-in duration-200">
      {[35, 65, 50, 80, 40, 90, 55].map((h, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div
            style={{ height: `${h}%` }}
            className="w-full bg-neutral-200/70 rounded-md animate-pulse"
          />
          <Skeleton className="h-2.5 w-8" />
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for Platform Share content (rendered just under the "Platform Distribution" header)
 */
export const PlatformShareBodySkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <Skeleton className="h-3.5 w-full rounded-full" />
      <div className="grid grid-cols-2 gap-2 pt-1">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-100">
            <div className="flex items-center gap-2">
              <Skeleton className="w-2.5 h-2.5 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton for Conversion Funnel bars (rendered just under the "Conversion Funnel" header)
 */
export const ConversionFunnelBodySkeleton: React.FC = () => {
  return (
    <div className="space-y-3.5 pt-1 animate-in fade-in duration-200">
      {[90, 70, 45, 25].map((pct, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${pct}%` }}
              className="h-full bg-neutral-200/80 rounded-full animate-pulse"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for Terminal Logs (rendered just under the terminal console header)
 */
export const TerminalLogsSkeleton: React.FC = () => {
  return (
    <div className="space-y-2 py-2 max-h-56 animate-in fade-in duration-200">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 bg-neutral-800 rounded" />
          <Skeleton className="h-3 w-24 bg-neutral-800" />
          <Skeleton className={`h-3 bg-neutral-800 ${i % 2 === 0 ? 'w-56' : 'w-72'}`} />
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for Job Cards Grid (rendered just under the real Job Board search & filter header)
 */
export const JobCardsGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            {/* Badge row */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>

            {/* Title & Company */}
            <div className="space-y-1.5 pt-1">
              <Skeleton className={`h-5 ${i % 2 === 0 ? 'w-3/4' : 'w-5/6'} rounded-lg`} />
              <Skeleton className="h-3.5 w-1/3" />
            </div>

            {/* Meta info (Location, Salary) */}
            <div className="flex items-center gap-4 pt-3 border-t border-neutral-100">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-28" />
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5 pt-1">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-14 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-5 w-12 rounded-md" />
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="pt-3.5 border-t border-neutral-100 flex items-center justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-36 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for Applications List (rendered just under the real Applied Tracker search & status filters)
 */
export const ApplicationsListSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-2 max-w-xl w-full">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <Skeleton className={`h-5 ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'} rounded-lg`} />
            <Skeleton className="h-3.5 w-32" />
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Skeleton className="h-8 w-32 rounded-xl" />
            <Skeleton className="h-8 w-28 rounded-xl" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for Job Detail Body (rendered just under the real back button and section headers)
 */
export const JobDetailBodySkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Card Body Skeleton */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl w-full">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-3/4 max-w-md rounded-lg" />
            <Skeleton className="h-4 w-40" />

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Skeleton className="h-6 w-24 rounded-lg" />
              <Skeleton className="h-6 w-28 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-lg" />
            </div>
          </div>

          {/* Radial Fit Gauge Skeleton */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 w-36 h-36 shrink-0">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-3 w-16 mt-2" />
          </div>
        </div>
      </div>

      {/* Two Column Layout (Preview + Recruiter Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Document Preview Skeleton */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Skeleton className="h-8 w-28 rounded-xl" />
            <Skeleton className="h-8 w-28 rounded-xl" />
            <Skeleton className="h-8 w-28 rounded-xl" />
          </div>

          <div className="space-y-3.5 pt-2">
            <Skeleton className="h-5 w-2/3 rounded" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-11/12" />
            <Skeleton className="h-3.5 w-4/5" />

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2 mt-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>

            <div className="space-y-2 pt-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-9/12" />
              <Skeleton className="h-3.5 w-10/12" />
            </div>
          </div>
        </div>

        {/* Recruiter Sidebar Skeleton */}
        <div className="space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-4">
            <Skeleton className="h-4 w-36" />
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
