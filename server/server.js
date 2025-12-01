import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import testRouter from './routes/testRoute.js';

// Validate required environment variables
const requiredEnvVars = ['CLERK_SECRET_KEY', 'CLERK_PUBLISHABLE_KEY', 'GEMINI_API_KEY', 'DATABASE_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease add these to your server/.env file\n');
  process.exit(1);
}

console.log('✅ All required environment variables are set');

const app = express();

try {
  await connectCloudinary();
  console.log('✅ Cloudinary connected');
} catch (error) {
  console.warn('⚠️  Cloudinary connection failed (optional for article generation):', error.message);
}

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send('Server is Live!'));

// Test route (no auth required)
app.use('/test', testRouter);

app.use(requireAuth());

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error('Stack:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});