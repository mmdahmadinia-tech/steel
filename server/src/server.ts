import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { config } from './config';
import { closePool } from './database/pool';

// Import routes
import authRoutes from './routes/auth';
import heatsRoutes from './routes/heats';
import usersRoutes from './routes/users';
import notificationsRoutes from './routes/notifications';
import setupRoutes from './routes/setup';

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors(config.cors)); // CORS
app.use(compression()); // Compression
app.use(morgan('dev')); // Logging
app.use(express.json({ limit: '10mb' })); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/heats', heatsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/setup', setupRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Start server
const server = app.listen(config.port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     ███████╗██████████████╗ ██████╗██╗  ██╗              ║
║     ██╔════╝██╔═════██╔══╝██╔════╝██║  ██║              ║
║     ███████╗█████╗  ██║   ██║     ███████║              ║
║     ╚════██║██╔══╝  ██║   ██║     ██╔══██║              ║
║     ███████║███████╗██║   ╚██████╗██║  ██║              ║
║     ╚══════╝╚══════╝╚═╝    ╚═════╝╚═╝  ╚═╝              ║
║                                                           ║
║        STEELMETRICS Backend API v2.0.0                   ║
║        Server running on port ${config.port}                     ║
║        Environment: ${config.nodeEnv}                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
  });
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
  });
  await closePool();
  process.exit(0);
});

export default app;
