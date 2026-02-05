import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { checkRoute } from './routes/check-route.js';
import { resumeRoute } from './routes/resume-route.js';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware setup in order: morgan → helmet → cors → json parser
app.use(morgan('combined'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/check', checkRoute);

app.use('/api/resume', resumeRoute);

// Health check root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Resume Publisher API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
