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
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
      `);
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
  created_at: string;
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
  existingId?: string
): Promise<ApplicationRecord> {
  const now = new Date().toISOString();
  const id = existingId || generateId('app');

  const query = `
    INSERT INTO applications (id, user_id, job_title, company_name, job_description, result_json, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (id) DO UPDATE SET
      job_title = EXCLUDED.job_title,
      company_name = EXCLUDED.company_name,
      job_description = EXCLUDED.job_description,
      result_json = EXCLUDED.result_json,
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
    now,
    now,
  ]);
  return res.rows[0];
}

export async function deleteApplication(id: string, userId: string): Promise<boolean> {
  const query = 'DELETE FROM applications WHERE id = $1 AND user_id = $2';
  const res = await pool.query(query, [id, userId]);
  return (res.rowCount ?? 0) > 0;
}
