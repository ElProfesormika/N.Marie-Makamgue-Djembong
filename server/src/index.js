import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import dotenv from "dotenv";
import { pool, initDb, loadSite, ensureUploads } from "./db.js";
import { seedIfEmpty } from "./seed.js";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config();

const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const uploadDir = ensureUploads();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const safe = allowed.includes(ext) ? ext : ".jpg";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if ((file.mimetype || "").startsWith("image/")) cb(null, true);
    else cb(new Error("Seules les images sont acceptées."));
  },
});

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Session expirée. Reconnectez-vous." });
  }
}

function cleanText(value, max = 20000) {
  return String(value ?? "").slice(0, max);
}

function cleanExtra(extra) {
  const source = extra && typeof extra === "object" && !Array.isArray(extra) ? extra : {};
  const odds = Array.isArray(source.odds)
    ? [...new Set(source.odds.map(Number).filter((id) => Number.isInteger(id) && id >= 1 && id <= 17))].sort((a, b) => a - b)
    : [];
  const result = { odds };
  const lat = Number(source.lat);
  const lng = Number(source.lng);
  if (Number.isFinite(lat) && lat >= -90 && lat <= 90) result.lat = Math.round(lat * 1000) / 1000;
  if (Number.isFinite(lng) && lng >= -180 && lng <= 180) result.lng = Math.round(lng * 1000) / 1000;
  const status = cleanText(source.status, 60).trim();
  if (status) result.status = status;
  for (const key of ["date", "end"]) {
    const value = cleanText(source[key], 10).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) result[key] = value;
  }
  for (const key of ["startTime", "endTime"]) {
    const value = cleanText(source[key], 5).trim();
    if (/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) result[key] = value;
  }
  return result;
}

function cleanBlocks(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks.slice(0, 40).map((block) => ({
    heading: cleanText(block?.heading, 300),
    text: cleanText(block?.text, 8000),
  }));
}

async function waitForDb() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch (error) {
      if (attempt === 30) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(uploadDir));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("/api/site", async (_req, res) => {
  try {
    res.json(await loadSite());
  } catch (error) {
    res.status(500).json({ error: "Impossible de charger le site." });
  }
});

app.post("/api/contact", async (req, res) => {
  const name = cleanText(req.body?.name, 160).trim();
  const email = cleanText(req.body?.email, 180).trim();
  const phone = cleanText(req.body?.phone, 40).trim();
  const body = cleanText(req.body?.body, 5000).trim();
  if (req.body?.company) return res.json({ ok: true });
  if (name.length < 2 || !email.includes("@") || body.length < 5) {
    return res.status(400).json({ error: "Indiquez votre nom, un e-mail valide et un message." });
  }
  await pool.query(
    "INSERT INTO messages (name, email, phone, body) VALUES ($1,$2,$3,$4)",
    [name, email, phone, body]
  );
  res.json({ ok: true });
});

app.post("/api/auth/login", async (req, res) => {
  const email = cleanText(req.body?.email, 180).trim().toLowerCase();
  const password = String(req.body?.password || "");
  const found = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
  const admin = found.rows[0];
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return res.status(401).json({ error: "Identifiants incorrects." });
  }
  const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, email: admin.email });
});

app.get("/api/admin/me", auth, (req, res) => {
  res.json({ email: req.admin.email });
});

app.get("/api/admin/site", auth, async (_req, res) => {
  res.json(await loadSite({ includeHidden: true }));
});

