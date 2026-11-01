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
  projects: Array<{ id: string; name: string; description: string; link?: string }>;
}

async function generateApplicationWithAI(jobDescription: string, profile: UserProfile) {
  const apiKey = loadApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in .env or .env.local to enable live AI generation.');
  }

  const ai = getGeminiClient();

  const systemPrompt = `You are CVUME's Elite AI Career Copilot. Your mission is to analyze the target job posting / input requirements AND the candidate's profile, and produce 100% custom, hyper-tailored, production-ready career assets.

CRITICAL INSTRUCTIONS FOR RESUME SUMMARY & VOICE:
1. SUMMARY STYLE & VOICE:
   - The professional summary MUST be written in the first person, beginning with "I am an experienced..." or similar authentic first-person voice ("I am an experienced Fullstack Engineer / Systems Architect with...").
   - NEVER start with or mention the candidate's name in the third person anywhere in the summary (ABSOLUTELY NO "[Candidate Name] is an experienced..." or "[Candidate Name] is a...").
   - The user is presenting this resume directly, so make it sound detailed, cool, confident, authentic, and modern as if the user personally crafted it with deep technical pride.
   - Mention the target role, the target company name, core technical stack, and how the candidate's track record directly solves the company's challenges.
2. ACCURATE EXTRACTION & SCRAPING OF INPUT DATA (COMPANY NAME, ROLE, REPORTING LINE):
   - Thoroughly parse and extract the target COMPANY NAME and target ROLE from the input.
   - If the input contains partial phrases, typos, or incomplete fragments like "at and report to our Senior A.", intelligently clean, repair, and extract the meaningful entities (e.g. reporting to "Senior Architect" or "Senior Technical Leadership").
   - If no company name is explicitly specified in the text, infer a suitable professional hiring organization context (e.g., "High-Scale Engineering Organization" or "Hiring Team"). NEVER output broken grammar clippings like "at and report to our Senior A." or "Senior A".
   - Make sure the detected COMPANY NAME and ROLE are explicitly mentioned in:
     * The resume headline (e.g. "[Role] | Tailored for [Company]")
     * The resume summary
     * The tailored experience bullets
     * The plain text resume
     * The Gmail outreach letter
     * The Telegram/DM pitch
3. DETAILED & COOL RESUME CONTENT:
   - Make the resume rich, highly technical, and packed with concrete impact metrics (Google XYZ style: Accomplished [X], as measured by [Y], by doing [Z]).
   - Tailor the candidate's experiences, bullet points, skills, and summary directly to the target company's mission and tech requirements.
   - All content must be completely bespoke to this exact job and company.

Candidate Profile:
${JSON.stringify(profile, null, 2)}

Target Job Input:
${jobDescription}

Respond strictly in valid JSON with this exact structure:
{
  "jobTitle": "Target role name",
  "companyName": "Target company name",
  "resume": {
    "headline": "Target Role | Tailored for Target Company",
    "summary": "I am an experienced... (Detailed 3-4 sentence first-person summary mentioning target role and company without third-person name)",
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
        "name": "Project name",
        "description": "Project description"
      }
    ],
    "formattedPlainText": "Full plain text resume formatted cleanly with headers and first-person summary",
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
    "body": "Body text with paragraphs separated by newlines",
    "fullText": "Full formatted email text ready to send"
  },
  "socialMediaDm": {
    "platform": "Telegram / LinkedIn / Twitter DM",
    "text": "Short message strictly under 120 words",
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

  // Ensure first-person voice and remove any accidental third-person candidate name from summary
  if (parsed?.resume?.summary && profile.fullName) {
    const escapedName = profile.fullName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameRegex = new RegExp(`^${escapedName}\\s+(?:is|has|brings)\\b`, 'i');
    if (nameRegex.test(parsed.resume.summary)) {
      parsed.resume.summary = parsed.resume.summary.replace(nameRegex, 'I am an experienced professional who is ');
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
