import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { checkRoute } from './routes/check-route.ts';
import { resumeRoute } from './routes/resume-route.ts';
import { getTemporalClient, closeTemporalClient } from './temporal/client.ts';
import { getDbPool, closeDbPool } from './db/client.ts';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../.env');
config({ path: envPath });

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Store server instance for hot reload cleanup
let server: ReturnType<typeof app.listen> | null = null;

// Middleware setup in order: morgan → helmet → cors → json parser
app.use(morgan('combined'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/check', checkRoute);

app.use('/api/resume', resumeRoute);

// Health check root endpoint
app.get('/', (_req, res) => {
  res.json({ message: 'Resume Publisher API is running' });
});

// Initialize Temporal client and database connection on startup
async function startServer() {
  // Initialize database connection pool
  try {
    getDbPool();
    console.log('Database connection pool initialized');
  } catch (error) {
    console.error('Failed to initialize database connection pool:', error);
    // Continue without database - API can still run but database operations won't work
  }

  // Initialize Temporal client
  try {
    await getTemporalClient();
    console.log('Temporal client connected');
  } catch (error) {
    console.error('Failed to connect to Temporal:', error);
    // Continue without Temporal - API can still run but workflows won't work
  }

  // Start server with retry logic only in development (for Docker hot reload)
  // In production, fail fast on port conflicts
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const startListening = (retryCount = 0): Promise<void> => {
    return new Promise((resolve, reject) => {
      const newServer = app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        server = newServer;
        resolve();
      });
      
      newServer.on('error', async (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          // Only retry in development (for Docker hot reload port conflicts)
          // In production, fail fast - port conflicts indicate a real problem
          if (isDevelopment && retryCount < 5) {
            const delay = Math.min(1000 * (retryCount + 1), 5000); // Exponential backoff, max 5s
            console.log(`Port ${PORT} is in use (attempt ${retryCount + 1}/5), waiting ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            try {
              await startListening(retryCount + 1);
              resolve();
            } catch (retryErr) {
              reject(retryErr);
            }
          } else {
            reject(new Error(`Failed to start server: port ${PORT} is already in use`));
          }
        } else {
          reject(err);
        }
      });
    });
  };
  
  await startListening();
}

// Graceful shutdown
async function shutdown() {
  console.log('Shutting down server...');
  
  // Close server if it exists
  if (server) {
    await new Promise<void>((resolve) => {
      server!.close(() => {
        console.log('Server closed');
        resolve();
      });
    });
  }
  
  // Close connections
  await closeDbPool();
  await closeTemporalClient();
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections...');
  await shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing connections...');
  await shutdown();
  process.exit(0);
});


startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
