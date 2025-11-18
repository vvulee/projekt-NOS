import crypto from 'crypto';

export interface Keys {
  publicKey: string;
  privateKey: string;
  symmetricKey: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export function generateKeys(): Keys {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  const symmetricKey = crypto.randomBytes(32).toString('hex');

  return { publicKey, privateKey, symmetricKey };
}

export function generateSymmetricKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function encryptSymmetric(data: string, key: Buffer | string): string {
  const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'hex') : key;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

export function decryptSymmetric(encrypted: string, key: Buffer | string): string {
  const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'hex') : key;
  const parts = encrypted.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedData = parts[1];

  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export function generateKeyPair(): KeyPair {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  return { publicKey, privateKey };
}

export function encryptAsymmetric(data: string, publicKey: string): string {
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    Buffer.from(data, 'utf8')
  );

  return encrypted.toString('base64');
}

export function decryptAsymmetric(encryptedData: string, privateKey: string): string {
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    Buffer.from(encryptedData, 'base64')
  );

  return decrypted.toString('utf8');
}

export function encryptHybrid(data: string, publicKey: string): string {
  const aesKey = crypto.randomBytes(32);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  const encryptedKey = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    aesKey
  ).toString('base64');

  return `${encryptedKey}:${iv.toString('hex')}:${encryptedData}`;
}

export function decryptHybrid(encrypted: string, privateKey: string): string {
  const parts = encrypted.split(':');
  const encryptedKey = parts[0];
  const iv = Buffer.from(parts[1], 'hex');
  const encryptedData = parts[2];

  const aesKey = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    Buffer.from(encryptedKey, 'base64')
  );

  const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export function signData(data: string, privateKey: string): string {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(data);
  sign.end();

  const signature = sign.sign(privateKey);
  return signature.toString('base64');
}

export function verifySignature(data: string, signature: string, publicKey: string): boolean {
  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(data);
  verify.end();

  return verify.verify(publicKey, Buffer.from(signature, 'base64'));
}

export function calculateHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function hashData(data: string, algorithm: 'sha256' | 'sha512' | 'md5' = 'sha256'): string {
  return crypto.createHash(algorithm).update(data).digest('hex');
}
