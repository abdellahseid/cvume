import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sliders, 
  Send, 
  Bell, 
  Check, 
  Plus, 
  X, 
  Zap, 
  Layers,
  Save,
  Globe
} from 'lucide-react';
import { AutomationSettings } from '../../services/api';
import { AutomationSettingsSkeleton } from './SkeletonLoaders';

interface AutomationSettingsViewProps {
  settings: AutomationSettings | null;
  onSaveSettings: (settings: AutomationSettings) => Promise<void>;
  onToast: (msg: string) => void;
  isLoading?: boolean;
}

export const AutomationSettingsView: React.FC<AutomationSettingsViewProps> = ({
  settings,
  onSaveSettings,
  onToast,
  isLoading = false,
}) => {
  if (isLoading || !settings) {
    return <AutomationSettingsSkeleton />;
  }

  const [minScore, setMinScore] = useState<number>(settings.min_match_score || 80);
  const [dailyLimit, setDailyLimit] = useState<number>(settings.daily_limit || 15);
  const [telegramHandle, setTelegramHandle] = useState<string>(settings.telegram_handle || '');
  const [enabledSources, setEnabledSources] = useState<string[]>(
    settings.enabled_sources || ['telegram', 'remoteok', 'arbeitnow', 'greenhouse', 'lever']
  );
  const [targetRoles, setTargetRoles] = useState<string[]>(
    settings.target_roles || ['Full Stack Engineer', 'Frontend Engineer', 'Software Engineer']
  );
  const [newRoleInput, setNewRoleInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const platforms = [
    { id: 'telegram', name: 'Telegram Recruitment Channels', desc: 'Direct recruiter posts from @remote_frontend_jobs & @remotejobss' },
    { id: 'remotive', name: 'Remotive Software Dev API', desc: 'Real live remote developer listings' },
    { id: 'remoteok', name: 'RemoteOK API', desc: 'Global remote tech opportunities' },
    { id: 'arbeitnow', name: 'Arbeitnow Tech Feed', desc: 'Real European & global software engineering jobs' },
    { id: 'greenhouse', name: 'Greenhouse Career Boards', desc: 'Direct ATS career portal endpoints' },
    { id: 'lever', name: 'Lever Career Boards', desc: 'Fast-track Lever job application endpoints' },
  ];

  const toggleSource = (sourceId: string) => {
    setEnabledSources(prev => 
      prev.includes(sourceId) ? prev.filter(s => s !== sourceId) : [...prev, sourceId]
    );
  };

  const handleAddRole = () => {
    if (newRoleInput.trim() && !targetRoles.includes(newRoleInput.trim())) {
      setTargetRoles([...targetRoles, newRoleInput.trim()]);
      setNewRoleInput('');
    }
  };

  const handleRemoveRole = (role: string) => {
    setTargetRoles(targetRoles.filter(r => r !== role));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveSettings({
        min_match_score: minScore,
        daily_limit: dailyLimit,
        telegram_handle: telegramHandle.trim(),
        enabled_sources: enabledSources,
        target_roles: targetRoles,
        auto_apply_enabled: true,
      });
      onToast('Automation preferences updated successfully!');
    } catch {
      onToast('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Auto-Pilot Configuration</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Customize matching thresholds, enabled platforms, and safeguard limits for autonomous submissions.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer transition-colors shadow-xs shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* 1. Minimum Match Score Threshold */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Minimum Fit Threshold</h3>
            <p className="text-xs text-neutral-500">
              Only roles meeting or exceeding this match score will be selected by Auto-Pilot.
            </p>
          </div>
          <span className="text-lg font-mono font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            {minScore}%
          </span>
        </div>

        <input
          type="range"
          min="65"
          max="95"
          step="5"
          value={minScore}
          onChange={(e) => setMinScore(parseInt(e.target.value, 10))}
          className="w-full accent-neutral-900 cursor-pointer h-2 bg-neutral-100 rounded-lg"
        />

        <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
          <span>65% (Aggressive Sourcing)</span>
          <span>80% (Recommended)</span>
          <span>95% (High Precision Only)</span>
        </div>
      </div>

      {/* 2. Target Job Boards & Channels */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Enabled Sourcing Channels</h3>
          <p className="text-xs text-neutral-500">
            Select the platforms CVUME should monitor and submit applications to.
          </p>
        </div>

        <div className="space-y-2.5">
          {platforms.map(p => {
            const isEnabled = enabledSources.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => toggleSource(p.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isEnabled
                    ? 'bg-neutral-50/80 border-neutral-900/40 text-neutral-900'
                    : 'bg-white border-neutral-200/70 text-neutral-400 hover:border-neutral-300'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">{p.name}</h4>
                  <p className="text-[11px] text-neutral-500">{p.desc}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    isEnabled ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-300'
                  }`}
                >
                  {isEnabled && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Telegram & Outreach Settings */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Telegram Outreach Handle</h3>
          <p className="text-xs text-neutral-500">
            When applying to Telegram job posts, CVUME will include your handle so recruiters can DM you directly.
          </p>
        </div>

        <div className="max-w-md">
          <input
            type="text"
            value={telegramHandle}
            onChange={(e) => setTelegramHandle(e.target.value)}
            placeholder="@your_telegram_username"
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* 4. Target Role Titles */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Target Role Titles</h3>
          <p className="text-xs text-neutral-500">
            Define role patterns to prioritize when scoring opportunities.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {targetRoles.map((role) => (
            <span
              key={role}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200"
            >
              <span>{role}</span>
              <button
                onClick={() => handleRemoveRole(role)}
                className="hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 max-w-md">
          <input
            type="text"
            value={newRoleInput}
            onChange={(e) => setNewRoleInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
            placeholder="Add title (e.g. Cloud Architect)..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
          />
          <button
            onClick={handleAddRole}
            className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold cursor-pointer border border-neutral-200"
          >
            Add
          </button>
        </div>
      </div>

      {/* 5. Daily Safeguard Limit */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Daily Submission Safeguard</h3>
            <p className="text-xs text-neutral-500">
              Maximum auto-applications dispatched per 24 hours to protect recruiter etiquette.
            </p>
          </div>
          <span className="text-sm font-mono font-bold text-neutral-900 bg-neutral-100 px-3 py-1 rounded-lg">
            {dailyLimit} / day
          </span>
        </div>

        <input
          type="range"
          min="5"
          max="30"
          step="5"
          value={dailyLimit}
          onChange={(e) => setDailyLimit(parseInt(e.target.value, 10))}
          className="w-full accent-neutral-900 cursor-pointer h-2 bg-neutral-100 rounded-lg"
        />
      </div>
    </div>
  );
};