app.put("/api/admin/settings/:key", auth, async (req, res) => {
  const key = cleanText(req.params.key, 40);
  if (!["brand", "hero", "contact", "sections"].includes(key)) {
    return res.status(400).json({ error: "Réglage inconnu." });
  }
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({ error: "Contenu invalide." });
  }
  const value = key === "sections"
    ? Object.fromEntries(
      Object.entries(req.body)
        .filter(([field]) => /^[a-zA-Z][a-zA-Z0-9]{0,40}$/.test(field))
        .map(([field, raw]) => [field, cleanText(raw, 300)]),
    )
    : req.body;
  await pool.query(
    `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2::jsonb, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, JSON.stringify(value)]
  );
  res.json({ ok: true });
});

app.put("/api/admin/pages/:slug", auth, async (req, res) => {
  const slug = cleanText(req.params.slug, 80);
  const result = await pool.query(
    `UPDATE pages SET
      nav_label = $2,
      nav_order = $3,
      kicker = $4,
      title = $5,
      subtitle = $6,
      intro = $7,
      quote = $8,
      quote_author = $9,
      blocks = $10::jsonb,
      show_in_nav = $11,
      published = $12,
      updated_at = now()
     WHERE slug = $1
     RETURNING *`,
    [
      slug,
      cleanText(req.body?.nav_label, 80),
      Number(req.body?.nav_order || 0),
      cleanText(req.body?.kicker, 180),
      cleanText(req.body?.title, 240),
      cleanText(req.body?.subtitle, 400),
      cleanText(req.body?.intro, 8000),
      cleanText(req.body?.quote, 8000),
      cleanText(req.body?.quote_author, 240),
      JSON.stringify(cleanBlocks(req.body?.blocks)),
      req.body?.show_in_nav !== false,
      req.body?.published !== false,
    ]
  );
  if (!result.rows[0]) return res.status(404).json({ error: "Page introuvable." });
  res.json(result.rows[0]);
});

app.post("/api/admin/entries", auth, async (req, res) => {
  const collection = cleanText(req.body?.collection, 80);
  if (!collection) return res.status(400).json({ error: "Collection manquante." });
  const order = await pool.query(
    "SELECT COALESCE(MAX(sort_order), -1)::int AS n FROM entries WHERE collection = $1",
    [collection]
  );
  const created = await pool.query(
    `INSERT INTO entries (collection, title, subtitle, body, metric, image, sort_order, published, extra)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb) RETURNING *`,
    [
      collection,
      cleanText(req.body?.title, 300),
      cleanText(req.body?.subtitle, 300),
      cleanText(req.body?.body, 8000),
      cleanText(req.body?.metric, 40),
      cleanText(req.body?.image, 400),
      Number(order.rows[0].n) + 1,
      req.body?.published !== false,
      JSON.stringify(cleanExtra(req.body?.extra)),
    ]
  );
  res.json(created.rows[0]);
});

app.put("/api/admin/entries/:id", auth, async (req, res) => {
  const updated = await pool.query(
    `UPDATE entries SET
      title = $2, subtitle = $3, body = $4, metric = $5, image = $6,
      published = $7, extra = $8::jsonb, updated_at = now()
     WHERE id = $1 RETURNING *`,
    [
      Number(req.params.id),
      cleanText(req.body?.title, 300),
      cleanText(req.body?.subtitle, 300),
      cleanText(req.body?.body, 8000),
      cleanText(req.body?.metric, 40),
      cleanText(req.body?.image, 400),
      req.body?.published !== false,
      JSON.stringify(cleanExtra(req.body?.extra)),
    ]
  );
  if (!updated.rows[0]) return res.status(404).json({ error: "Élément introuvable." });
  res.json(updated.rows[0]);
});

app.delete("/api/admin/entries/:id", auth, async (req, res) => {
  const found = await pool.query("DELETE FROM entries WHERE id = $1 RETURNING image", [
    Number(req.params.id),
  ]);
  const image = found.rows[0]?.image || "";
  if (image.startsWith("/uploads/")) {
    const [still, settings] = await Promise.all([
      pool.query("SELECT 1 FROM entries WHERE image = $1 LIMIT 1", [image]),
      pool.query("SELECT value FROM settings"),
    ]);
    const usedInSettings = settings.rows.some((row) => JSON.stringify(row.value).includes(image));
    const base = path.basename(image);
    const keep = ["hero.jpg", "galerie-1.jpg"].includes(base);
    if (!still.rows[0] && !usedInSettings && !keep) {
      fs.unlink(path.join(uploadDir, base), () => {});
    }
  }
  res.json({ ok: true });
});

app.post("/api/admin/entries/reorder", auth, async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(Number) : [];
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (let index = 0; index < ids.length; index += 1) {
      await client.query("UPDATE entries SET sort_order = $1 WHERE id = $2", [index, ids[index]]);
    }
    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Réorganisation impossible." });
  } finally {
    client.release();
  }
});

app.post("/api/admin/upload", auth, (req, res) => {
  upload.single("file")(req, res, (error) => {
    if (error) return res.status(400).json({ error: error.message || "Envoi impossible." });
    if (!req.file) return res.status(400).json({ error: "Aucune image reçue." });
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

app.get("/api/admin/messages", auth, async (_req, res) => {
  const rows = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
  res.json(rows.rows);
});

app.patch("/api/admin/messages/:id", auth, async (req, res) => {
  const updated = await pool.query(
    "UPDATE messages SET read = $2 WHERE id = $1 RETURNING *",
    [Number(req.params.id), Boolean(req.body?.read)]
  );
  res.json(updated.rows[0] || null);
});

app.delete("/api/admin/messages/:id", auth, async (req, res) => {
  await pool.query("DELETE FROM messages WHERE id = $1", [Number(req.params.id)]);
  res.json({ ok: true });
});

app.put("/api/admin/password", auth, async (req, res) => {
  const current = String(req.body?.current || "");
  const next = String(req.body?.next || "");
  if (next.length < 8) {
    return res.status(400).json({ error: "Le nouveau mot de passe doit contenir au moins 8 caractères." });
  }
  const found = await pool.query("SELECT * FROM admins WHERE id = $1", [req.admin.id]);
  const admin = found.rows[0];
  if (!admin || !(await bcrypt.compare(current, admin.password_hash))) {
    return res.status(401).json({ error: "Mot de passe actuel incorrect." });
  }
  const hash = await bcrypt.hash(next, 10);
  await pool.query("UPDATE admins SET password_hash = $2 WHERE id = $1", [admin.id, hash]);
  res.json({ ok: true });
});

const here = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(here, "../../client/dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api|\/uploads).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

async function main() {
  await waitForDb();
  await initDb();
  await seedIfEmpty();
  const host = process.env.HOST || "0.0.0.0";
  app.listen(PORT, host, () => {
    console.log(`API prête sur http://${host}:${PORT}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
