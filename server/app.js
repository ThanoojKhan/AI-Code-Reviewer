import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import reviewRoutes from './routes/review.routes.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
  })
);
app.use(helmet());
app.use(express.json({ limit: '256kb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'AI Code Reviewer API is healthy.' });
});

app.use('/api/reviews', reviewRoutes);
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});
app.use(errorHandler);

export default app;
