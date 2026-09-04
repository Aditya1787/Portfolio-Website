import express from 'express';
import db from '../db.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { sendAppointmentEmail } from '../utils/mailer.js';

const router = express.Router();

// Helper to get socket.io instance attached to req
const getIo = (req) => req.app.get('io');

// Helper to validate email format
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// GET /api/appointments/busy-slots - Public route to fetch occupied slots for a date
router.get('/busy-slots', (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.json({ busySlots: [] });
  }

  const stmt = db.prepare(`
    SELECT start_time, end_time, status FROM appointments
    WHERE appointment_date = ? AND status IN ('PENDING', 'APPROVED', 'COMPLETED')
  `);
  const busySlots = stmt.all(date);
  return res.json({ busySlots });
});

// POST /api/appointments - Public Appointment Booking
router.post('/', (req, res) => {
  const { name, email, phone, description, appointment_date, start_time, end_time: custom_end_time } = req.body;

  // Validation: required fields
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Please enter your full name.' });
  }
  if (!email || !isValidEmail(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!description || !description.trim()) {
    return res.status(400).json({ error: 'Please enter a description or reason for the appointment.' });
  }
  if (!appointment_date || !start_time) {
    return res.status(400).json({ error: 'Please select a valid date and start time.' });
  }

  // Calculate default end_time if not provided (default 30 mins)
  let end_time = custom_end_time;
  if (!end_time) {
    const [h, m] = start_time.split(':').map(Number);
    const dateObj = new Date(2000, 0, 1, h, m + 30);
    const endH = String(dateObj.getHours()).padStart(2, '0');
    const endM = String(dateObj.getMinutes()).padStart(2, '0');
    end_time = `${endH}:${endM}`;
  }

  // Validate date & time is not in past
  const appointmentDateTimeStr = `${appointment_date}T${start_time}:00`;
  const appointmentDateTime = new Date(appointmentDateTimeStr);
  const now = new Date();

  if (isNaN(appointmentDateTime.getTime()) || appointmentDateTime < now) {
    return res.status(400).json({ error: 'Please select a future date and time.' });
  }

  // Double booking check:
  // Look for active appointments (PENDING, APPROVED, COMPLETED) on same date where time ranges overlap
  // Overlap condition: start_time < existing.end_time AND end_time > existing.start_time
  const overlapStmt = db.prepare(`
    SELECT id, start_time, end_time FROM appointments
    WHERE appointment_date = ?
      AND status IN ('PENDING', 'APPROVED', 'COMPLETED')
      AND (? < end_time AND ? > start_time)
  `);

  const existingOverlap = overlapStmt.get(appointment_date, start_time, end_time);

  if (existingOverlap) {
    // Generate suggested times for the day
    const busySlots = db.prepare(`
      SELECT start_time, end_time FROM appointments
      WHERE appointment_date = ? AND status IN ('PENDING', 'APPROVED', 'COMPLETED')
    `).all(appointment_date);

    return res.status(409).json({
      error: 'This appointment slot is no longer available. Please select another time.',
      busySlots
    });
  }

  // Insert appointment
  const insertStmt = db.prepare(`
    INSERT INTO appointments (name, email, phone, description, appointment_date, start_time, end_time, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')
  `);

  const result = insertStmt.run(
    name.trim(),
    email.trim().toLowerCase(),
    phone ? phone.trim() : null,
    description.trim(),
    appointment_date,
    start_time,
    end_time
  );

  const newAppointmentStmt = db.prepare(`
    SELECT a.*, u.email as approved_by_email 
    FROM appointments a 
    LEFT JOIN users u ON a.approved_by = u.id 
    WHERE a.id = ?
  `);
  const newAppointment = newAppointmentStmt.get(result.lastInsertRowid);

  // Real-time emit to connected dashboard clients
  const io = getIo(req);
  if (io) {
    io.emit('appointment:new', newAppointment);
  }

  return res.status(201).json({
    message: 'Appointment request submitted successfully!',
    appointment: newAppointment
  });
});

