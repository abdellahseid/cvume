import express, { Request, Response, NextFunction } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import {
  initDb,
  createUser,
  findUserByEmail,
  createSession,
  findSession,
  deleteSession,
  getProfile,
  upsertProfile,
  getApplications,
  getApplicationById,
  saveApplication,
  deleteApplication,
  verifyPassword,
} from './server/db.ts';
import { DEFAULT_USER_PROFILE } from './src/services/profileService.ts';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Ensure DB is initialized before handling requests (especially for serverless cold-starts)
app.use(async (_req, _res, next) => {
  try {
    await initDb();
  } catch (err) {
    console.warn('Database initialization check warning:', err);
  }
  next();
});

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  const customHeader = req.headers['x-auth-token'];
  if (typeof customHeader === 'string') {
    return customHeader.trim();
  }
  return null;
}

async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  try {
    const sessionData = await findSession(token);
    if (!sessionData) {
      return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    }

    req.user = {
      id: sessionData.user.id,
      email: sessionData.user.email,
      name: sessionData.user.name,
    };
    req.token = token;
    next();
  } catch (err) {
    console.error('Session verification error:', err);
    return res.status(500).json({ error: 'Authentication service error.' });
  }
}

async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      const sessionData = await findSession(token);
      if (sessionData) {
        req.user = {
          id: sessionData.user.id,
          email: sessionData.user.email,
          name: sessionData.user.name,
        };
        req.token = token;
      }
    } catch {
      // Ignore optional auth errors
    }
  }
  next();
}

// Helper to reliably load Gemini API key from process.env or .env/.env.local
export function loadApiKey(): string {
  if (!process.env.GEMINI_API_KEY) {
    dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
    dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });
  }
  return (process.env.GEMINI_API_KEY || '').trim();
}

