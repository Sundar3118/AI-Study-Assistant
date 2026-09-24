/**
 * Entry point for standalone server or production build
 * 
 * Runs the Express server on port 3000 (or PORT env) and serves
 * the Vite compiled static build in production.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { app } from './server/app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Serve static assets in production if dist/ exists
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// For SPA routing in production, fall back to index.html for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Study Assistant server is listening on port ${PORT}`);
});
