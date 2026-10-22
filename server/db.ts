import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';

// Ensure data directory exists
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'cvume.db');
export const db = new DatabaseSync(DB_PATH);

// Enable foreign keys and WAL mode for high performance
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    job_description TEXT NOT NULL,
    result_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
`);

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
  result_json: string;
  created_at: string;
  updated_at: string;
}

// Helpers
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
export function createUser(email: string, name: string, password: string):UserRecord {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = findUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const id = generateId('usr');
  const { salt, hash } = hashPassword(password);
  const now = new Date().toISOString();

  const insert = db.prepare(`
    INSERT INTO users (id, email, name, password_hash, salt, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insert.run(id, normalizedEmail, name.trim(), hash, salt, now, now);

  return {
    id,
    email: normalizedEmail,
    name: name.trim(),
    password_hash: hash,
    salt,
    created_at: now,
    updated_at: now,
  };
}

export function findUserByEmail(email: string): UserRecord | null {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE');
  const result = stmt.get(email.trim().toLowerCase()) as UserRecord | undefined;
  return result || null;
}

export function findUserById(id: string): UserRecord | null {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const result = stmt.get(id) as UserRecord | undefined;
  return result || null;
}

// Session repository
export function createSession(userId: string, durationDays: number = 30): string {
  const token = generateSessionToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  const stmt = db.prepare(`
    INSERT INTO sessions (token, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(token, userId, expiresAt, now.toISOString());
  return token;
}

export function findSession(token: string): { session: SessionRecord; user: UserRecord } | null {
  const stmt = db.prepare(`
    SELECT 
      s.token, s.user_id, s.expires_at, s.created_at,
      u.id as u_id, u.email as u_email, u.name as u_name, 
      u.password_hash as u_password_hash, u.salt as u_salt, 
      u.created_at as u_created_at, u.updated_at as u_updated_at
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ?
  `);
  const row = stmt.get(token) as any;
  if (!row) return null;

  // Check expiration
  if (new Date(row.expires_at).getTime() < Date.now()) {
    deleteSession(token);
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

export function deleteSession(token: string): void {
  const stmt = db.prepare('DELETE FROM sessions WHERE token = ?');
  stmt.run(token);
}

export function deleteUserSessions(userId: string): void {
  const stmt = db.prepare('DELETE FROM sessions WHERE user_id = ?');
  stmt.run(userId);
}

// Profile repository
export function getProfile(userId: string): any | null {
  const stmt = db.prepare('SELECT data FROM profiles WHERE user_id = ?');
  const row = stmt.get(userId) as { data: string } | undefined;
  if (!row) return null;
  try {
    return JSON.parse(row.data);
  } catch {
    return null;
  }
}

export function upsertProfile(userId: string, profileData: any): void {
  const now = new Date().toISOString();
  const jsonStr = JSON.stringify(profileData);
  const stmt = db.prepare(`
    INSERT INTO profiles (user_id, data, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      data = excluded.data,
      updated_at = excluded.updated_at
  `);
  stmt.run(userId, jsonStr, now);
}

// Applications repository (Tailored Resumes, Letters, and Pitches)
export function getApplications(userId: string): ApplicationRecord[] {
  const stmt = db.prepare(`
    SELECT * FROM applications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `);
  return (stmt.all(userId) as unknown as ApplicationRecord[]) || [];
}

export function getApplicationById(id: string, userId: string): ApplicationRecord | null {
  const stmt = db.prepare(`
    SELECT * FROM applications
    WHERE id = ? AND user_id = ?
  `);
  const result = stmt.get(id, userId) as ApplicationRecord | undefined;
  return result || null;
}

export function saveApplication(
  userId: string,
  jobTitle: string,
  companyName: string,
  jobDescription: string,
  resultJson: any,
  existingId?: string
): ApplicationRecord {
  const now = new Date().toISOString();
  const id = existingId || generateId('app');
  const resultStr = typeof resultJson === 'string' ? resultJson : JSON.stringify(resultJson);

  const stmt = db.prepare(`
    INSERT INTO applications (id, user_id, job_title, company_name, job_description, result_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      job_title = excluded.job_title,
      company_name = excluded.company_name,
      job_description = excluded.job_description,
      result_json = excluded.result_json,
      updated_at = excluded.updated_at
  `);
  stmt.run(id, userId, jobTitle, companyName, jobDescription, resultStr, now, now);

  return {
    id,
    user_id: userId,
    job_title: jobTitle,
    company_name: companyName,
    job_description: jobDescription,
    result_json: resultStr,
    created_at: now,
    updated_at: now,
  };
}

export function deleteApplication(id: string, userId: string): boolean {
  const stmt = db.prepare('DELETE FROM applications WHERE id = ? AND user_id = ?');
  const res = stmt.run(id, userId);
  return (res as any).changes > 0;
}
