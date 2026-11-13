import pg from 'pg';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/cvumedb';
const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

export const pool = new Pool({
  connectionString,
  ssl: !isLocalhost ? { rejectUnauthorized: false } : undefined,
});

let initPromise: Promise<void> | null = null;

// Initialize PostgreSQL tables and indexes
export async function initDb(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          password_hash TEXT NOT NULL,
          salt TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          token VARCHAR(128) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS profiles (
          user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          data JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS applications (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          job_title VARCHAR(255) NOT NULL,
          company_name VARCHAR(255) NOT NULL,
          job_description TEXT NOT NULL,
          result_json JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      // Add modern automation columns to applications
      await client.query(`
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'applied';
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS platform VARCHAR(64) NOT NULL DEFAULT 'web';
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS match_score INTEGER NOT NULL DEFAULT 90;
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS application_url TEXT;
        ALTER TABLE applications ADD COLUMN IF NOT EXISTS logs JSONB NOT NULL DEFAULT '[]';
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS discovered_jobs (
          id VARCHAR(64) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          company VARCHAR(255) NOT NULL,
          location VARCHAR(255),
          salary VARCHAR(128),
          source VARCHAR(64) NOT NULL,
          source_url TEXT,
          description TEXT NOT NULL,
          tags TEXT[] NOT NULL DEFAULT '{}',
          contact_info VARCHAR(255),
          remote BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS automation_settings (
          user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          min_match_score INTEGER NOT NULL DEFAULT 80,
          target_roles TEXT[] NOT NULL DEFAULT '{"Full Stack Engineer", "Frontend Engineer", "Software Engineer"}',
          enabled_sources TEXT[] NOT NULL DEFAULT '{"telegram", "remoteok", "arbeitnow", "greenhouse", "lever"}',
          auto_apply_enabled BOOLEAN NOT NULL DEFAULT true,
          daily_limit INTEGER NOT NULL DEFAULT 15,
          telegram_handle VARCHAR(128),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
        CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
        CREATE INDEX IF NOT EXISTS idx_discovered_jobs_created_at ON discovered_jobs(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_discovered_jobs_source ON discovered_jobs(source);
      `);

      // Seed initial high-quality jobs if discovered_jobs is empty
      const existingJobsCount = await client.query('SELECT COUNT(*) FROM discovered_jobs');
      if (parseInt(existingJobsCount.rows[0].count, 10) === 0) {
        const seedJobs: Array<Omit<DiscoveredJobRecord, 'created_at'>> = [
          {
            id: 'job_tg_1',
            title: 'Senior Full Stack Engineer (Web3 & Real-Time)',
            company: 'OmniProtocol Labs',
            location: 'Remote Worldwide',
            salary: '$140k - $175k USD + Token Grants',
            source: 'telegram',
            source_url: 'https://t.me/tech_jobs_feed/8941',
            description: `We are hiring a Senior Full Stack Engineer to lead real-time transaction streaming and reactive browser dashboards.
Key Responsibilities:
• Build high-throughput WebSocket microservices using Node.js, TypeScript, and Redis.
• Craft ultra-fast React 19 dashboards with sub-100ms latency metrics.
• Deploy scalable containerized microservices to Kubernetes and AWS.
Requirements:
• 4+ years of professional experience with React, TypeScript, and Node.js.
• Experience with relational databases (PostgreSQL) and caching patterns.
• To apply, send your portfolio and resume to @alex_recruiter on Telegram or tap Apply!`,
            tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'WebSockets', 'Remote'],
            contact_info: '@alex_recruiter',
            remote: true,
          },
          {
            id: 'job_gh_2',
            title: 'Frontend Infrastructure Engineer',
            company: 'Stripe',
            location: 'San Francisco, CA / Remote (US)',
            salary: '$165k - $210k USD + Equity',
            source: 'greenhouse',
            source_url: 'https://boards.greenhouse.io/stripe/jobs/48912',
            description: `Stripe is hiring a Frontend Infrastructure Engineer for the Developer Experience organization.
You will engineer the core build tooling, TypeScript frameworks, and design component architecture that hundreds of engineers use daily.
Requirements:
• Deep mastery of modern JavaScript/TypeScript and React ecosystem.
• Proven track record optimizing Webpack/Vite build pipelines and Lighthouse performance.
• Strong architectural thinking regarding component abstraction and testing.`,
            tags: ['TypeScript', 'React', 'Vite', 'Design Systems', 'Performance'],
            contact_info: 'greenhouse:stripe-dev-infra',
            remote: true,
          },
          {
            id: 'job_lv_3',
            title: 'Senior React & Cloud Platform Developer',
            company: 'Supabase',
            location: 'Remote Worldwide',
            salary: '$135k - $170k USD',
            source: 'lever',
            source_url: 'https://jobs.lever.co/supabase/30129-react-cloud',
            description: `Supabase is the open source Firebase alternative. We are looking for a Senior React Engineer to scale the Supabase Studio dashboard.
Responsibilities:
• Architect database management interfaces for PostgreSQL, Auth, and Storage.
• Implement real-time client state with TanStack Query and Zustand.
• Collaborate with backend engineers to expose Postgres capabilities in an intuitive UI.
Requirements:
• 5+ years of React, Next.js, and TypeScript engineering.
• Strong familiarity with SQL, relational schema design, and Docker.`,
            tags: ['React', 'TypeScript', 'PostgreSQL', 'TailwindCSS', 'Open Source'],
            contact_info: 'lever:supabase-frontend',
            remote: true,
          },
          {
            id: 'job_ro_4',
            title: 'Staff Fullstack Systems Engineer',
            company: 'Datadog',
            location: 'Remote (US / Canada / Europe)',
            salary: '$175k - $225k USD',
            source: 'remoteok',
            source_url: 'https://remoteok.com/remote-jobs/1094-datadog-staff-fullstack',
            description: `Join Datadog to build telemetry visualization platforms processing millions of metrics per second.
You will write high-performance TypeScript frontend apps and Golang/Node.js backends.
Requirements:
• Experience with large-scale distributed web applications.
• Mastery of modern frontend architecture, Canvas/WebGL or SVG data visualizations.
• Passion for reliability, low-latency APIs, and automated CI/CD pipelines.`,
            tags: ['Full Stack', 'TypeScript', 'Node.js', 'Distributed Systems', 'Go'],
            contact_info: 'recruiting@datadoghq.com',
            remote: true,
          },
          {
            id: 'job_tg_5',
            title: 'Lead Frontend Architect',
            company: 'Telegram Ecosystem Fund',
            location: 'Remote (Europe / Middle East / Asia)',
            salary: '$150k - $190k USD',
            source: 'telegram',
            source_url: 'https://t.me/ton_careers/3102',
            description: `Seeking a Lead Frontend Architect to develop Telegram Mini Apps (TMA) and responsive cross-platform web utilities.
Responsibilities:
• Architect secure web applications integrated directly with Telegram WebApp SDK.
• Build reusable UI component kits with TailwindCSS and Motion.
• Direct contact with hiring leads via Telegram DM.
Requirements:
• 5+ years of expert React and TypeScript experience.
• Familiarity with Telegram bot API or Mini Apps is a major bonus.`,
            tags: ['React', 'TailwindCSS', 'Telegram SDK', 'TypeScript', 'Mobile Web'],
            contact_info: '@telegram_hiring_lead',
            remote: true,
          },
          {
            id: 'job_an_6',
            title: 'Senior Cloud & DevOps Engineer',
            company: 'True Talent Engineering',
            location: 'Berlin / Remote (EU)',
            salary: '€85,000 - €115,000 EUR',
            source: 'arbeitnow',
            source_url: 'https://www.arbeitnow.com/jobs/true-talent-cloud-engineer',
            description: `We are scaling our enterprise platform and seeking a Senior Cloud Engineer with strong Docker, Kubernetes, and PostgreSQL experience.
Key Focus:
• Maintain CI/CD pipelines, Docker registries, and multi-region Kubernetes clusters.
• Scale PostgreSQL database clusters with connection pooling and automated backups.
• Collaborate with application developers to optimize container deployments.`,
            tags: ['PostgreSQL', 'Docker', 'Kubernetes', 'DevOps', 'AWS', 'Linux'],
            contact_info: 'talent@truetalent.de',
            remote: true,
          },
        ];

        for (const job of seedJobs) {
          await client.query(`
            INSERT INTO discovered_jobs (id, title, company, location, salary, source, source_url, description, tags, contact_info, remote)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (id) DO NOTHING
          `, [
            job.id,
            job.title,
            job.company,
            job.location,
            job.salary,
            job.source,
            job.source_url,
            job.description,
            job.tags,
            job.contact_info,
            job.remote,
          ]);
        }
      }

      // Ensure all profiles stored in PostgreSQL have at least 5 projects
      const profilesRes = await client.query('SELECT user_id, data FROM profiles');
      const standardProjects = [
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
        {
          id: 'proj-3',
          name: 'PulseMetrics: Distributed Telemetry & APM Agent',
          description: 'Lightweight eBPF-based distributed tracing and latency aggregation agent processing 100k+ spans/sec with sub-millisecond overhead.',
          link: 'https://github.com/alexrivera-eng/pulse-metrics',
          technologies: ['Go', 'eBPF', 'OpenTelemetry', 'Prometheus', 'Docker'],
        },
        {
          id: 'proj-4',
          name: 'KubeRoute: Edge Load Balancer & Canary Gateway',
          description: 'Kubernetes-native dynamic reverse proxy with weighted canary traffic splitting, automated circuit breaking, and zero-downtime hot-reloading.',
          link: 'https://github.com/alexrivera-eng/kuberoute',
          technologies: ['Rust', 'Kubernetes', 'gRPC', 'Envoy', 'Redis'],
        },
        {
          id: 'proj-5',
          name: 'HyperGraph: Federated GraphQL Gateway',
          description: 'High-throughput schema stitching and caching engine with automated query planning, sub-graph deduplication, and field-level latency budgets.',
          link: 'https://github.com/alexrivera-eng/hypergraph',
          technologies: ['TypeScript', 'GraphQL', 'Redis', 'Apollo Federation', 'Node.js'],
        },
        {
          id: 'proj-6',
          name: 'VectorFlow: Semantic Code Search & Indexing Engine',
          description: 'Local-first semantic embedding pipeline and vector search index enabling instant natural language queries across multi-repo codebases.',
          link: 'https://github.com/alexrivera-eng/vectorflow',
          technologies: ['Python', 'pgvector', 'PostgreSQL', 'FastAPI', 'Transformers'],
        },
      ];

      for (const row of profilesRes.rows) {
        const pData = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        if (!Array.isArray(pData.projects) || pData.projects.length < 5) {
          const existingNames = new Set((pData.projects || []).map((p: any) => (p?.name || '').toLowerCase().trim()));
          const missing = standardProjects.filter(p => !existingNames.has(p.name.toLowerCase().trim()));
          pData.projects = [...(pData.projects || []), ...missing];
          await client.query('UPDATE profiles SET data = $1, updated_at = NOW() WHERE user_id = $2', [pData, row.user_id]);
        }
      }

      console.log('✓ PostgreSQL schema initialized successfully in database: cvumedb');
    } catch (err) {
      console.error('Failed to initialize PostgreSQL tables:', err);
      initPromise = null;
      throw err;
    } finally {
      client.release();
    }
  })();

  return initPromise;
}

