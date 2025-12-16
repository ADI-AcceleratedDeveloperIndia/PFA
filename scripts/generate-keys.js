#!/usr/bin/env node

/**
 * Helper script to generate encryption keys for environment variables
 * Usage: node scripts/generate-keys.js
 */

const crypto = require('crypto');

console.log('🔐 Generating secure keys for PFA...\n');

// Generate JWT secret (32 bytes)
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('JWT_SECRET=' + jwtSecret);

// Generate encryption key (32 bytes hex for AES-256)
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('ENCRYPTION_KEY=' + encryptionKey);

console.log('\n✅ Copy these values to your .env file');
console.log('⚠️  Keep these keys secure and never commit them to version control!');

