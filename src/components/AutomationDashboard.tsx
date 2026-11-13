import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Zap, 
  Layers, 
  Send, 
  Sliders, 
  FileText, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  Bot,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { 
  api, 
  DiscoveredJob, 
  SavedApplication, 
  AutomationStats, 
  AutomationSettings, 
  ApplicationLog 
} from '../services/api';
import { DashboardHome } from './automation/DashboardHome';
import { JobBoardView } from './automation/JobBoardView';
import { JobDetailPage } from './automation/JobDetailPage';
import { AppliedTrackerView } from './automation/AppliedTrackerView';
import { AutomationSettingsView } from './automation/AutomationSettingsView';
import { JobApplicationStudio } from './JobApplicationStudio';
import { ProfilePage } from './ProfilePage';
import { ApplicationGenerationResult } from '../types/profile';

interface AutomationDashboardProps {
  user: { email: string; name?: string } | null;
  onSignOut: () => void;
  onOpenTemplates?: (result: ApplicationGenerationResult) => void;
  onToast: (msg: string) => void;
}

type TabType = 
  | 'dashboard' 
  | 'job-board' 
  | 'job-detail' 
  | 'applied-tracker' 
  | 'settings' 
  | 'resume-studio' 
  | 'profile';

export const AutomationDashboard: React.FC<AutomationDashboardProps> = ({
  user,
  onSignOut,
  onOpenTemplates,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [jobs, setJobs] = useState<DiscoveredJob[]>([]);
  const [applications, setApplications] = useState<SavedApplication[]>([]);
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [settings, setSettings] = useState<AutomationSettings>({
    min_match_score: 80,
    target_roles: ['Full Stack Engineer', 'Frontend Engineer', 'Software Engineer'],
    enabled_sources: ['telegram', 'remoteok', 'arbeitnow', 'greenhouse', 'lever'],
    auto_apply_enabled: true,
    daily_limit: 15,
    telegram_handle: '',
  });

  const [automationLogs, setAutomationLogs] = useState<ApplicationLog[]>([
    {
      step: 'System Ready',
      timestamp: new Date().toISOString(),
      status: 'info',
      message: 'Autonomous job scanning engine initialized. Monitoring Telegram & remote boards.',
    },
  ]);

  // Loading flags
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRunningAutomation, setIsRunningAutomation] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [isApplyingAll, setIsApplyingAll] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  // Set of applied job identifiers
  const appliedJobTitles = useMemo(() => {
    return new Set(applications.map(a => `${a.company_name.toLowerCase()}_${a.job_title.toLowerCase()}`));
  }, [applications]);

  // Load initial data
  const loadDashboardData = useCallback(async () => {
    try {
      const [jobsData, appsData, statsData, settingsData] = await Promise.allSettled([
        api.getDiscoveredJobs('all'),
        api.getApplications(),
        api.getAutomationStats(),
        api.getAutomationSettings(),
      ]);

      if (jobsData.status === 'fulfilled') setJobs(jobsData.value);
      if (appsData.status === 'fulfilled') setApplications(appsData.value);
      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (settingsData.status === 'fulfilled') setSettings(settingsData.value);
    } catch (e) {
      console.error('Error loading automation dashboard data:', e);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Run Automation (Fetch -> Select -> Apply)
  const handleRunAutomation = async () => {
    setIsRunningAutomation(true);
    setAutomationLogs(prev => [
      {
        step: '1. Ingestion Started',
        timestamp: new Date().toISOString(),
        status: 'info',
        message: 'Querying Telegram recruitment channels, RemoteOK, and modern ATS career portals...',
      },
      ...prev,
    ]);

    try {
      const res = await api.runAutomation();
      onToast(res.message);

      setAutomationLogs(prev => [
        {
          step: '4. Pipeline Finished',
          timestamp: new Date().toISOString(),
          status: 'success',
          message: `Auto-pilot successfully processed ${res.scannedCount} opportunities and applied to ${res.appliedCount} matching roles.`,
        },
        ...prev,
      ]);

      // Refresh data
      await loadDashboardData();
    } catch (err: any) {
      console.error('Automation error:', err);
      onToast('Automation run failed: ' + (err?.message || 'Server error'));
    } finally {
      setIsRunningAutomation(false);
    }
  };

  // Handle Refresh Scraper
  const handleRefreshScraper = async () => {
    setIsScraping(true);
    try {
      const res = await api.scrapeJobs();
      onToast(res.message);
      await loadDashboardData();
    } catch (err: any) {
      onToast('Failed to refresh job feeds: ' + (err?.message || 'Network error'));
    } finally {
      setIsScraping(false);
    }
  };

  // Handle Auto-Apply Single Job (from Detail Page)
  const handleAutoApplySingle = async (jobId: string) => {
    setApplyingJobId(jobId);
    try {
      const res = await api.autoApplyJob(jobId);
      onToast(res.message);
      if (res.logs) {
        setAutomationLogs(prev => [...res.logs, ...prev]);
      }
      await loadDashboardData();
    } catch (err: any) {
      onToast('Auto-apply failed: ' + (err?.message || 'Error'));
    } finally {
      setApplyingJobId(null);
    }
  };

  // Handle Update Status in Tracker
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateApplicationStatus(id, status);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      onToast(`Application status updated to "${status}"`);
      // Update stats in background
      api.getAutomationStats().then(s => setStats(s)).catch(() => {});
    } catch {
      onToast('Failed to update status.');
    }
  };

  // Handle Delete Application
  const handleDeleteApplication = async (id: string) => {
    try {
      await api.deleteApplication(id);
      setApplications(prev => prev.filter(a => a.id !== id));
      onToast('Application removed from tracker.');
      api.getAutomationStats().then(s => setStats(s)).catch(() => {});
    } catch {
      onToast('Failed to delete application.');
    }
  };

  // Selected job for Job Detail Page
  const selectedJob = useMemo(() => {
    if (!selectedJobId) return null;
    return jobs.find(j => j.id === selectedJobId) || null;
  }, [jobs, selectedJobId]);

  return (
    <div className="min-h-screen bg-neutral-100/60 flex flex-col md:flex-row font-sans text-neutral-900 selection:bg-neutral-200">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
            Cv
          </div>
          <span className="font-bold text-base text-neutral-950">CVUME AutoPilot</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-neutral-600 rounded-lg hover:bg-neutral-100 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Modern App Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-neutral-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                Cv
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-neutral-950 block leading-tight">
                  Cvume
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Auto-Pilot 2.0
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-neutral-400 p-1 hover:text-neutral-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Navigation Hub */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 px-3 uppercase tracking-wider block mb-1">
              Automation Hub
            </span>

            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSelectedJobId(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Zap className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-amber-400 fill-current' : 'text-neutral-500'}`} />
                <span>Command Center</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('job-board');
                setSelectedJobId(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'job-board' || activeTab === 'job-detail'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 ${activeTab === 'job-board' || activeTab === 'job-detail' ? 'text-blue-400' : 'text-neutral-500'}`} />
                <span>Discovered Jobs</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                activeTab === 'job-board' ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
              }`}>
                {jobs.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('applied-tracker');
                setSelectedJobId(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'applied-tracker'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Send className={`w-4 h-4 ${activeTab === 'applied-tracker' ? 'text-purple-400' : 'text-neutral-500'}`} />
                <span>Applied Tracker</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                activeTab === 'applied-tracker' ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
              }`}>
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setSelectedJobId(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className={`w-4 h-4 ${activeTab === 'settings' ? 'text-emerald-400' : 'text-neutral-500'}`} />
                <span>Auto-Pilot Rules</span>
              </div>
            </button>
          </div>

          {/* Secondary / Studio Tools (Opened on-demand via buttons) */}
          <div className="space-y-1 pt-3 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-neutral-400 px-3 uppercase tracking-wider block mb-1">
              Studio & Profile
            </span>

            <button
              onClick={() => {
                setActiveTab('resume-studio');
                setSelectedJobId(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'resume-studio'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className={`w-4 h-4 ${activeTab === 'resume-studio' ? 'text-rose-400' : 'text-neutral-500'}`} />
                <span>Resume Studio</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setSelectedJobId(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-blue-400' : 'text-neutral-500'}`} />
                <span>Candidate Profile</span>
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50/50">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
            <div className="min-w-0 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-900 truncate">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-[10px] text-neutral-400 truncate">
                  {user?.email || 'Authenticated'}
                </p>
              </div>
            </div>

            <button
              onClick={onSignOut}
              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <DashboardHome
            stats={stats}
            isRunningAutomation={isRunningAutomation}
            onRunAutomation={handleRunAutomation}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              setSelectedJobId(null);
            }}
            automationLogs={automationLogs}
          />
        )}

        {activeTab === 'job-board' && (
          <JobBoardView
            jobs={jobs}
            appliedJobTitles={appliedJobTitles}
            onSelectJob={(jobId) => {
              setSelectedJobId(jobId);
              setActiveTab('job-detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRefreshScraper={handleRefreshScraper}
            onAutoApplyAll={handleRunAutomation}
            isScraping={isScraping}
            isApplyingAll={isRunningAutomation}
          />
        )}

        {activeTab === 'job-detail' && selectedJob && (
          <JobDetailPage
            job={selectedJob}
            isApplied={appliedJobTitles.has(`${selectedJob.company.toLowerCase()}_${selectedJob.title.toLowerCase()}`)}
            onBack={() => {
              setActiveTab('job-board');
              setSelectedJobId(null);
            }}
            onAutoApply={handleAutoApplySingle}
            isApplying={applyingJobId === selectedJob.id}
            onViewInApplied={() => {
              setActiveTab('applied-tracker');
              setSelectedJobId(null);
            }}
            appliedLogs={automationLogs}
          />
        )}

        {activeTab === 'applied-tracker' && (
          <AppliedTrackerView
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onDeleteApplication={handleDeleteApplication}
            onOpenTemplates={onOpenTemplates ? (app) => onOpenTemplates(app.result) : undefined}
          />
        )}

        {activeTab === 'settings' && (
          <AutomationSettingsView
            settings={settings}
            onSaveSettings={async (newSettings) => {
              const res = await api.saveAutomationSettings(newSettings);
              setSettings(res);
            }}
            onToast={onToast}
          />
        )}

        {/* Embedded Studio Tools when opened via sidebar button */}
        {activeTab === 'resume-studio' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200">
              <span className="text-xs font-bold text-neutral-600">
                📄 Resume Studio & AI Tailoring
              </span>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                ← Return to Automation Command Center
              </button>
            </div>
            <JobApplicationStudio
              onOpenProfile={() => setActiveTab('profile')}
              onOpenTemplates={onOpenTemplates}
              onToast={onToast}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200">
              <span className="text-xs font-bold text-neutral-600">
                👤 Candidate Profile & Skills Engine
              </span>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                ← Return to Automation Command Center
              </button>
            </div>
            <ProfilePage
              onGoToGenerator={() => setActiveTab('dashboard')}
              onToast={onToast}
            />
          </div>
        )}
      </main>
    </div>
  );
};
