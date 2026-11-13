import React, { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  Target, 
  Clock, 
  Send, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Terminal, 
  ChevronRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { AutomationStats, ApplicationLog } from '../../services/api';
import { ApplicationsTimelineChart, PlatformShareChart, ApplicationFunnelChart } from './AutomationCharts';
import { KpiMetricSkeleton, TerminalLogsSkeleton } from './SkeletonLoaders';

interface DashboardHomeProps {
  stats: AutomationStats | null;
  isRunningAutomation: boolean;
  onRunAutomation: () => Promise<void>;
  onNavigateToTab: (tab: 'dashboard' | 'job-board' | 'applied-tracker' | 'settings') => void;
  automationLogs: ApplicationLog[];
  isLoading?: boolean;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  stats,
  isRunningAutomation,
  onRunAutomation,
  onNavigateToTab,
  automationLogs,
  isLoading = false,
}) => {
  const [showConsole, setShowConsole] = useState(true);

  return (
    <div className="space-y-6">
      {/* Hero Automation Command Banner - Real section text headers always visible */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white p-6 sm:p-8 border border-neutral-800 shadow-xl">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold backdrop-blur-xs border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Autonomous Job Application Copilot Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sourcing, Matching & Auto-Applying
            </h1>
            <p className="text-sm text-neutral-300 leading-relaxed">
              CVUME scans Telegram recruitment channels, RemoteOK, and modern ATS job boards, selects roles matching your verified CV skills, and submits tailored application packages automatically.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => onRunAutomation()}
              disabled={isRunningAutomation}
              className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold shadow-lg transition-all cursor-pointer ${
                isRunningAutomation
                  ? 'bg-neutral-800 text-neutral-400 border border-neutral-700 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 hover:shadow-emerald-500/25 active:scale-[0.98]'
              }`}
            >
              {isRunningAutomation ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current text-neutral-950" />
                  <span>Run Auto-Pilot Now</span>
                </>
              )}
            </button>

            <button
              onClick={() => onNavigateToTab('job-board')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 backdrop-blur-xs transition-colors cursor-pointer"
            >
              <span>Browse Job Feed</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Execution Pipeline Stepper (when running or recent) */}
        {isRunningAutomation && (
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3 animate-in fade-in duration-300">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
              <div className="text-xs">
                <p className="font-semibold text-white">1. Ingesting Feeds</p>
                <p className="text-neutral-400 text-[11px]">Telegram & Remote APIs</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <Target className="w-4 h-4 text-emerald-400" />
              <div className="text-xs">
                <p className="font-semibold text-white">2. Semantic CV Matching</p>
                <p className="text-neutral-400 text-[11px]">Filtering Score ≥ 80%</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <p className="font-semibold text-white">3. Tailoring Packages</p>
                <p className="text-neutral-400 text-[11px]">Resumes & Cover Letters</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <Send className="w-4 h-4 text-purple-400" />
              <div className="text-xs">
                <p className="font-semibold text-white">4. Dispatching Applications</p>
                <p className="text-neutral-400 text-[11px]">Telegram & Portals</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KPI Metric Cards - Real headers always visible; skeleton loading effect just under them */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Scanned Roles</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          {isLoading || !stats ? (
            <KpiMetricSkeleton />
          ) : (
            <>
              <p className="text-2xl font-extrabold text-neutral-900 font-mono">
                {stats.totalDiscovered}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">Live active opportunities</p>
            </>
          )}
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">High Matches</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          {isLoading || !stats ? (
            <KpiMetricSkeleton />
          ) : (
            <>
              <p className="text-2xl font-extrabold text-emerald-600 font-mono">
                {stats.highMatches}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">≥ 80% fit with your CV</p>
            </>
          )}
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Auto-Applied</span>
            <Send className="w-4 h-4 text-purple-500" />
          </div>
          {isLoading || !stats ? (
            <KpiMetricSkeleton />
          ) : (
            <>
              <p className="text-2xl font-extrabold text-neutral-900 font-mono">
                {stats.totalApplied}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">Dispatched applications</p>
            </>
          )}
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Interviews</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          {isLoading || !stats ? (
            <KpiMetricSkeleton />
          ) : (
            <>
              <p className="text-2xl font-extrabold text-amber-600 font-mono">
                {stats.interviewCount}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                {stats.interviewRate}% response rate
              </p>
            </>
          )}
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Hours Saved</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          {isLoading || !stats ? (
            <KpiMetricSkeleton />
          ) : (
            <>
              <p className="text-2xl font-extrabold text-neutral-900 font-mono">
                {stats.timeSavedHours}h
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">Manual forms skipped</p>
            </>
          )}
        </div>
      </div>

      {/* Interactive Charts Section - Real section headers preserved, skeleton effect just under them */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ApplicationsTimelineChart 
            timelineDays={stats?.timelineDays || []} 
            isLoading={isLoading || !stats}
          />
        </div>

        <div>
          <PlatformShareChart 
            platformCounts={stats?.platformCounts || {}} 
            isLoading={isLoading || !stats}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <ApplicationFunnelChart 
            statusCounts={stats?.statusCounts || {}} 
            isLoading={isLoading || !stats}
          />
        </div>

        {/* Live Terminal / Execution Log Console - Real header preserved */}
        <div className="bg-neutral-950 text-neutral-100 rounded-2xl p-5 border border-neutral-800 shadow-md font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-neutral-400">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-neutral-200">Auto-Pilot Terminal Logs</span>
              </div>
              <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                Live Feed
              </span>
            </div>

            {/* Skeleton loading effect just under header if logs are loading */}
            {isLoading ? (
              <TerminalLogsSkeleton />
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-[11px] leading-relaxed">
                {automationLogs.length > 0 ? (
                  automationLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2 text-neutral-300">
                      <span className="text-emerald-400 select-none">➜</span>
                      <div>
                        <span className="text-neutral-500 select-none mr-1.5">
                          [{new Date(log.timestamp).toLocaleTimeString()}]
                        </span>
                        <strong className="text-neutral-200 mr-1">{log.step}:</strong>
                        <span>{log.message}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-neutral-500 py-6 text-center">
                    <p>Auto-pilot idle. Press "Run Auto-Pilot Now" to execute the pipeline.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Anti-bot & Rate-limit Safeguards Active</span>
            </span>
            <button
              onClick={() => onNavigateToTab('settings')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Configure Rules →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

