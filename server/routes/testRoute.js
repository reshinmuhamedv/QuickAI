import express from 'express';
import sql from '../configs/db.js';

const testRouter = express.Router();

// Test endpoint to diagnose issues
testRouter.get('/health', async (req, res) => {
  try {
    const results = {
      env: {
        hasClerkKey: !!process.env.CLERK_SECRET_KEY,
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlPreview: process.env.DATABASE_URL ? 
          process.env.DATABASE_URL.substring(0, 20) + '...' : 'missing'
      },
      database: null,
      error: null
    };

    // Test database connection
    try {
      await sql`SELECT 1 as test`;
      results.database = 'connected';
    } catch (dbError) {
      results.database = 'error';
      results.error = dbError.message;
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

export default testRouter;


