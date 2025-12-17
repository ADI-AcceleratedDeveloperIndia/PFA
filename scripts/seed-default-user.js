#!/usr/bin/env node

/**
 * Seed script to create a default user
 * Usage: node scripts/seed-default-user.js
 * 
 * Make sure MONGODB_URI is set in environment or .env file
 */

// Try to load .env if available
try {
  require('dotenv').config({ path: '.env' });
} catch (e) {
  // dotenv not available, use environment variables directly
}

const mongoose = require('mongoose');

// Import User model
const UserSchema = require('mongoose').Schema;
const bcrypt = require('bcryptjs');

const userSchema = new UserSchema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(String(this.password), salt);
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

  const DEFAULT_EMAIL = 'demo@pfa.com';
  const DEFAULT_PASSWORD = '9FAdem@';

async function seedUser() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: DEFAULT_EMAIL });
    if (existingUser) {
      console.log(`✅ Default user already exists: ${DEFAULT_EMAIL}`);
      console.log('📝 You can login with:');
      console.log(`   Email: ${DEFAULT_EMAIL}`);
      console.log(`   Password: ${DEFAULT_PASSWORD}`);
      await mongoose.disconnect();
      return;
    }

    // Create default user
    console.log('👤 Creating default user...');
    const user = await User.create({
      email: DEFAULT_EMAIL,
      password: DEFAULT_PASSWORD,
    });

    console.log('✅ Default user created successfully!');
    console.log('');
    console.log('📝 Login Credentials:');
    console.log(`   Email: ${DEFAULT_EMAIL}`);
    console.log(`   Password: ${DEFAULT_PASSWORD}`);
    console.log('');
    console.log('🚀 You can now login to the app!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating default user:', error);
    process.exit(1);
  }
}

seedUser();

