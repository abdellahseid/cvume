export interface UserExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface UserEducation {
  id: string;
  degree: string;
  school: string;
  year: string;
  honors?: string;
}

export interface UserProject {
  id: string;
  name: string;
  description: string;
  link?: string;
  technologies?: string[];
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  targetRole: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  telegramHandle: string;
  bio: string;
  skills: string[];
  experiences: UserExperience[];
  education: UserEducation[];
  projects: UserProject[];
}

export interface AtsBreakdown {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  recommendations: string[];
}

export interface TailoredResumeResult {
  headline: string;
  summary: string;
  matchedSkills: string[];
  experiences: Array<{
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    link?: string;
    technologies?: string[];
  }>;
  formattedPlainText: string;
  atsBreakdown: AtsBreakdown;
}

export interface GmailCoverLetterResult {
  subject: string;
  salutation: string;
  body: string;
  fullText: string;
}

export interface SocialMediaDmResult {
  platform: string;
  text: string;
  wordCount: number;
  bulletPoints: string[];
}

export interface ApplicationGenerationResult {
  jobTitle: string;
  companyName: string;
  resume: TailoredResumeResult;
  gmailLetter: GmailCoverLetterResult;
  socialMediaDm: SocialMediaDmResult;
}
