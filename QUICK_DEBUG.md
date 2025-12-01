# Quick Debug Guide - 500 Error Still Happening

## 🔍 Step 1: Check Your Server Console

**THIS IS THE MOST IMPORTANT STEP!**

Open the terminal where your server is running (`npm run server`). 

**When you try to generate an article, what error message do you see?**

Common errors you might see:

1. ❌ `"Error generating article: ..."`
   - Look at what comes after the colon - that's the actual problem

2. ❌ `"Auth middleware error: ..."`
   - Authentication issue

3. ❌ `"relation 'creations' does not exist"`
   - Database table not created

4. ❌ `"Connection refused"` or database errors
   - Database connection issue

5. ❌ `"Missing required environment variables"`
   - Environment variable not set

## 🧪 Step 2: Test Your Database Connection

I've added a test endpoint. Try this:

1. **Open your browser** and go to:
   ```
   http://localhost:3000/test/health
   ```

2. **Or use curl:**
   ```bash
   curl http://localhost:3000/test/health
   ```

This will show you:
- ✅ Which environment variables are set
- ✅ If database connection works
- ✅ Any error messages

**Share the response you get!**

## 🔍 Step 3: Check Server Startup Messages

When you start your server (`npm run server`), do you see:

```
✅ All required environment variables are set
✅ Cloudinary connected
Server is running on port 3000
```

**Or do you see errors?**

## 📋 Step 4: Verify Your .env File

Check your `server/.env` file exists and has:

```env
CLERK_SECRET_KEY=sk_test_xxxxx
GEMINI_API_KEY=your_key_here
DATABASE_URL=postgresql://...
```

**Important:**
- No quotes around values
- No spaces around `=`
- Each variable on its own line

## 🐛 Common Issues & Fixes

### Issue 1: "relation 'creations' does not exist"

**Fix:** Create the table. In Neon SQL Editor, run:

```sql
CREATE TABLE IF NOT EXISTS creations (
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

### Issue 2: Database Connection Error

**Fix:** 
1. Check your `DATABASE_URL` in `server/.env`
2. Make sure it's the full connection string from Neon
3. Should start with `postgresql://`
4. Restart server after changing

### Issue 3: "Cannot read property 'auth' of undefined"

**Fix:** 
- Check `CLERK_SECRET_KEY` is set correctly
- Make sure you're logged in on the client

### Issue 4: Gemini API Error

**Fix:**
- Check `GEMINI_API_KEY` is correct
- Verify the key is active in Google AI Studio

## 📸 What to Share

To help debug, please share:

1. **The exact error message** from your server console
2. **The response** from `http://localhost:3000/test/health`
3. **Your server startup messages** (what you see when running `npm run server`)

## 🚀 Quick Test

1. Restart your server:
   ```bash
   cd server
   npm run server
   ```

2. Check if it starts without errors

3. Visit: `http://localhost:3000/test/health`

4. Try generating an article

5. **Check the server console for the exact error**

The server console will tell us exactly what's wrong! 🔍


