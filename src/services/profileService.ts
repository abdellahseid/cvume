import { UserProfile } from '../types/profile';

const STORAGE_KEY = 'cvume_user_profile_data';

export const DEFAULT_USER_PROFILE: UserProfile = {
  fullName: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA (Open to Remote)',
  targetRole: 'Staff Fullstack Engineer / Systems Architect',
  portfolioUrl: 'https://cvume.com/@alexrivera',
  linkedinUrl: 'https://linkedin.com/in/alex-rivera-tech',
  githubUrl: 'https://github.com/alexrivera-eng',
  telegramHandle: '@alex_tech_lead',
  bio: 'Staff Software Engineer with 8+ years building resilient web architectures, distributed systems, and design systems at scale. Passionate about developer tooling, sub-100ms latency, and high-conversion user interfaces.',
  skills: [
    'TypeScript',
    'React',
    'Node.js',
    'Next.js',
    'Python',
    'Distributed Systems',
    'PostgreSQL',
    'Redis',
    'GraphQL',
    'Tailwind CSS',
    'Docker & Kubernetes',
    'AWS / GCP Cloud',
    'Microfrontends',
    'CI/CD Pipelines',
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'Staff Fullstack Engineer',
      company: 'Acme Cloud Platform',
      location: 'San Francisco, CA',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected real-time developer workspace serving 2.4M weekly active developers, increasing self-serve onboarding conversion by 28%.',
        'Spearheaded migration to federated microfrontends with Next.js and TypeScript, reducing p99 page latency from 1.8s to 240ms.',
        'Mentored 12 senior and mid-level engineers across 3 distributed squads in distributed state management and system scalability.',
      ],
    },
    {
      id: 'exp-2',
      role: 'Senior Software Engineer',
      company: 'Stripe Ecosystem',
      location: 'Remote',
      startDate: '2020',
      endDate: '2023',
      current: false,
      bullets: [
        'Engineered high-throughput checkout and billing flows processing $140M+ annual transaction volume with 99.995% uptime.',
        'Designed modular payment component library adopted across 14 internal product suites, reducing frontend bug tickets by 42%.',
        'Optimized core database query plans and Redis cache invalidation strategies, cutting server compute costs by $180k/year.',
      ],
    },
    {
      id: 'exp-3',
      role: 'Fullstack Engineer',
      company: 'Vercel Labs',
      location: 'Remote',
      startDate: '2018',
      endDate: '2020',
      current: false,
      bullets: [
        'Launched interactive code preview sandboxes that boosted 30-day team activation rates by 35% across enterprise tiers.',
        'Built end-to-end telemetry instrumentation pipelines handling 50M+ daily events with sub-second dashboard rendering.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      year: '2018',
      honors: 'Dean\'s Honors List, Magna Cum Laude',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OmniStream: Real-time Data Sync Engine',
      description: 'Open-source WebSockets & CRDT synchronization engine for collaborative browser canvases with 5k+ GitHub stars.',
      link: 'https://github.com/alexrivera-eng/omnistream',
      technologies: ['TypeScript', 'Rust', 'WebSockets', 'CRDT'],
    },
    {
      id: 'proj-2',
      name: 'Turbopack Design Tokens Compiler',
      description: 'Zero-runtime CSS variable compiler that synchronizes Figma design tokens to multi-brand CSS and TypeScript definitions.',
      link: 'https://github.com/alexrivera-eng/design-tokens-compiler',
      technologies: ['Node.js', 'Figma API', 'AST Parsing'],
    },
  ],
};

export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredProfile(DEFAULT_USER_PROFILE);
      return DEFAULT_USER_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_USER_PROFILE, ...parsed };
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to localStorage:', err);
  }
}

export function resetStoredProfile(): UserProfile {
  saveStoredProfile(DEFAULT_USER_PROFILE);
  return DEFAULT_USER_PROFILE;
}