// Auto-run schema init on module load
initDb().catch(err => {
  console.warn('Initial PostgreSQL connection attempt:', err?.message || err);
});

// Types
export interface UserRecord {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  salt: string;
  created_at: string;
  updated_at: string;
}

export interface SessionRecord {
  token: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}

export interface ApplicationRecord {
  id: string;
  user_id: string;
  job_title: string;
  company_name: string;
  job_description: string;
  result_json: any;
  status: string;
  platform: string;
  match_score: number;
  application_url?: string;
  logs: Array<{ step: string; timestamp: string; status: 'pending' | 'success' | 'info' | 'error'; message: string }>;
  created_at: string;
  updated_at: string;
}

export interface DiscoveredJobRecord {
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
}

export interface AutomationSettingsRecord {
  user_id: string;
  min_match_score: number;
  target_roles: string[];
  enabled_sources: string[];
  auto_apply_enabled: boolean;
  daily_limit: number;
  telegram_handle: string;
  updated_at: string;
}

// Security & Hashing Helpers
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const hashBuffer = Buffer.from(scryptSync(password, salt, 64).toString('hex'));
    const storedBuffer = Buffer.from(storedHash);
    if (hashBuffer.length !== storedBuffer.length) return false;
    return timingSafeEqual(hashBuffer, storedBuffer);
  } catch {
    return false;
  }
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${randomBytes(4).toString('hex')}`;
}

// User repository
export async function createUser(email: string, name: string, password: string): Promise<UserRecord> {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const id = generateId('usr');
  const { salt, hash } = hashPassword(password);
  const now = new Date().toISOString();

  const query = `
    INSERT INTO users (id, email, name, password_hash, salt, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const result = await pool.query(query, [id, normalizedEmail, name.trim(), hash, salt, now, now]);
  return result.rows[0];
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1';
  const result = await pool.query(query, [email.trim()]);
  return result.rows[0] || null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const query = 'SELECT * FROM users WHERE id = $1 LIMIT 1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

// Session repository
export async function createSession(userId: string, durationDays: number = 30): Promise<string> {
  const token = generateSessionToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  const query = `
    INSERT INTO sessions (token, user_id, expires_at, created_at)
    VALUES ($1, $2, $3, $4)
  `;
  await pool.query(query, [token, userId, expiresAt, now.toISOString()]);
  return token;
}

export async function findSession(token: string): Promise<{ session: SessionRecord; user: UserRecord } | null> {
  const query = `
    SELECT 
      s.token, s.user_id, s.expires_at, s.created_at,
      u.id as u_id, u.email as u_email, u.name as u_name, 
      u.password_hash as u_password_hash, u.salt as u_salt, 
      u.created_at as u_created_at, u.updated_at as u_updated_at
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = $1
    LIMIT 1
  `;
  const res = await pool.query(query, [token]);
  const row = res.rows[0];
  if (!row) return null;

  // Check expiration
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await deleteSession(token);
    return null;
  }

  return {
    session: {
      token: row.token,
      user_id: row.user_id,
      expires_at: row.expires_at,
      created_at: row.created_at,
    },
    user: {
      id: row.u_id,
      email: row.u_email,
      name: row.u_name,
      password_hash: row.u_password_hash,
      salt: row.u_salt,
      created_at: row.u_created_at,
      updated_at: row.u_updated_at,
    },
  };
}

