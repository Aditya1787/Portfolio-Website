import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initDb } from '../server/db.js';
import authRoutes from '../server/routes/auth.js';
import appointmentRoutes from '../server/routes/appointments.js';
import assistantRoutes from '../server/routes/assistants.js';

const app = express();

initDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/assistants', assistantRoutes);

export default app;
