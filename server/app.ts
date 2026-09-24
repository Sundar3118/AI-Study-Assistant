/**
 * Main Express Application
 * 
 * Demonstrates:
 * - Express initialization
 * - Standard middleware (express.json, CORS handling)
 * - Mounting REST endpoints under /api/study
 * - Centralized error handling
 */

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { studyRouter } from './routes/studyRoutes';
import { connectDB } from './db/mongo';

// Load environment variables (.env)
dotenv.config();

// Initialize MongoDB connection asynchronously
connectDB();

export const app = express();

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// Middleware: Enable basic CORS for local development
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'AI Study Assistant Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount the study assistant REST API routes
app.use('/api/study', studyRouter);

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Express Global Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

export default app;
