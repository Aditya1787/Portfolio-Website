import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On Vercel serverless environment, filesystem is read-only except /tmp
const dbDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'appointments.db');
const db = new Database(dbPath);

// Enable WAL mode if not on Vercel read-only or standard mode
try {
  db.pragma('journal_mode = WAL');
} catch (e) {}

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('OWNER', 'ASSISTANT')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      description TEXT NOT NULL,
      appointment_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED')),
      approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);
  `);

  seedUsers();
}

function seedUsers() {
  const seedData = [
    { email: 'adityam8787@gmail.com', pass: 'iammthebest@878601', role: 'OWNER' },
    { email: 'assistant1@gmail.com', pass: 'assistant@adi@8786', role: 'ASSISTANT' },
    { email: 'assistant2@gmail.com', pass: 'assistant@adi@8786', role: 'ASSISTANT' }
  ];

  const checkUserStmt = db.prepare('SELECT id FROM users WHERE email = ?');
  const insertUserStmt = db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)');

  for (const user of seedData) {
    const existing = checkUserStmt.get(user.email);
    if (!existing) {
      const hash = bcrypt.hashSync(user.pass, 10);
      insertUserStmt.run(user.email, hash, user.role);
    }
  }
}

// Auto-run initDb
initDb();

export default db;
