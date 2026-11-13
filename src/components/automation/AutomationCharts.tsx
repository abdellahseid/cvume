import React from 'react';

interface TimelineDay {
  date: string;
  label: string;
  count: number;
}

interface AutomationChartsProps {
  timelineDays: TimelineDay[];
  platformCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  scoreRanges: {
    excellent: number;
    great: number;
    good: number;
  };
}

export const ApplicationsTimelineChart: React.FC<{ timelineDays: TimelineDay[] }> = ({ timelineDays }) => {
  const maxCount = Math.max(...timelineDays.map(d => d.count), 5);

  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Application Velocity</h3>
          <p className="text-xs text-neutral-500">Auto-applications dispatched over the last 7 days</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/60">
          Live Submissions
        </span>
      </div>

      <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-1">
        {timelineDays.map((day, idx) => {
          const heightPercent = Math.max(8, Math.round((day.count / maxCount) * 100));
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <span className="text-[11px] font-bold text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity">
                {day.count}
              </span>
              <div className="w-full bg-neutral-100 rounded-lg h-full flex items-end overflow-hidden p-0.5">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-neutral-900 to-neutral-700 group-hover:from-blue-600 group-hover:to-blue-400 rounded-md transition-all duration-300"
                />
              </div>
              <span className="text-[10px] font-medium text-neutral-500 tracking-tight text-center">
                {day.label.split(',')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PlatformShareChart: React.FC<{ platformCounts: Record<string, number> }> = ({ platformCounts }) => {
  const platforms = [
    { key: 'telegram', label: 'Telegram', color: 'bg-blue-500', text: 'text-blue-500' },
    { key: 'remotive', label: 'Remotive', color: 'bg-teal-500', text: 'text-teal-500' },
    { key: 'remoteok', label: 'RemoteOK', color: 'bg-indigo-500', text: 'text-indigo-500' },
    { key: 'arbeitnow', label: 'Arbeitnow', color: 'bg-purple-500', text: 'text-purple-500' },
    { key: 'greenhouse', label: 'Greenhouse', color: 'bg-emerald-500', text: 'text-emerald-500' },
    { key: 'lever', label: 'Lever', color: 'bg-amber-500', text: 'text-amber-500' },
  ];

  const total = Object.values(platformCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Platform Distribution</h3>
          <p className="text-xs text-neutral-500">Auto-applications by target job board & channel</p>
        </div>
        <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
          {total} Total
        </span>
      </div>

      {total > 0 ? (
        <>
          {/* Progress Multi-Bar */}
          <div className="h-3.5 w-full bg-neutral-100 rounded-full flex overflow-hidden mb-5">
            {platforms.map(p => {
              const count = platformCounts[p.key] || 0;
              const pct = (count / total) * 100;
              if (pct === 0) return null;
              return (
                <div
                  key={p.key}
                  style={{ width: `${pct}%` }}
                  className={`${p.color} transition-all duration-500`}
                  title={`${p.label}: ${count} (${Math.round(pct)}%)`}
                />
              );
            })}
          </div>

          {/* Legend list */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {platforms.map(p => {
              const count = platformCounts[p.key] || 0;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={p.key} className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                    <span className="font-medium text-neutral-700">{p.label}</span>
                  </div>
                  <span className="font-mono font-semibold text-neutral-900">
                    {count} <span className="text-[10px] text-neutral-400 font-normal">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="py-8 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
          No platform submissions yet. Run auto-pilot to view channel breakdown.
        </div>
      )}
    </div>
  );
};

export const ApplicationFunnelChart: React.FC<{ statusCounts: Record<string, number> }> = ({ statusCounts }) => {
  const stages = [
    { key: 'applied', label: '1. Auto-Applied', color: 'from-blue-600 to-blue-500', barBg: 'bg-blue-500' },
    { key: 'reviewing', label: '2. Under Review', color: 'from-indigo-600 to-indigo-500', barBg: 'bg-indigo-500' },
    { key: 'interviewing', label: '3. Interviewing', color: 'from-amber-500 to-amber-400', barBg: 'bg-amber-500' },
    { key: 'offer', label: '4. Offer Extended', color: 'from-emerald-600 to-emerald-500', barBg: 'bg-emerald-500' },
  ];

  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const baseCount = Math.max(statusCounts['applied'] || 0, total, 1);

  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Conversion Funnel</h3>
          <p className="text-xs text-neutral-500">Pipeline progression from submission to offer</p>
        </div>
      </div>

      {total > 0 ? (
        <div className="space-y-3">
          {stages.map((stage) => {
            const count = statusCounts[stage.key] || 0;
            const pct = Math.max(8, Math.round((count / baseCount) * 100));

            return (
              <div key={stage.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-700">{stage.label}</span>
                  <span className="font-mono font-bold text-neutral-900">
                    {count} <span className="text-neutral-400 font-normal text-[11px]">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full ${stage.barBg} rounded-full transition-all duration-500`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
          No pipeline conversions yet. Active applications will progress here automatically.
        </div>
      )}
    </div>
  );
};

