QuickAI is an AI powered platform that combines powerful AI tools with a social space for collaboration and creativity. Users can:

🖼️ Generate images using AI

✍️ Create articles and catchy blog titles

🎨 Edit images (remove backgrounds or unwanted objects)

📄 Get AI-powered resume reviews with actionable feedback

🌐 Join a community to share, explore, and get inspired by AI-generated images

## Setup Instructions

### Environment Variables

#### Client Setup (`client/.env`)
Create a `.env` file in the `client` directory with the following:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

#### Server Setup (`server/.env`)
Create a `.env` file in the `server` directory with the following:

```env
CLERK_SECRET_KEY=sk_test_your_secret_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
DATABASE_URL=your_database_url_here
GEMINI_API_KEY=your_gemini_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIPDROP_API_KEY=your_clipdrop_api_key_here
PORT=3000
```

**Note:** Both `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY` are required on the server side for Clerk Express middleware to work properly.

**Required for article generation:**
- `GEMINI_API_KEY` - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

**Required for database:**
- `DATABASE_URL` - See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed setup instructions

**Required for image generation (premium feature):**
- `CLIPDROP_API_KEY` - Get from [Clipdrop API](https://clipdrop.co/apis)

### Getting Clerk Keys

1. Sign up at [https://clerk.com](https://clerk.com)
2. Create a new application
3. Go to **API Keys** in your Clerk dashboard
4. Copy your **Publishable Key** to:
   - `client/.env` as `VITE_CLERK_PUBLISHABLE_KEY`
   - `server/.env` as `CLERK_PUBLISHABLE_KEY`
5. Copy your **Secret Key** to `server/.env` as `CLERK_SECRET_KEY`

**Important:** The publishable key is needed in BOTH client and server `.env` files!

### Setting Up Database

📖 **See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for complete database setup guide**

Quick steps:
1. Create a free Neon database at [neon.tech](https://neon.tech)
2. Copy the connection string to `server/.env` as `DATABASE_URL`
3. Create the `creations` table using the SQL in the guide

### Installation

1. Install server dependencies:
```bash
cd server
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
```

### Running the Application

1. Start the server:
```bash
cd server
npm run server
```

2. Start the client (in a new terminal):
```bash
cd client
npm run dev
```

## Troubleshooting

### 500 Internal Server Error

If you encounter a 500 error when making API requests, check the following:

1. **Check Server Console Logs**: Look at your server terminal for detailed error messages
2. **Verify Environment Variables**: Ensure all required environment variables are set in `server/.env`:
   - `CLERK_SECRET_KEY` - Required for authentication
   - `DATABASE_URL` - Required for database operations
   - `GEMINI_API_KEY` - Required for article generation (get from [Google AI Studio](https://makersuite.google.com/app/apikey))
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Required for image uploads

3. **Check Database Connection**: Ensure your `DATABASE_URL` is correct and the database is accessible

4. **Restart Server**: After adding/updating environment variables, restart your server:
   ```bash
   cd server
   npm run server
   ```

### Common Error Messages

- **"Missing Publishable Key"**: Add `VITE_CLERK_PUBLISHABLE_KEY` to `client/.env`
- **404 Not Found**: Ensure the proxy is configured in `client/vite.config.js` and the server is running
- **500 Internal Server Error**: Check server logs and environment variables

