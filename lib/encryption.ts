import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}

// Ensure key is 32 bytes (256 bits) for AES-256
// ENCRYPTION_KEY should be a 64-character hex string (32 bytes)
let key: Buffer;
try {
  if (ENCRYPTION_KEY.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)');
  }
  key = Buffer.from(ENCRYPTION_KEY, 'hex');
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must represent exactly 32 bytes');
  }
} catch (error) {
  throw new Error(`Invalid ENCRYPTION_KEY: ${error instanceof Error ? error.message : 'Must be 64 hex characters'}`);
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Return iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedData: string): string {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  
  const [ivHex, authTagHex, encrypted] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

