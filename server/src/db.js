import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pg from "pg";

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, "../../.env") });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const remoteSsl = process.env.DATABASE_SSL === "true"
  || /sslmode=require|rlwy\.net|railway\.app/i.test(connectionString || "");

export const pool = new Pool({
  connectionString,
  ssl: remoteSsl ? { rejectUnauthorized: false } : undefined,
});

const schema = `
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pages (
  slug TEXT PRIMARY KEY,
  nav_label TEXT NOT NULL,
  nav_order INT NOT NULL,
  kicker TEXT DEFAULT '',
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  intro TEXT DEFAULT '',
  quote TEXT DEFAULT '',
  quote_author TEXT DEFAULT '',
  blocks JSONB NOT NULL DEFAULT '[]',
  show_in_nav BOOLEAN DEFAULT TRUE,
  published BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS entries (
  id SERIAL PRIMARY KEY,
  collection TEXT NOT NULL,
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  body TEXT DEFAULT '',
  metric TEXT DEFAULT '',
  image TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  extra JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);
`;

export async function initDb() {
  await pool.query(schema);
}

export async function loadSite({ includeHidden = false } = {}) {
  const pageWhere = includeHidden ? "" : "WHERE published = TRUE";
  const entryWhere = includeHidden ? "" : "WHERE published = TRUE";
  const [pages, entries, settingsRows, unread] = await Promise.all([
    pool.query(`SELECT * FROM pages ${pageWhere} ORDER BY nav_order, slug`),
    pool.query(`SELECT * FROM entries ${entryWhere} ORDER BY sort_order, id`),
    pool.query("SELECT key, value FROM settings"),
    pool.query("SELECT COUNT(*)::int AS n FROM messages WHERE read = FALSE"),
  ]);
  const settings = {};
  for (const row of settingsRows.rows) settings[row.key] = row.value;
  return {
    pages: pages.rows,
    entries: entries.rows,
    settings,
    unreadMessages: unread.rows[0]?.n || 0,
  };
}

export function uploadsDir() {
  if (process.env.UPLOAD_DIR) return path.resolve(process.env.UPLOAD_DIR);
  return path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "uploads");
}

export function ensureUploads() {
  const dir = uploadsDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}
