import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/assistants - OWNER only
router.get('/', verifyToken, requireRole('OWNER'), (req, res) => {
  const stmt = db.prepare('SELECT id, email, role, created_at FROM users WHERE role = "ASSISTANT" ORDER BY id ASC');
  const assistants = stmt.all();
  return res.json({ assistants });
});

// POST /api/assistants - OWNER only
router.post('/', verifyToken, requireRole('OWNER'), (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const stmt = db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, "ASSISTANT")');
  const result = stmt.run(email.toLowerCase().trim(), hash);

  const newAssistant = db.prepare('SELECT id, email, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ message: 'Assistant account created successfully.', assistant: newAssistant });
});

// DELETE /api/assistants/:id - OWNER only
router.delete('/:id', verifyToken, requireRole('OWNER'), (req, res) => {
  const targetId = req.params.id;

  const target = db.prepare('SELECT id, role FROM users WHERE id = ?').get(targetId);
  if (!target) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (target.role === 'OWNER') {
    return res.status(403).json({ error: 'Cannot delete the owner account.' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(targetId);
  return res.json({ message: 'Assistant account removed successfully.' });
});

export default router;
