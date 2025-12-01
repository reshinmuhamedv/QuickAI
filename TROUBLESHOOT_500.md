# Troubleshooting 500 Error - Step by Step

## 🔍 What to Check Right Now

### Step 1: Look at Your Server Console

**Open the terminal where your server is running** (`npm run server`). You should see error messages there.

**After you try to generate an article, look for:**

1. **"gen article received"** - This means the request reached the controller ✅
2. **Then look for one of these errors:**

### Common Error Messages:

#### ❌ "Missing required environment variables"
**Solution:** Check your `server/.env` file has:
- `CLERK_SECRET_KEY`
- `GEMINI_API_KEY` 
- `DATABASE_URL` ← **MOST LIKELY MISSING!**

#### ❌ "relation 'creations' does not exist" or "table does not exist"
**Problem:** Database table is missing
**Solution:** Create the `creations` table (see below)

#### ❌ "Connection refused" or database errors
**Problem:** Invalid `DATABASE_URL`
**Solution:** Check your database connection string

#### ❌ "Auth middleware error: ..."
**Problem:** Clerk authentication issue
**Solution:** Verify `CLERK_SECRET_KEY` is correct

#### ❌ "Error generating article: ..."
**Problem:** Something failed in the controller
**Solution:** Check the specific error message

## 🛠️ Quick Fixes

### Fix 1: Add DATABASE_URL

If you see database-related errors, add this to `server/.env`:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

**If you don't have a database yet:**

1. **Use Neon (Free PostgreSQL):**
   - Go to https://neon.tech
   - Sign up and create a database
   - Copy the connection string
   - Add to `server/.env` as `DATABASE_URL`

2. **Or use a local PostgreSQL database**

### Fix 2: Create the Database Table

If you see "table does not exist", run this SQL in your database:

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

### Fix 3: Restart Server

After adding/changing environment variables:
```bash
# Stop server (Ctrl+C)
cd server
npm run server
```

## 📋 Your Complete server/.env Should Have:

```env
# Required
CLERK_SECRET_KEY=sk_test_xxxxx
GEMINI_API_KEY=your_gemini_key
DATABASE_URL=postgresql://...

# Optional (for image features)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional
PORT=3000
```

## 🎯 Most Likely Issue Right Now

**90% chance it's:** `DATABASE_URL` is missing

The code tries to INSERT into the database (line 39 in aiController.js), and if `DATABASE_URL` is missing or invalid, it will fail with a 500 error.

## 🔎 How to Diagnose

1. **Check your server console** - What error do you see?
2. **Check your server/.env file** - Do you have `DATABASE_URL`?
3. **Try the request again** - With better logging, you'll see exactly where it fails

## 📝 Next Steps

1. ✅ Check server console for error message
2. ✅ Verify `DATABASE_URL` in `server/.env`
3. ✅ Create database table if missing
4. ✅ Restart server
5. ✅ Try again

**Share the error message from your server console and I can help you fix it specifically!**

