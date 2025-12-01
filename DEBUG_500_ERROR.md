# Debugging Guide: 500 Internal Server Error

## Error Breakdown

**Error Message:**
```
POST http://localhost:5173/api/ai/generate-article 500 (Internal Server Error)
```

### What This Means

1. ✅ **Request reached the server** - The proxy is working (not a 404)
2. ✅ **Server received the request** - Routing is correct
3. ❌ **Server encountered an error** - Something failed during processing

## Request Flow

```
Client (localhost:5173) 
  → Vite Proxy (/api/*)
  → Backend Server (localhost:3000)
  → Clerk Middleware (authentication)
  → Auth Middleware (custom auth logic)
  → AI Controller (generateArticle function)
  → [FAILURE POINT HERE]
```

## Possible Failure Points

### 1. **Missing Environment Variables** ⚠️ MOST LIKELY

Check your `server/.env` file has ALL of these:

```env
# Required for authentication
CLERK_SECRET_KEY=sk_test_xxxxx

# Required for AI article generation
GEMINI_API_KEY=your_gemini_api_key

# Required for database operations
DATABASE_URL=postgresql://...

# Required for Cloudinary (image features)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server port (optional, defaults to 3000)
PORT=3000
```

**If any are missing, the server will crash with a 500 error.**

### 2. **Clerk Authentication Issues**

- Missing `CLERK_SECRET_KEY` → Clerk middleware fails
- Invalid token from client → Authentication fails
- **Check:** Server console for "Auth middleware error"

### 3. **Database Connection Issues**

- Missing `DATABASE_URL` → Database queries fail
- Invalid database URL → Connection fails
- Database table doesn't exist → INSERT fails
- **Check:** Server console for database errors

### 4. **Gemini API Issues**

- Missing `GEMINI_API_KEY` → OpenAI client fails to initialize
- Invalid API key → API request fails
- **Check:** Server console for "Error generating article"

### 5. **Code Errors**

- Unhandled exceptions in controller
- Missing await on async functions (we fixed this)
- **Check:** Server console stack trace

## Step-by-Step Debugging

### Step 1: Check Server Console Logs

**Look at your server terminal** where you ran `npm run server`. You should see:

```
gen article recieved  ← This confirms the request reached the controller
```

**Then look for error messages like:**
- `Error generating article: [error message]`
- `Auth middleware error: [error message]`
- Database connection errors
- Environment variable errors

### Step 2: Verify Environment Variables

1. Open `server/.env` file
2. Verify each required variable exists
3. Make sure there are no typos
4. Ensure no extra spaces or quotes around values

**Test:** Add this to your `server/server.js` temporarily to check:
```javascript
console.log('Env check:', {
  hasClerkKey: !!process.env.CLERK_SECRET_KEY,
  hasGeminiKey: !!process.env.GEMINI_API_KEY,
  hasDbUrl: !!process.env.DATABASE_URL
});
```

### Step 3: Test Each Component Individually

#### Test 1: Is the server running?
```bash
curl http://localhost:3000/
```
Should return: `Server is Live!`

#### Test 2: Is Clerk working?
Check if you can see the sign-in page. If not, `CLERK_SECRET_KEY` might be wrong.

#### Test 3: Check database connection
Look for database errors in server logs when the app starts.

### Step 4: Check the Exact Error

The server console will show the exact error. Common ones:

1. **"Missing GEMINI_API_KEY"**
   - Solution: Add `GEMINI_API_KEY` to `server/.env`

2. **"Cannot read property 'auth' of undefined"**
   - Solution: Check `CLERK_SECRET_KEY` is set

3. **"relation 'creations' does not exist"**
   - Solution: Database table not created. Need to create the `creations` table.

4. **"Connection refused" or database errors**
   - Solution: Check `DATABASE_URL` is correct

## Quick Fixes

### Fix 1: Add Missing Environment Variables

Create or update `server/.env`:
```env
CLERK_SECRET_KEY=sk_test_your_key_here
GEMINI_API_KEY=your_gemini_key_here
DATABASE_URL=your_database_url_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
```

### Fix 2: Get Your API Keys

**Gemini API Key:**
1. Visit: https://makersuite.google.com/app/apikey
2. Create an API key
3. Copy it to `server/.env` as `GEMINI_API_KEY`

**Clerk Secret Key:**
1. Go to: https://dashboard.clerk.com
2. Select your application
3. Go to API Keys
4. Copy the Secret Key to `server/.env`

**Database URL:**
- If using Neon: Get connection string from Neon dashboard
- Format: `postgresql://user:password@host/database`

### Fix 3: Restart the Server

After adding environment variables:
```bash
# Stop server (Ctrl+C)
cd server
npm run server
```

### Fix 4: Create Database Table (if missing)

If you see "relation 'creations' does not exist", create the table:

```sql
CREATE TABLE creations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  published BOOLEAN DEFAULT false,
  likes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Most Common Solution

**90% of the time**, the 500 error is caused by:

1. **Missing `GEMINI_API_KEY`** in `server/.env`
   - Add it: `GEMINI_API_KEY=your_actual_key_here`
   - Restart server

2. **Missing `CLERK_SECRET_KEY`** in `server/.env`
   - Add it: `CLERK_SECRET_KEY=sk_test_...`
   - Restart server

3. **Missing `DATABASE_URL`** in `server/.env`
   - Add your database connection string
   - Restart server

## Next Steps

1. ✅ Check server console for the exact error message
2. ✅ Verify all environment variables are set
3. ✅ Restart the server after adding variables
4. ✅ Try the request again
5. ✅ If still failing, check the specific error in server logs

## Getting Help

When asking for help, provide:
1. The exact error message from server console
2. Which environment variables you have set (without values)
3. Any stack trace from the server logs

