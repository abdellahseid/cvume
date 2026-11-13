import { UserProfile, ApplicationGenerationResult } from '../types/profile';

const TOKEN_KEY = 'cvume_auth_token';
const USER_KEY = 'cvume_logged_in_user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface ApplicationLog {
  step: string;
  timestamp: string;
  status: 'pending' | 'success' | 'info' | 'error';
  message: string;
}

export interface SavedApplication {
  id: string;
  user_id: string;
  job_title: string;
  company_name: string;
  job_description: string;
  result: ApplicationGenerationResult;
  status?: string;
  platform?: string;
  match_score?: number;
  application_url?: string;
  logs?: ApplicationLog[];
  created_at: string;
  updated_at: string;
}

export interface DiscoveredJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  source: 'telegram' | 'remoteok' | 'arbeitnow' | 'greenhouse' | 'lever';
  source_url: string;
  description: string;
  tags: string[];
  contact_info: string;
  remote: boolean;
  created_at: string;
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  matchRationale?: string;
}

export interface AutomationSettings {
  min_match_score: number;
  target_roles: string[];
  enabled_sources: string[];
  auto_apply_enabled: boolean;
  daily_limit: number;
  telegram_handle: string;
}

export interface AutomationStats {
  totalDiscovered: number;
  totalApplied: number;
  highMatches: number;
  interviewCount: number;
  offerCount: number;
  interviewRate: number;
  timeSavedHours: number;
  statusCounts: Record<string, number>;
  platformCounts: Record<string, number>;
  timelineDays: Array<{ date: string; label: string; count: number }>;
  scoreRanges: {
    excellent: number;
    great: number;
    good: number;
  };
}

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (err) {
    console.error('Failed to update auth token in localStorage:', err);
  }
}

export function getCachedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCachedUser(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (err) {
    console.error('Failed to update cached user in localStorage:', err);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  let data: any = null;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage = data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

export const api = {
  // Auth endpoints
  async signup(email: string, password: string, fullName: string): Promise<{ token: string; user: AuthUser }> {
    const data = await request<{ token: string; user: AuthUser }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    setAuthToken(data.token);
    setCachedUser(data.user);
    return data;
  },

  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const data = await request<{ token: string; user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.token);
    setCachedUser(data.user);
    return data;
  },

  async me(): Promise<{ user: AuthUser } | null> {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const data = await request<{ user: AuthUser }>('/api/auth/me', {
        method: 'GET',
      });
      setCachedUser(data.user);
      return data;
    } catch {
      setAuthToken(null);
      setCachedUser(null);
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      setAuthToken(null);
      setCachedUser(null);
    }
  },

  // Profile endpoints
  async getProfile(): Promise<UserProfile> {
    const data = await request<{ profile: UserProfile }>('/api/profile', {
      method: 'GET',
    });
    return data.profile;
  },

  async saveProfile(profile: UserProfile): Promise<UserProfile> {
    const data = await request<{ profile: UserProfile }>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify({ profile }),
    });
    return data.profile;
  },

  async resetProfile(): Promise<UserProfile> {
    const data = await request<{ profile: UserProfile }>('/api/profile/reset', {
      method: 'POST',
    });
    return data.profile;
  },

  // Applications endpoints (Saved tailored resumes, letters, pitches)
  async getApplications(): Promise<SavedApplication[]> {
    const data = await request<{ applications: SavedApplication[] }>('/api/applications', {
      method: 'GET',
    });
    return data.applications;
  },

  async saveApplication(params: {
    jobTitle: string;
    companyName: string;
    jobDescription: string;
    result: ApplicationGenerationResult;
    id?: string;
  }): Promise<SavedApplication> {
    const data = await request<{ application: SavedApplication }>('/api/applications', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return data.application;
  },

  async deleteApplication(id: string): Promise<void> {
    await request(`/api/applications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async updateApplicationStatus(id: string, status: string): Promise<SavedApplication> {
    const data = await request<{ application: SavedApplication }>(`/api/applications/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return data.application;
  },

  // Job Scraping & Automation Endpoints
  async getDiscoveredJobs(source: string = 'all', search?: string): Promise<DiscoveredJob[]> {
    const params = new URLSearchParams();
    if (source && source !== 'all') params.set('source', source);
    if (search) params.set('search', search);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const data = await request<{ jobs: DiscoveredJob[] }>(`/api/jobs${qs}`, {
      method: 'GET',
    });
    return data.jobs;
  },

  async getDiscoveredJobById(id: string): Promise<DiscoveredJob> {
    const data = await request<{ job: DiscoveredJob }>(`/api/jobs/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
    return data.job;
  },

  async scrapeJobs(): Promise<{ success: boolean; scrapedCount: number; totalCount: number; message: string; jobs: DiscoveredJob[] }> {
    return await request('/api/jobs/scrape', {
      method: 'POST',
    });
  },

  async autoApplyJob(jobId: string): Promise<{ success: boolean; application: SavedApplication; logs: ApplicationLog[]; message: string }> {
    return await request(`/api/jobs/${encodeURIComponent(jobId)}/auto-apply`, {
      method: 'POST',
    });
  },

  async runAutomation(): Promise<{
    success: boolean;
    scannedCount: number;
    matchedCount: number;
    appliedCount: number;
    results: any[];
    message: string;
  }> {
    return await request('/api/automation/run', {
      method: 'POST',
    });
  },

  async getAutomationStats(): Promise<AutomationStats> {
    return await request<AutomationStats>('/api/automation/stats', {
      method: 'GET',
    });
  },

  async getAutomationSettings(): Promise<AutomationSettings> {
    const data = await request<{ settings: AutomationSettings }>('/api/automation/settings', {
      method: 'GET',
    });
    return data.settings;
  },

  async saveAutomationSettings(settings: Partial<AutomationSettings>): Promise<AutomationSettings> {
    const data = await request<{ settings: AutomationSettings }>('/api/automation/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    });
    return data.settings;
  },
};
