# Database Setup Guide

This project uses **PostgreSQL** database with Neon (serverless PostgreSQL). Here's how to set it up.

## Option 1: Using Neon Database (Recommended - Free & Easy)

Neon is a serverless PostgreSQL database that's perfect for this project.

### Step 1: Create a Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Click **"Sign Up"** (you can use GitHub, Google, or email)
3. Complete the signup process

### Step 2: Create a New Project

1. Once logged in, click **"Create Project"**
2. Give it a name (e.g., "QuickAI")
3. Select a region closest to you
4. Click **"Create Project"**

### Step 3: Get Your Connection String

1. After creating the project, you'll see the dashboard
2. Look for the **Connection String** section
3. You'll see a connection string that looks like:
   ```
   postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Click **"Copy"** to copy the connection string

### Step 4: Add to Your .env File

1. Open `server/.env` file (create it if it doesn't exist)
2. Add the connection string:
   ```env
   DATABASE_URL=postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
   ⚠️ **Replace with your actual connection string!**

### Step 5: Create the Database Table

You need to create the `creations` table. Here's how:

#### Method A: Using Neon SQL Editor (Easiest)

1. In your Neon dashboard, click on **"SQL Editor"** in the sidebar
2. Click **"New Query"**
3. Paste this SQL:

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

4. Click **"Run"** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
5. You should see "Success" message

#### Method B: Using Command Line (Alternative)

If you have `psql` installed:

```bash
psql "your_connection_string_here" -c "
CREATE TABLE IF NOT EXISTS creations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  published BOOLEAN DEFAULT false,
  likes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"
```

### Step 6: Verify the Table Was Created

In Neon SQL Editor, run:

```sql
SELECT * FROM creations;
```

You should see an empty table (no rows yet, but the table exists).

## Option 2: Using Local PostgreSQL

If you prefer to run PostgreSQL locally:

### Step 1: Install PostgreSQL

**Windows:**
- Download from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
- Or use Chocolatey: `choco install postgresql`

**Mac:**
- Use Homebrew: `brew install postgresql@14`
- Start service: `brew services start postgresql@14`

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE quickai;

# Exit
\q
```

### Step 3: Create Table

```bash
psql -U postgres -d quickai -c "
CREATE TABLE creations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  published BOOLEAN DEFAULT false,
  likes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"
```

### Step 4: Add to .env

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/quickai
```

Replace `your_password` with your PostgreSQL password.

## Option 3: Using Other Cloud Providers

### Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Create a project
3. Go to Settings > Database
4. Copy the connection string
5. Use the same SQL to create the table

### Railway
1. Go to [https://railway.app](https://railway.app)
2. Create a PostgreSQL database
3. Copy the connection string from the Variables tab
4. Use the same SQL to create the table

### Render
1. Go to [https://render.com](https://render.com)
2. Create a PostgreSQL database
3. Copy the connection string
4. Use the same SQL to create the table

## Database Schema

The `creations` table structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL (Primary Key) | Auto-incrementing ID |
| `user_id` | VARCHAR(255) | Clerk user ID |
| `prompt` | TEXT | User's input prompt |
| `content` | TEXT | Generated content (article, image URL, etc.) |
| `type` | VARCHAR(50) | Type: 'article', 'blog-title', 'image', 'resume-review' |
| `published` | BOOLEAN | Whether the creation is published to community |
| `likes` | TEXT[] | Array of user IDs who liked this |
| `created_at` | TIMESTAMP | When the creation was made |

## Troubleshooting

### Error: "relation 'creations' does not exist"
**Solution:** The table hasn't been created. Run the CREATE TABLE SQL statement.

### Error: "connection refused"
**Solution:** 
- Check your `DATABASE_URL` is correct
- Make sure the database server is running
- Check firewall settings if using cloud database

### Error: "password authentication failed"
**Solution:** 
- Check your database password is correct in the connection string
- Reset password if needed

### Connection String Format

The connection string should look like:
```
postgresql://username:password@host:port/database?sslmode=require
```

For Neon specifically:
```
postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
```

## Testing Your Database Connection

After setting up, test the connection by restarting your server:

```bash
cd server
npm run server
```

If the connection works, you should see:
```
✅ All required environment variables are set
✅ Cloudinary connected
Server is running on port 3000
```

If there's an error, check:
1. Is `DATABASE_URL` in your `server/.env` file?
2. Is the connection string correct?
3. Is the database server accessible?

## Next Steps

After setting up the database:

1. ✅ Verify `DATABASE_URL` is in `server/.env`
2. ✅ Create the `creations` table
3. ✅ Restart your server
4. ✅ Try generating an article

Your database is now ready! 🎉