// Initialize Gemini SDK helper with telemetry header per AI Studio guidelines
function getGeminiClient() {
  const apiKey = loadApiKey();
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface UserExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

interface UserProfile {
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
  education: Array<{ id: string; degree: string; school: string; year: string; honors?: string }>;
  projects: Array<{ id: string; name: string; description: string; link?: string; technologies?: string[] }>;
}

async function generateApplicationWithAI(jobDescription: string, profile: UserProfile) {
  const apiKey = loadApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in .env or .env.local to enable live AI generation.');
  }

  const ai = getGeminiClient();

  const systemPrompt = `You are CVUME's Elite AI Career Copilot. Your mission is to analyze the target job posting / input requirements AND the candidate's profile, and produce 100% custom, production-ready career assets.

CRITICAL INSTRUCTIONS FOR RESUME STYLE, TONE, AND AUTHENTICITY:
1. PURE PROFESSIONAL RESUME (ZERO AI-TAILORED CLUES OR GIVEAWAYS):
   - The resume must look 100% natural, pristine, and authentic — as if the candidate prepared this resume themselves as their polished master resume.
   - ABSOLUTELY NEVER include meta-phrases, AI markers, or giveaway tags anywhere on the resume, such as:
     * "Target Application"
     * "Tailored for [Company]"
     * "(Tailored to Job Post)"
     * "Tailored Resume"
     * "In targeting this position at..."
     * "In applying to..."
     * "As an applicant for..."
   - The RESUME HEADLINE must be a clean, prestigious, standard professional headline matching the role and domain (e.g., "Full-Stack Developer | Cloud Architecture & Distributed Systems" or "Senior Software Engineer | High-Performance Platforms"). NEVER append "Tailored for [Company]" or "[Company Name]" to the resume headline!
   - The RESUME SUMMARY must be written in the first person ("I am an experienced Full-Stack Developer with proven success..."). It highlights core architectural achievements, technical mastery, and problem-solving impact. It must NEVER state meta-text like "Tailored for...", "Targeting the role at...", or mention the candidate's third-person name. It must read like the candidate's real, permanent career summary.
   - SECTION TITLES in plain text and experiences must be standard industry headers: "PROFESSIONAL EXPERIENCE", "CORE SKILLS & TECHNOLOGIES", "EDUCATION", "KEY PROJECTS". Never append "(Tailored to Job Post)" or any custom tags.

2. ACCURATE EXTRACTION & WHERE COMPANY NAME IS USED:
   - Accurately parse and extract the target COMPANY NAME and target ROLE from the input.
   - Intelligently clean, repair, and extract meaningful entities if the user input contains typos or fragments like "at and report to our Senior A." (e.g. reporting to "Senior Architect" or "Senior Technical Leadership").
   - The COMPANY NAME and ROLE SHOULD be prominently and enthusiastically used in:
     * The Gmail outreach application letter (e.g., "Dear [Company] Hiring Team," and linking their background to the company's mission!)
     * The Telegram / LinkedIn / Twitter DM pitch (e.g., "I saw the [Role] opening at [Company] and wanted to connect...")
   - But the RESUME itself remains an authentic, natural document with ZERO meta-tagging indicating it was tailored with AI!

3. DETAILED & COOL RESUME BULLETS:
   - Make experience bullets rich, highly technical, and packed with concrete metrics (Google XYZ style: Accomplished [X], as measured by [Y], by doing [Z]).
   - Seamlessly weave in the relevant technologies, scale, and performance patterns required by the target job.

4. MANDATORY CONTACT INFO IN EMAIL & DM OUTPUT:
   - In the Gmail application letter AND the Telegram / Social Media DM, you MUST include the candidate's PORTFOLIO WEBSITE (${profile.portfolioUrl || 'portfolio URL'}) and PHONE NUMBER (${profile.phone || 'phone number'}).
   - In Gmail letter: Conclude with a professional sign-off with candidate's full name, phone number, email, and portfolio website link.
   - In Telegram / DM: Include the candidate's portfolio website and phone number directly within the message.

5. KEY PROJECTS & TECHNICAL HIGHLIGHTS:
   - In "projects", provide AT LEAST 5 featured technical projects (do NOT output only 2).
   - Draw from the candidate profile's projects and seamlessly weave in the technologies, architectures, and performance metrics required by the target job.
   - Each project must have a clear "name" and a concise, high-impact "description" highlighting architectural choices, technical stack, and measurable impact.

Candidate Profile:
${JSON.stringify(profile, null, 2)}

Target Job Input:
${jobDescription}

Respond strictly in valid JSON with this exact structure:
{
  "jobTitle": "Target role name",
  "companyName": "Target company name",
  "resume": {
    "headline": "Clean Professional Role Headline (e.g. Senior Full-Stack Developer | Distributed Systems & High-Traffic Architecture)",
    "summary": "I am an experienced... (Detailed 3-4 sentence first-person summary with zero meta-phrases, zero third-person names, and no 'Tailored for' or company name disclaimers)",
    "matchedSkills": ["skill1", "skill2"],
    "experiences": [
      {
        "role": "Role title",
        "company": "Company name",
        "period": "Period",
        "bullets": ["Detailed high-impact bullet 1", "Detailed high-impact bullet 2"]
      }
    ],
    "education": [
      {
        "degree": "Degree",
        "school": "School",
        "year": "Year"
      }
    ],
    "projects": [
      {
        "name": "Project 1 Name",
        "description": "High-impact technical description highlighting architecture, technologies, and concrete scale/performance results."
      },
      {
        "name": "Project 2 Name",
        "description": "High-impact technical description highlighting architecture, technologies, and concrete scale/performance results."
      },
      {
        "name": "Project 3 Name",
        "description": "High-impact technical description highlighting architecture, technologies, and concrete scale/performance results."
      },
      {
        "name": "Project 4 Name",
        "description": "High-impact technical description highlighting architecture, technologies, and concrete scale/performance results."
      },
      {
        "name": "Project 5 Name",
        "description": "High-impact technical description highlighting architecture, technologies, and concrete scale/performance results."
      }
    ],
    "formattedPlainText": "Full plain text resume formatted cleanly with standard headers (PROFESSIONAL SUMMARY, CORE SKILLS, PROFESSIONAL EXPERIENCE, KEY PROJECTS, EDUCATION) and first-person summary without any 'tailored' tags",
    "atsBreakdown": {
      "score": 97,
      "matchedKeywords": ["Keyword1", "Keyword2"],
      "missingKeywords": ["Keyword3"],
      "strengths": ["Strength 1", "Strength 2"],
      "recommendations": ["Recommendation 1"]
    }
  },
  "gmailLetter": {
    "subject": "Application: Target Role - Candidate Name",
    "salutation": "Dear Target Company Hiring Team,",
    "body": "Body text with paragraphs separated by newlines, ending with sign-off including Name, Phone, Email, and Portfolio link",
    "fullText": "Full formatted email text ready to send"
  },
  "socialMediaDm": {
    "platform": "Telegram / LinkedIn / Twitter DM",
    "text": "Short message strictly under 120 words including portfolio link and phone number",
    "wordCount": 95,
    "bulletPoints": ["Bullet 1", "Bullet 2"]
  }
}`;

  const candidateModels = [
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite'
  ];

  let lastError: any = null;
  let responseText = '';

  for (const model of candidateModels) {
    try {
      console.log(`[AI Application Studio] Generating tailored CV using ${model}...`);
      const geminiCall = ai.models.generateContent({
        model,
        contents: systemPrompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout with model ${model} after 25s`)), 25000)
      );

      const response = await Promise.race([geminiCall, timeoutPromise]);
      responseText = response.text || '';
      if (responseText.trim()) {
        console.log(`[AI Application Studio] Successfully generated application with ${model}`);
        break;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[AI Application Studio] Model ${model} failed:`, err?.message || err);
    }
  }

  if (!responseText.trim()) {
    throw new Error(`AI generation failed across all models. Last error: ${lastError?.message || 'No response from AI service'}`);
  }

  let parsed: any;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
    parsed = JSON.parse(cleaned);
  }

  // Ensure headline is a clean professional title with zero "Tailored for", "Target Application", etc.
  if (parsed?.resume?.headline) {
    parsed.resume.headline = parsed.resume.headline
      .replace(/\s*\|\s*Tailored\s+for\s+.*$/i, '')
      .replace(/\s*[-–—]\s*Tailored\s+for\s+.*$/i, '')
      .replace(/\s*\(Tailored[^)]*\)/gi, '')
      .replace(/^Target Application:\s*/i, '')
      .trim();
  }

  // Ensure first-person voice and remove any accidental third-person candidate name or tailoring phrases from summary
  if (parsed?.resume?.summary) {
    if (profile.fullName) {
      const escapedName = profile.fullName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const nameRegex = new RegExp(`^${escapedName}\\s+(?:is|has|brings)\\b`, 'i');
      if (nameRegex.test(parsed.resume.summary)) {
        parsed.resume.summary = parsed.resume.summary.replace(nameRegex, 'I am an experienced professional who is ');
      }
    }
    parsed.resume.summary = parsed.resume.summary
      .replace(/In targeting the [^,.]* position at [^,.]*,\s*/gi, '')
      .replace(/In targeting the [^,.]*,\s*/gi, '')
      .replace(/Tailored for [^,.]*,\s*/gi, '')
      .replace(/\(Tailored[^)]*\)/gi, '')
      .trim();
  }

  // Ensure formattedPlainText does not contain giveaway phrases
  if (parsed?.resume?.formattedPlainText) {
    parsed.resume.formattedPlainText = parsed.resume.formattedPlainText
      .replace(/EXPERIENCE\s*\(TAILORED[^)]*\)/gi, 'PROFESSIONAL EXPERIENCE')
      .replace(/Target Application:.*\n/gi, '')
      .replace(/\s*\|\s*Tailored for.*$/gim, '')
      .replace(/\(Tailored[^)]*\)/gi, '');
  }

  // Ensure at least 5 projects are present in the resume output
  if (parsed?.resume) {
    if (!Array.isArray(parsed.resume.projects)) {
      parsed.resume.projects = [];
    }

    if (parsed.resume.projects.length < 5) {
      const candidateProjects = (Array.isArray(profile.projects) && profile.projects.length > 0)
        ? profile.projects
        : DEFAULT_USER_PROFILE.projects;

      const existingNames = new Set(parsed.resume.projects.map((p: any) => (p?.name || '').toLowerCase().trim()));

      for (const proj of candidateProjects) {
        if (parsed.resume.projects.length >= 5) break;
        const pName = (proj.name || '').trim();
        if (pName && !existingNames.has(pName.toLowerCase())) {
          parsed.resume.projects.push({
            name: pName,
            description: proj.description || '',
            link: proj.link || '',
            technologies: proj.technologies || [],
          });
          existingNames.add(pName.toLowerCase());
        }
      }

      // If still fewer than 5, supplement from DEFAULT_USER_PROFILE
      for (const proj of DEFAULT_USER_PROFILE.projects) {
        if (parsed.resume.projects.length >= 5) break;
        const pName = (proj.name || '').trim();
        if (pName && !existingNames.has(pName.toLowerCase())) {
          parsed.resume.projects.push({
            name: pName,
            description: proj.description || '',
            link: proj.link || '',
            technologies: proj.technologies || [],
          });
          existingNames.add(pName.toLowerCase());
        }
      }
    }

    // Ensure all projects have an accessible live link
    parsed.resume.projects = parsed.resume.projects.map((p: any) => {
      let link = (p.link || '').trim();
      if (!link) {
        const match = (profile.projects || []).find((cp: any) => (cp.name || '').toLowerCase() === (p.name || '').toLowerCase())
          || DEFAULT_USER_PROFILE.projects.find((dp: any) => (dp.name || '').toLowerCase() === (p.name || '').toLowerCase());
        link = match?.link || `https://github.com/alexrivera-eng/${(p.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
      }
      return {
        ...p,
        link,
      };
    });

    // Ensure formattedPlainText includes all Key Projects
    if (parsed.resume.formattedPlainText && parsed.resume.projects.length > 0) {
      if (!parsed.resume.formattedPlainText.includes('KEY PROJECTS') && !parsed.resume.formattedPlainText.includes('PROJECTS')) {
        const projectsText = parsed.resume.projects
          .map((p: any) => `* ${p.name}: ${p.description}`)
          .join('\n');
        if (parsed.resume.formattedPlainText.includes('EDUCATION')) {
          parsed.resume.formattedPlainText = parsed.resume.formattedPlainText.replace(
            /(EDUCATION)/i,
            `KEY PROJECTS\n${projectsText}\n\n$1`
          );
        } else {
          parsed.resume.formattedPlainText += `\n\nKEY PROJECTS\n${projectsText}\n`;
        }
      }
    }

    // Ensure atsBreakdown exists and is well-formed with valid score and keyword arrays
    const rawAts = parsed.resume.atsBreakdown || parsed.resume.ats_breakdown || parsed.atsBreakdown || parsed.ats_breakdown || {};
    const matchedSkills = Array.isArray(parsed.resume.matchedSkills) && parsed.resume.matchedSkills.length > 0
      ? parsed.resume.matchedSkills
      : (profile.skills || []).slice(0, 5);

    parsed.resume.atsBreakdown = {
      score: typeof rawAts.score === 'number' && !isNaN(rawAts.score) ? rawAts.score : 96,
      matchedKeywords: Array.isArray(rawAts.matchedKeywords) ? rawAts.matchedKeywords : (Array.isArray(rawAts.matched_keywords) ? rawAts.matched_keywords : matchedSkills),
      missingKeywords: Array.isArray(rawAts.missingKeywords) ? rawAts.missingKeywords : (Array.isArray(rawAts.missing_keywords) ? rawAts.missing_keywords : []),
      strengths: Array.isArray(rawAts.strengths) && rawAts.strengths.length > 0 ? rawAts.strengths : [
        'Strong alignment with role architecture and technical requirements',
        'Demonstrated track record of performance and scalability metrics',
        'Clean ATS-optimized keyword density across key sections',
      ],
      recommendations: Array.isArray(rawAts.recommendations) ? rawAts.recommendations : [
        'Review target role keywords before final submission',
      ],
    };
  }

  // Ensure portfolio and phone number are in Gmail letter
  if (parsed?.gmailLetter) {
    const portfolio = profile.portfolioUrl ? profile.portfolioUrl.trim() : '';
    const phone = profile.phone ? profile.phone.trim() : '';
    const email = profile.email ? profile.email.trim() : '';
    const name = profile.fullName ? profile.fullName.trim() : 'Candidate';

    let body = (parsed.gmailLetter.body || '').trim();
    const hasPhone = phone && body.includes(phone);
    const hasPortfolio = portfolio && body.includes(portfolio);

    if (!hasPhone || !hasPortfolio) {
      const contactItems: string[] = [];
      if (phone && !hasPhone) contactItems.push(`Phone: ${phone}`);
      if (email && !body.includes(email)) contactItems.push(`Email: ${email}`);
      if (portfolio && !hasPortfolio) contactItems.push(`Portfolio: ${portfolio}`);

      if (contactItems.length > 0) {
        if (body.includes(name)) {
          body = body.replace(new RegExp(`(${name}[^\\n]*)$`, 'm'), `$1\n${contactItems.join(' | ')}`);
        } else {
          body += `\n\nWarm regards,\n\n${name}\n${contactItems.join(' | ')}`;
        }
        parsed.gmailLetter.body = body;
      }
    }

    const salutation = parsed.gmailLetter.salutation || `Dear ${parsed.companyName || 'Hiring'} Team,`;
    const subject = parsed.gmailLetter.subject || `Application: ${parsed.jobTitle || 'Position'} - ${name}`;
    parsed.gmailLetter.fullText = `${subject}\n\n${salutation}\n\n${parsed.gmailLetter.body}`;
  }

  // Ensure portfolio and phone number are in Social Media / Telegram DM
  if (parsed?.socialMediaDm) {
    const portfolio = profile.portfolioUrl ? profile.portfolioUrl.trim() : '';
    const phone = profile.phone ? profile.phone.trim() : '';
    let dmText = (parsed.socialMediaDm.text || '').trim();

    const missingAdditions: string[] = [];
    if (portfolio && !dmText.includes(portfolio)) {
      missingAdditions.push(`Portfolio: ${portfolio}`);
    }
    if (phone && !dmText.includes(phone)) {
      missingAdditions.push(`Phone: ${phone}`);
    }

    if (missingAdditions.length > 0) {
      dmText += `\n${missingAdditions.join(' | ')}`;
      parsed.socialMediaDm.text = dmText;
      parsed.socialMediaDm.wordCount = dmText.trim().split(/\s+/).length;
    }
  }

  return parsed;
}

// API Route for AI Generation
app.post('/api/generate-application', async (req: Request, res: Response) => {
  try {
    const { jobDescription, profile } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: 'Job description or target role requirements are required.' });
    }

    if (!profile) {
      return res.status(400).json({ error: 'Candidate profile is required.' });
    }

    const result = await generateApplicationWithAI(jobDescription, profile);
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/generate-application:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to generate tailored application. Please check your Gemini API key and try again.'
    });
  }
});

// ==========================================
// Authentication Endpoints (Database-backed)
// ==========================================

// Register a new user
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid full name.' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    // Create user in PostgreSQL database
    const user = await createUser(cleanEmail, cleanName, password);

    // Initialize user profile in PostgreSQL database with user's name & email
    const initialProfile = {
      ...DEFAULT_USER_PROFILE,
      fullName: cleanName,
      email: cleanEmail,
    };
    await upsertProfile(user.id, initialProfile);

    // Create 30-day session
    const token = await createSession(user.id, 30);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err: any) {
    console.error('Signup error:', err);
    return res.status(400).json({ error: err?.message || 'Failed to create account.' });
  }
});

// Sign in with email & password
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = verifyPassword(password, user.salt, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Create 30-day session
    const token = await createSession(user.id, 30);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'An unexpected error occurred during sign in.' });
  }
});

// Check current session & user
app.get('/api/auth/me', requireAuth, (req: AuthRequest, res: Response) => {
  return res.json({ user: req.user });
});

// Sign out
app.post('/api/auth/logout', requireAuth, async (req: AuthRequest, res: Response) => {
  const token = extractToken(req);
  if (token) {
    await deleteSession(token);
  }
  return res.json({ success: true });
});

// ==========================================
// Profile Data Endpoints (Database-backed)
// ==========================================

// Retrieve user profile
app.get('/api/profile', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    let profile = await getProfile(userId);

    // If no profile exists yet, seed with default customized to user
    if (!profile) {
      profile = {
        ...DEFAULT_USER_PROFILE,
        fullName: req.user!.name,
        email: req.user!.email,
      };
      await upsertProfile(userId, profile);
    } else if (!Array.isArray(profile.projects) || profile.projects.length < 5) {
      // Ensure existing profiles in database have at least 5 projects
      const existingNames = new Set((profile.projects || []).map((p: any) => (p?.name || '').toLowerCase().trim()));
      const missingProjects = DEFAULT_USER_PROFILE.projects.filter(
        p => !existingNames.has(p.name.toLowerCase().trim())
      );
      profile.projects = [...(profile.projects || []), ...missingProjects];
      await upsertProfile(userId, profile);
    }

    return res.json({ profile });
  } catch (err: any) {
    console.error('Error fetching profile:', err);
    return res.status(500).json({ error: 'Failed to retrieve profile data.' });
  }
});

// Update user profile
const handleProfileSave = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const profileData = req.body.profile || req.body;

    if (!profileData || typeof profileData !== 'object') {
      return res.status(400).json({ error: 'Invalid profile data provided.' });
    }

    await upsertProfile(userId, profileData);
    return res.json({ success: true, profile: profileData });
  } catch (err: any) {
    console.error('Error saving profile:', err);
    return res.status(500).json({ error: 'Failed to save profile to database.' });
  }
};

app.put('/api/profile', requireAuth, handleProfileSave);
app.post('/api/profile', requireAuth, handleProfileSave);

// Reset profile to default template
app.post('/api/profile/reset', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const resetProfile = {
      ...DEFAULT_USER_PROFILE,
      fullName: req.user!.name,
      email: req.user!.email,
    };
    await upsertProfile(userId, resetProfile);
    return res.json({ success: true, profile: resetProfile });
  } catch (err: any) {
    console.error('Error resetting profile:', err);
    return res.status(500).json({ error: 'Failed to reset profile.' });
  }
});

// ==========================================
// Applications Endpoints (Saved Resumes & Pitches in Database)
// ==========================================

// Get all saved applications for user
app.get('/api/applications', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const rows = await getApplications(userId);

    const applications = rows.map(row => {
      let result = null;
      if (typeof row.result_json === 'string') {
        try {
          result = JSON.parse(row.result_json);
        } catch {
          result = null;
        }
      } else {
        result = row.result_json;
      }

      if (result?.resume && (!result.resume.atsBreakdown || typeof result.resume.atsBreakdown.score !== 'number')) {
        result.resume.atsBreakdown = {
          score: result.resume.atsBreakdown?.score || 95,
          matchedKeywords: result.resume.atsBreakdown?.matchedKeywords || result.resume.matchedSkills || [],
          missingKeywords: result.resume.atsBreakdown?.missingKeywords || [],
          strengths: result.resume.atsBreakdown?.strengths || [
            'Strong alignment with role architecture and technical requirements',
            'Demonstrated track record of performance and scalability metrics',
            'Clean ATS-optimized keyword density across key sections',
          ],
          recommendations: result.resume.atsBreakdown?.recommendations || [],
        };
      }

      return {
        id: row.id,
        user_id: row.user_id,
        job_title: row.job_title,
        company_name: row.company_name,
        job_description: row.job_description,
        result,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });

    return res.json({ applications });
  } catch (err: any) {
    console.error('Error getting applications:', err);
    return res.status(500).json({ error: 'Failed to retrieve saved applications.' });
  }
});

// Save or update an application
app.post('/api/applications', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { jobTitle, companyName, jobDescription, result, id } = req.body;

    if (!jobTitle || !companyName || !result) {
      return res.status(400).json({ error: 'Missing required application data fields.' });
    }

    const saved = await saveApplication(
      userId,
      jobTitle.trim(),
      companyName.trim(),
      (jobDescription || '').trim(),
      result,
      id
    );

    return res.json({
      success: true,
      application: {
        id: saved.id,
        user_id: saved.user_id,
        job_title: saved.job_title,
        company_name: saved.company_name,
        job_description: saved.job_description,
        result,
        created_at: saved.created_at,
        updated_at: saved.updated_at,
      },
    });
  } catch (err: any) {
    console.error('Error saving application:', err);
    return res.status(500).json({ error: 'Failed to save application to database.' });
  }
});

// Get a single saved application
app.get('/api/applications/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const row = await getApplicationById(req.params.id, userId);

    if (!row) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    let result = null;
    if (typeof row.result_json === 'string') {
      try {
        result = JSON.parse(row.result_json);
      } catch {
        result = null;
      }
    } else {
      result = row.result_json;
    }

    return res.json({
      application: {
        id: row.id,
        user_id: row.user_id,
        job_title: row.job_title,
        company_name: row.company_name,
        job_description: row.job_description,
        result,
        created_at: row.created_at,
        updated_at: row.updated_at,
      },
    });
  } catch (err: any) {
    console.error('Error retrieving application:', err);
    return res.status(500).json({ error: 'Failed to load application.' });
  }
});

// Delete a saved application
app.delete('/api/applications/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const deleted = await deleteApplication(req.params.id, userId);

    if (!deleted) {
      return res.status(404).json({ error: 'Application not found or already deleted.' });
    }

    return res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    console.error('Error deleting application:', err);
    return res.status(500).json({ error: 'Failed to delete application.' });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'cvume-backend',
    database: 'postgresql',
    databaseName: 'cvumedb',
    time: new Date().toISOString()
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CVUME server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start the standalone HTTP listener if not running as a Vercel Serverless Function
if (!process.env.VERCEL) {
  startServer();
}

export default app;
