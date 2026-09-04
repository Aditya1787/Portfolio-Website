import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import assistantRoutes from './routes/assistants.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true
  }
});

// Attach socket.io server to express app context
app.set('io', io);

// Initialize DB and Seed default accounts
initDb();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

// Rate limiting for Auth and Public Booking
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 30,
  message: { error: 'Too many login attempts. Please try again later.' }
});

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many booking attempts. Please try again later.' }
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/appointments', bookingLimiter, appointmentRoutes);
app.use('/api/assistants', assistantRoutes);

// Socket.IO handling
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Database: SQLite (server/database/appointments.db)`);
  console.log(`==================================================`);
});