// GET /api/appointments - Authenticated OWNER/ASSISTANT
router.get('/', verifyToken, (req, res) => {
  const { status, date } = req.query;

  let query = `
    SELECT a.*, u.email as approved_by_email 
    FROM appointments a 
    LEFT JOIN users u ON a.approved_by = u.id
  `;
  const params = [];
  const conditions = [];

  if (status && status !== 'ALL') {
    conditions.push('a.status = ?');
    params.push(status);
  }

  if (date) {
    conditions.push('a.appointment_date = ?');
    params.push(date);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY a.appointment_date DESC, a.start_time DESC';

  const stmt = db.prepare(query);
  const appointments = stmt.all(...params);

  return res.json({ appointments });
});

// GET /api/appointments/:id
router.get('/:id', verifyToken, (req, res) => {
  const stmt = db.prepare(`
    SELECT a.*, u.email as approved_by_email 
    FROM appointments a 
    LEFT JOIN users u ON a.approved_by = u.id 
    WHERE a.id = ?
  `);
  const appointment = stmt.get(req.params.id);

  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }

  return res.json({ appointment });
});

// PATCH /api/appointments/:id/approve
router.patch('/:id/approve', verifyToken, (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  const stmt = db.prepare(`
    UPDATE appointments 
    SET status = 'APPROVED', approved_by = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  const result = stmt.run(userId, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }

  const updatedStmt = db.prepare(`
    SELECT a.*, u.email as approved_by_email 
    FROM appointments a 
    LEFT JOIN users u ON a.approved_by = u.id 
    WHERE a.id = ?
  `);
  const updated = updatedStmt.get(id);

  // Real-time emit to connected dashboard clients
  const io = getIo(req);
  if (io) {
    io.emit('appointment:updated', updated);
  }

  // Send Email Notification (async, does not block API response)
  sendAppointmentEmail({
    to: updated.email,
    name: updated.name,
    date: updated.appointment_date,
    time: `${updated.start_time} - ${updated.end_time}`,
    status: updated.status,
    approved_by_email: updated.approved_by_email,
    description: updated.description
  }).catch(err => console.error('Email send failed:', err));

  return res.json({ message: `Appointment ${updated.status.toLowerCase()} successfully.`, appointment: updated });
});

// PATCH /api/appointments/:id/reject
router.patch('/:id/reject', verifyToken, (req, res) => {
  const id = req.params.id;

  const stmt = db.prepare(`
    UPDATE appointments 
    SET status = 'REJECTED', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  const result = stmt.run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }

  const updatedStmt = db.prepare(`
    SELECT a.*, u.email as approved_by_email 
    FROM appointments a 
    LEFT JOIN users u ON a.approved_by = u.id 
    WHERE a.id = ?
  `);
  const updated = updatedStmt.get(id);

  const io = getIo(req);
  if (io) {
    io.emit('appointment:updated', updated);
  }

  sendAppointmentEmail({
    to: updated.email,
    name: updated.name,
    date: updated.appointment_date,
    time: `${updated.start_time} - ${updated.end_time}`,
    status: 'REJECTED',
    description: updated.description
  }).catch(err => console.error('Email send failed:', err));

  return res.json({ message: 'Appointment rejected successfully.', appointment: updated });
});

// PATCH /api/appointments/:id/cancel
router.patch('/:id/cancel', verifyToken, (req, res) => {
  const id = req.params.id;

  const stmt = db.prepare(`
    UPDATE appointments 
    SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  const result = stmt.run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }

  const updatedStmt = db.prepare(`
    SELECT a.*, u.email as approved_by_email 
    FROM appointments a 
    LEFT JOIN users u ON a.approved_by = u.id 
    WHERE a.id = ?
  `);
  const updated = updatedStmt.get(id);

  const io = getIo(req);
  if (io) {
    io.emit('appointment:updated', updated);
  }

  return res.json({ message: 'Appointment cancelled successfully.', appointment: updated });
});

// PATCH /api/appointments/:id/complete
router.patch('/:id/complete', verifyToken, (req, res) => {
  const id = req.params.id;

  const stmt = db.prepare(`
    UPDATE appointments 
    SET status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  const result = stmt.run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }

  const updatedStmt = db.prepare(`
    SELECT a.*, u.email as approved_by_email 
    FROM appointments a 
    LEFT JOIN users u ON a.approved_by = u.id 
    WHERE a.id = ?
  `);
  const updated = updatedStmt.get(id);

  const io = getIo(req);
  if (io) {
    io.emit('appointment:updated', updated);
  }

  return res.json({ message: 'Appointment marked as completed.', appointment: updated });
});

// DELETE /api/appointments/:id - OWNER only
router.delete('/:id', verifyToken, requireRole('OWNER'), (req, res) => {
  const id = req.params.id;

  const stmt = db.prepare('DELETE FROM appointments WHERE id = ?');
  const result = stmt.run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }

  const io = getIo(req);
  if (io) {
    io.emit('appointment:deleted', { id: Number(id) });
  }

  return res.json({ message: 'Appointment deleted successfully.', id: Number(id) });
});

export default router;
