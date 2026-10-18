export interface ResumeBullet {
  id: string;
  text: string;
  metric?: string;
  actionVerb?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: ResumeBullet[];
  tags: string[];
  colorTheme: 'blue' | 'purple' | 'amber' | 'emerald' | 'coral' | 'rose' | 'sky';
  atsMatchScore?: number;
}

export interface SectionItem {
  id: string;
  title: string;
  category: 'core' | 'optional';
  count: number;
  isRedBullet?: boolean;
}

export interface JobTarget {
  id: string;
  title: string;
  company: string;
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

export const INITIAL_SECTIONS: SectionItem[] = [
  { id: '1', title: 'Work Experience (Staff Designer)', count: 3, isRedBullet: true, category: 'core' },
  { id: '2', title: 'Product & Design Systems Skills', count: 12, category: 'core' },
  { id: '3', title: 'Key High-Impact Projects', count: 4, category: 'core' },
  { id: '4', title: 'Education & Certifications', count: 2, category: 'core' },
  { id: '5', title: 'Patents & Publications', count: 1, category: 'optional' },
  { id: '6', title: 'Speaking & Mentorship', count: 3, category: 'optional' },
];

export const INITIAL_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'exp1',
    role: 'Staff Product Designer',
    company: 'Acme Cloud Platform',
    period: '2023 – Present',
    tags: ['Design Systems', 'Next.js', 'User Research', 'Figma Tokens'],
    colorTheme: 'purple',
    atsMatchScore: 98,
    bullets: [
      {
        id: 'b1',
        actionVerb: 'Architected',
        metric: '2.4M weekly active developers',
        text: 'Architected core web workspace used by 2.4M developers, increasing self-serve onboarding conversion by 28%.',
      },
      {
        id: 'b2',
        actionVerb: 'Spearheaded',
        metric: '40% reduction',
        text: 'Spearheaded tokenized multi-brand design system, cutting engineering handoff cycle time from 3 weeks to 4 days.',
      },
    ],
  },
  {
    id: 'exp2',
    role: 'Lead Interface Engineer',
    company: 'Stripe Ecosystem',
    period: '2020 – 2023',
    tags: ['TypeScript', 'Design Systems', 'Microfrontends', 'A/B Testing'],
    colorTheme: 'blue',
    atsMatchScore: 94,
    bullets: [
      {
        id: 'b3',
        actionVerb: 'Engineered',
        metric: '$140M processed ARR',
        text: 'Engineered checkout flows supporting $140M processed ARR with strict sub-150ms interaction latency budgets.',
      },
      {
        id: 'b4',
        actionVerb: 'Mentored',
        metric: '8 junior/mid designers',
        text: 'Mentored 8 product designers and frontend developers in accessible WCAG AA component authoring.',
      },
    ],
  },
  {
    id: 'exp3',
    role: 'Senior Product Specialist',
    company: 'Vercel Labs',
    period: '2018 – 2020',
    tags: ['React', 'CSS Architecture', 'Developer Experience'],
    colorTheme: 'emerald',
    atsMatchScore: 91,
    bullets: [
      {
        id: 'b5',
        actionVerb: 'Launched',
        metric: '+35% day-30 retention',
        text: 'Launched interactive preview sandboxes that drove +35% day-30 team retention for Enterprise accounts.',
      },
    ],
  },
];

export const COLOR_STYLES = {
  blue: {
    bg: 'bg-[#e8f0fe] hover:bg-[#dfeafc]',
    border: 'border-[#c7dbf9]',
    text: 'text-[#1967d2]',
    timeText: 'text-[#1967d2]/80',
  },
  purple: {
    bg: 'bg-[#f3e8fd] hover:bg-[#ede0fa]',
    border: 'border-[#e0c7f7]',
    text: 'text-[#7b1fa2]',
    timeText: 'text-[#7b1fa2]/80',
  },
  amber: {
    bg: 'bg-[#fef3d6] hover:bg-[#faeec8]',
    border: 'border-[#fcd994]',
    text: 'text-[#b06000]',
    timeText: 'text-[#b06000]/80',
  },
  emerald: {
    bg: 'bg-[#e6f4ea] hover:bg-[#dcf0e2]',
    border: 'border-[#b7e1cd]',
    text: 'text-[#137333]',
    timeText: 'text-[#137333]/80',
  },
  coral: {
    bg: 'bg-[#fce8e6] hover:bg-[#fadcd9]',
    border: 'border-[#f8bcb6]',
    text: 'text-[#c5221f]',
    timeText: 'text-[#c5221f]/80',
  },
  rose: {
    bg: 'bg-[#fce4ec] hover:bg-[#fad4e0]',
    border: 'border-[#f8bbd0]',
    text: 'text-[#c2185b]',
    timeText: 'text-[#c2185b]/80',
  },
  sky: {
    bg: 'bg-[#e1f5fe] hover:bg-[#d4f0fd]',
    border: 'border-[#b3e5fc]',
    text: 'text-[#0277bd]',
    timeText: 'text-[#0277bd]/80',
  },
};
