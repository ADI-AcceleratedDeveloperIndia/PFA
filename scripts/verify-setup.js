#!/usr/bin/env node

/**
 * Verify that all required environment variables are set
 * Usage: node scripts/verify-setup.js
 * 
 * Note: This checks process.env which should be set by:
 * - .env file (via dotenv if installed)
 * - System environment variables
 * - Vercel environment variables (in production)
 */

// Try to load .env file if dotenv is available (optional)
try {
  require('dotenv').config({ path: '.env' });
} catch (e) {
  // dotenv not installed, rely on system/env vars
}

const requiredVars = [
  'MONGODB_URI',
  'PLAID_CLIENT_ID',
  'PLAID_SECRET',
  'PLAID_ENV',
  'JWT_SECRET',
  'ENCRYPTION_KEY',
  'NEXT_PUBLIC_APP_URL',
];

const optionalVars = [
  'GOOGLE_PLACES_API_KEY',
];

console.log('🔍 Verifying PFA setup...\n');

let allGood = true;

// Check required variables
console.log('Required Environment Variables:');
requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`  ❌ ${varName} - MISSING`);
    allGood = false;
  } else if (varName === 'ENCRYPTION_KEY' && value.length !== 64) {
    console.log(`  ❌ ${varName} - Invalid (must be 64 hex characters, got ${value.length})`);
    allGood = false;
  } else if (varName === 'PLAID_ENV' && !['sandbox', 'development', 'production'].includes(value)) {
    console.log(`  ⚠️  ${varName} - Should be 'sandbox', 'development', or 'production'`);
  } else {
    // Mask sensitive values
    const displayValue = varName.includes('SECRET') || varName.includes('KEY') || varName.includes('PASSWORD')
      ? '*'.repeat(Math.min(value.length, 20))
      : value;
    console.log(`  ✅ ${varName} - ${displayValue}`);
  }
});

// Check optional variables
console.log('\nOptional Environment Variables:');
optionalVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName} - Set`);
  } else {
    console.log(`  ⚪ ${varName} - Not set (optional)`);
  }
});

// Validation checks
console.log('\nValidation:');

// Check encryption key format
const encryptionKey = process.env.ENCRYPTION_KEY;
if (encryptionKey) {
  if (encryptionKey.length !== 64) {
    console.log('  ❌ ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)');
    console.log('     Run: node scripts/generate-keys.js');
    allGood = false;
  } else if (!/^[0-9a-fA-F]{64}$/.test(encryptionKey)) {
    console.log('  ❌ ENCRYPTION_KEY must be hexadecimal (0-9, a-f)');
    allGood = false;
  } else {
    console.log('  ✅ ENCRYPTION_KEY format is valid');
  }
}

// Check MongoDB URI format
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.log('  ⚠️  MONGODB_URI should start with mongodb:// or mongodb+srv://');
  } else {
    console.log('  ✅ MONGODB_URI format looks correct');
  }
}

// Check Plaid environment
const plaidEnv = process.env.PLAID_ENV;
if (plaidEnv) {
  if (!['sandbox', 'development', 'production'].includes(plaidEnv)) {
    console.log('  ⚠️  PLAID_ENV should be "sandbox", "development", or "production"');
  } else {
    console.log(`  ✅ PLAID_ENV is set to "${plaidEnv}"`);
  }
}

// Check app URL
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
if (appUrl) {
  if (!appUrl.startsWith('http://') && !appUrl.startsWith('https://')) {
    console.log('  ⚠️  NEXT_PUBLIC_APP_URL should start with http:// or https://');
  } else {
    console.log(`  ✅ NEXT_PUBLIC_APP_URL is set to ${appUrl}`);
  }
}

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('✅ All required environment variables are set!');
  console.log('🚀 You can now run: npm run dev');
} else {
  console.log('❌ Some required environment variables are missing or invalid.');
  console.log('📝 Please check your .env file and fix the issues above.');
  process.exit(1);
}