export async function deleteSession(token: string): Promise<void> {
  const query = 'DELETE FROM sessions WHERE token = $1';
  await pool.query(query, [token]);
}

export async function deleteUserSessions(userId: string): Promise<void> {
  const query = 'DELETE FROM sessions WHERE user_id = $1';
  await pool.query(query, [userId]);
}

// Profile repository
export async function getProfile(userId: string): Promise<any | null> {
  const query = 'SELECT data FROM profiles WHERE user_id = $1 LIMIT 1';
  const res = await pool.query(query, [userId]);
  const row = res.rows[0];
  if (!row) return null;
  return typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
}

export async function upsertProfile(userId: string, profileData: any): Promise<void> {
  const now = new Date().toISOString();
  const query = `
    INSERT INTO profiles (user_id, data, updated_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id) DO UPDATE SET
      data = EXCLUDED.data,
      updated_at = EXCLUDED.updated_at
  `;
  await pool.query(query, [userId, profileData, now]);
}

// Applications repository (Saved Tailored Resumes & Pitches in PostgreSQL)
export async function getApplications(userId: string): Promise<ApplicationRecord[]> {
  const query = `
    SELECT * FROM applications
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  const res = await pool.query(query, [userId]);
  return res.rows;
}

export async function getApplicationById(id: string, userId: string): Promise<ApplicationRecord | null> {
  const query = 'SELECT * FROM applications WHERE id = $1 AND user_id = $2 LIMIT 1';
  const res = await pool.query(query, [id, userId]);
  return res.rows[0] || null;
}

export async function saveApplication(
  userId: string,
  jobTitle: string,
  companyName: string,
  jobDescription: string,
  resultJson: any,
  existingId?: string,
  status: string = 'applied',
  platform: string = 'web',
  matchScore: number = 90,
  applicationUrl?: string,
  logs: any[] = []
): Promise<ApplicationRecord> {
  const now = new Date().toISOString();
  const id = existingId || generateId('app');

  const query = `
    INSERT INTO applications (id, user_id, job_title, company_name, job_description, result_json, status, platform, match_score, application_url, logs, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    ON CONFLICT (id) DO UPDATE SET
      job_title = EXCLUDED.job_title,
      company_name = EXCLUDED.company_name,
      job_description = EXCLUDED.job_description,
      result_json = EXCLUDED.result_json,
      status = EXCLUDED.status,
      platform = EXCLUDED.platform,
      match_score = EXCLUDED.match_score,
      application_url = EXCLUDED.application_url,
      logs = EXCLUDED.logs,
      updated_at = EXCLUDED.updated_at
    RETURNING *
  `;
  const res = await pool.query(query, [
    id,
    userId,
    jobTitle,
    companyName,
    jobDescription,
    resultJson,
    status,
    platform,
    matchScore,
    applicationUrl || null,
    JSON.stringify(logs || []),
    now,
    now,
  ]);
  return res.rows[0];
}

export async function updateApplicationStatus(
  id: string,
  userId: string,
  status: string
): Promise<ApplicationRecord | null> {
  const now = new Date().toISOString();
  const query = `
    UPDATE applications
    SET status = $1, updated_at = $2
    WHERE id = $3 AND user_id = $4
    RETURNING *
  `;
  const res = await pool.query(query, [status, now, id, userId]);
  return res.rows[0] || null;
}

export async function deleteApplication(id: string, userId: string): Promise<boolean> {
  const query = 'DELETE FROM applications WHERE id = $1 AND user_id = $2';
  const res = await pool.query(query, [id, userId]);
  return (res.rowCount ?? 0) > 0;
}

// Discovered Jobs repository
export async function getDiscoveredJobs(limit: number = 50, source?: string): Promise<DiscoveredJobRecord[]> {
  let query = 'SELECT * FROM discovered_jobs';
  const params: any[] = [];
  if (source && source !== 'all') {
    query += ' WHERE source = $1';
    params.push(source);
  }
  query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
  params.push(limit);

  const res = await pool.query(query, params);
  return res.rows;
}

export async function getDiscoveredJobById(id: string): Promise<DiscoveredJobRecord | null> {
  const query = 'SELECT * FROM discovered_jobs WHERE id = $1 LIMIT 1';
  const res = await pool.query(query, [id]);
  return res.rows[0] || null;
}

export async function upsertDiscoveredJobs(jobs: Array<Omit<DiscoveredJobRecord, 'created_at'>>): Promise<number> {
  let count = 0;
  for (const job of jobs) {
    const query = `
      INSERT INTO discovered_jobs (id, title, company, location, salary, source, source_url, description, tags, contact_info, remote)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        company = EXCLUDED.company,
        location = EXCLUDED.location,
        salary = EXCLUDED.salary,
        source = EXCLUDED.source,
        source_url = EXCLUDED.source_url,
        description = EXCLUDED.description,
        tags = EXCLUDED.tags,
        contact_info = EXCLUDED.contact_info,
        remote = EXCLUDED.remote
    `;
    await pool.query(query, [
      job.id,
      job.title,
      job.company,
      job.location,
      job.salary,
      job.source,
      job.source_url,
      job.description,
      job.tags,
      job.contact_info,
      job.remote,
    ]);
    count++;
  }
  return count;
}

// Automation Settings repository
export async function getAutomationSettings(userId: string): Promise<AutomationSettingsRecord> {
  const query = 'SELECT * FROM automation_settings WHERE user_id = $1 LIMIT 1';
  const res = await pool.query(query, [userId]);
  if (res.rows[0]) return res.rows[0];

  // Return default settings
  return {
    user_id: userId,
    min_match_score: 80,
    target_roles: ['Full Stack Engineer', 'Frontend Engineer', 'Software Engineer', 'React Developer'],
    enabled_sources: ['telegram', 'remoteok', 'arbeitnow', 'greenhouse', 'lever'],
    auto_apply_enabled: true,
    daily_limit: 15,
    telegram_handle: '',
    updated_at: new Date().toISOString(),
  };
}

export async function saveAutomationSettings(
  userId: string,
  settings: Partial<AutomationSettingsRecord>
): Promise<AutomationSettingsRecord> {
  const now = new Date().toISOString();
  const query = `
    INSERT INTO automation_settings (user_id, min_match_score, target_roles, enabled_sources, auto_apply_enabled, daily_limit, telegram_handle, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (user_id) DO UPDATE SET
      min_match_score = COALESCE($2, automation_settings.min_match_score),
      target_roles = COALESCE($3, automation_settings.target_roles),
      enabled_sources = COALESCE($4, automation_settings.enabled_sources),
      auto_apply_enabled = COALESCE($5, automation_settings.auto_apply_enabled),
      daily_limit = COALESCE($6, automation_settings.daily_limit),
      telegram_handle = COALESCE($7, automation_settings.telegram_handle),
      updated_at = $8
    RETURNING *
  `;
  const res = await pool.query(query, [
    userId,
    settings.min_match_score ?? 80,
    settings.target_roles ?? ['Full Stack Engineer', 'Frontend Engineer', 'Software Engineer'],
    settings.enabled_sources ?? ['telegram', 'remoteok', 'arbeitnow', 'greenhouse', 'lever'],
    settings.auto_apply_enabled ?? true,
    settings.daily_limit ?? 15,
    settings.telegram_handle ?? '',
    now,
  ]);
  return res.rows[0];
}
