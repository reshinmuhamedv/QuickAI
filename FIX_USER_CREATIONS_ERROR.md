# Fix: 500 Error on /api/user/get-user-creations

## Error Explanation

This error occurs when trying to load user creations (on the Dashboard page). The endpoint queries the database for creations, but it's failing.

## Most Likely Causes

### 1. Database Table Doesn't Exist ❌ **MOST LIKELY**

**Error in server console:** `"relation 'creations' does not exist"`

**Fix:** Create the database table!

### 2. Database Connection Issue

**Error in server console:** Connection errors

**Fix:** Check your `DATABASE_URL` in `server/.env`

## Quick Fix: Create the Database Table

### Step 1: Go to Neon Dashboard

1. Open [https://console.neon.tech](https://console.neon.tech)
2. Select your project
3. Click **"SQL Editor"** in the sidebar

### Step 2: Run This SQL

Paste this into the SQL Editor and click **"Run"**:

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

### Step 3: Verify It Was Created

Run this query to verify:

```sql
SELECT * FROM creations;
```

You should see an empty table (that's fine - it just means the table exists).

### Step 4: Restart Your Server

```bash
# Stop server (Ctrl+C)
cd server
npm run server
```

### Step 5: Try Again

Go back to your app and refresh the Dashboard page. The error should be gone!

## Check Your Server Console

When you load the Dashboard, check your server console for:

- ✅ `"Fetching creations for user: user_xxxxx"` - Request received
- ✅ `"Found 0 creations"` - Success (no creations yet, but it worked!)

OR

- ❌ `"Error getting user creations: ..."` - An error occurred

## What I Fixed

1. ✅ Updated controller to use `req.userId` (set by auth middleware)
2. ✅ Added better error logging
3. ✅ Improved error handling with proper status codes

## Still Getting Errors?

**Check your server console** and look for:
- The exact error message
- Which step is failing

Common errors:
- **"relation 'creations' does not exist"** → Create the table (see above)
- **"Connection refused"** → Check DATABASE_URL
- **"User ID not found"** → Authentication issue, check Clerk keys

The table creation is the #1 fix for this error! 🎯

