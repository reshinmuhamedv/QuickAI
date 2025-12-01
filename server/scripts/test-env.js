// Quick environment check script
import 'dotenv/config';

console.log('\n🔍 Environment Variables Check:\n');

const required = {
  'CLERK_SECRET_KEY': process.env.CLERK_SECRET_KEY,
  'GEMINI_API_KEY': process.env.GEMINI_API_KEY,
  'DATABASE_URL': process.env.DATABASE_URL
};

const optional = {
  'CLOUDINARY_CLOUD_NAME': process.env.CLOUDINARY_CLOUD_NAME,
  'CLOUDINARY_API_KEY': process.env.CLOUDINARY_API_KEY,
  'CLOUDINARY_API_SECRET': process.env.CLOUDINARY_API_SECRET,
  'PORT': process.env.PORT || '3000 (default)'
};

console.log('Required Variables:');
let allRequired = true;
for (const [key, value] of Object.entries(required)) {
  if (value) {
    console.log(`  ✅ ${key}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`  ❌ ${key}: MISSING`);
    allRequired = false;
  }
}

console.log('\nOptional Variables:');
for (const [key, value] of Object.entries(optional)) {
  if (value) {
    console.log(`  ✅ ${key}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`  ⚠️  ${key}: Not set`);
  }
}

console.log('\n');

if (!allRequired) {
  console.log('❌ Some required variables are missing!');
  console.log('Please add them to server/.env file\n');
  process.exit(1);
}

console.log('✅ All required environment variables are set!\n');

// Test database connection if DATABASE_URL exists
if (process.env.DATABASE_URL) {
  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    await sql`SELECT 1 as test`;
    console.log('✅ Database connection: OK\n');
  } catch (error) {
    console.log('❌ Database connection: FAILED');
    console.log(`   Error: ${error.message}\n`);
  }
}


