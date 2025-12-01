# 🔍 How to Find the Exact Error - Step by Step

## ⚠️ IMPORTANT: Check Your Server Console!

The browser error **"500 Internal Server Error"** doesn't tell us what's wrong. 

**The REAL error message is in your SERVER CONSOLE!**

---

## 📋 Step-by-Step Instructions

### Step 1: Open Your Server Terminal

1. Look for the terminal window where you ran `npm run server`
2. If you can't find it:
   - Open a **NEW terminal window**
   - Type: `cd server`
   - Type: `npm run server`

### Step 2: Keep Server Console Visible

- **Position your windows so you can see BOTH:**
  - Your browser (where you'll trigger the error)
  - Your server terminal (where the error message will appear)

### Step 3: Trigger the Error

1. In your browser, go to: `http://localhost:5173/ai/write-article`
2. Fill in the form (enter a topic, select length)
3. Click **"Generate Article"**
4. **IMMEDIATELY look at your SERVER CONSOLE**

### Step 4: Look for These Messages

In your server console, you should see logs like this:

```
gen article recieved
User authenticated: user_xxxxx
Plan: free Free usage: 0
Calling Gemini API...
```

**Then ONE of these will happen:**

#### ✅ Success Path:
```
Gemini API response received
Inserting into database...
Database insert successful
User metadata updated
response sent
```

#### ❌ Error Path:
```
Error generating article: [THE ACTUAL ERROR HERE]
Error stack: [Stack trace]
Error name: [Error type]
Error message: [Error details]
```

---

## 🎯 Common Errors & Fixes

### Error 1: "relation 'creations' does not exist"

**Meaning:** Database table doesn't exist

**Fix:**
1. Go to Neon dashboard
2. SQL Editor → Run this:

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

3. Restart server

---

### Error 2: "Connection refused" or "Connection timeout"

**Meaning:** Can't connect to database

**Fix:**
1. Check `DATABASE_URL` in `server/.env`
2. Make sure it's the full connection string from Neon
3. Restart server

---

### Error 3: "Invalid API key" or Gemini errors

**Meaning:** Gemini API key is wrong

**Fix:**
1. Check `GEMINI_API_KEY` in `server/.env`
2. Verify key in Google AI Studio
3. Restart server

---

### Error 4: "Auth middleware error" or "Unauthorized"

**Meaning:** Authentication failed

**Fix:**
1. Check `CLERK_SECRET_KEY` in `server/.env`
2. Make sure you're logged in on the client
3. Restart server

---

### Error 5: "User ID not found in request"

**Meaning:** Authentication didn't work

**Fix:**
1. Check Clerk keys are correct
2. Make sure you're signed in
3. Check server console for auth errors

---

## 🧪 Quick Diagnostic Test

### Test 1: Check Environment Variables

Visit: `http://localhost:3000/test/health`

This shows:
- ✅ Which env vars are set
- ✅ Database connection status

### Test 2: Check Server Startup

When you run `npm run server`, you should see:

```
✅ All required environment variables are set
✅ Cloudinary connected
Server is running on port 3000
```

**If you see errors here, fix them first!**

---

## 📸 What to Do Next

1. ✅ **Follow Steps 1-4 above**
2. ✅ **Copy the EXACT error message** from server console
3. ✅ **Share it with me** - then I can tell you exactly how to fix it!

---

## 💡 Pro Tip

The server console will show you **EXACTLY** which step failed:

- If you see `"gen article recieved"` but then an error → Request reached server
- If you DON'T see `"gen article recieved"` → Request didn't reach server (proxy/auth issue)
- If you see `"Calling Gemini API..."` but then error → Gemini API issue
- If you see `"Inserting into database..."` but then error → Database issue

**The error message will tell you exactly what to fix!** 🎯


