# How to Check Server Errors - IMPORTANT!

## ⚠️ Critical: Check Your Server Console

The browser console error **"500 Internal Server Error"** only tells you the request failed. 

**The ACTUAL error message is in your SERVER console!**

## Step-by-Step Debugging

### Step 1: Find Your Server Terminal

1. Look for the terminal window where you ran `npm run server`
2. If you can't find it:
   - Open a new terminal
   - Navigate to the server folder: `cd server`
   - Run: `npm run server`

### Step 2: Watch the Server Console

1. **Keep the server console visible**
2. Try to generate an article in your browser
3. **Immediately look at the server console**

### Step 3: Look for Error Messages

You should see one of these patterns:

#### ✅ If request reaches controller:
```
gen article recieved
User authenticated: user_xxxxx
Plan: free Free usage: 0
Calling Gemini API...
```

#### ❌ If there's an error, you'll see:
```
Error generating article: [ACTUAL ERROR MESSAGE HERE]
Error stack: [Stack trace]
```

OR

```
Auth middleware error: [ERROR MESSAGE]
```

OR

```
Database connection error: [ERROR MESSAGE]
```

### Step 4: Common Error Messages & Fixes

#### Error: "relation 'creations' does not exist"
**Problem:** Database table not created  
**Fix:** Run the SQL in DATABASE_SETUP.md to create the table

#### Error: "Connection refused" or "Connection timeout"
**Problem:** Database URL is wrong or database is not accessible  
**Fix:** Check your DATABASE_URL in server/.env

#### Error: "Invalid API key" or Gemini API errors
**Problem:** GEMINI_API_KEY is wrong  
**Fix:** Check your key in Google AI Studio

#### Error: "Unauthorized" or Clerk errors
**Problem:** CLERK_SECRET_KEY is wrong or user not authenticated  
**Fix:** Check your Clerk keys and make sure you're logged in

#### Error: "Cannot read property 'auth' of undefined"
**Problem:** req.auth() is not available  
**Fix:** Make sure CLERK_SECRET_KEY is set correctly

### Step 5: Copy the Exact Error

When you see an error in the server console:
1. **Copy the ENTIRE error message**
2. **Copy the stack trace**
3. Share it so I can help you fix it

## Quick Test

1. Open your browser
2. Go to: `http://localhost:3000/test/health`
3. What response do you get?

This will tell us if:
- Environment variables are set
- Database connection works

## What I Need From You

Please share:
1. **The EXACT error message** from your server console (not browser console)
2. **What you see** when you visit `http://localhost:3000/test/health`
3. **Any error messages** when you start the server

The server console has the answers! 🔍


