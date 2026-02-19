import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12;

export function encryptData(body: object) {
  if (!process.env.NEXT_PUBLIC_ENCRYPTION_KEY) {
    throw new Error("NEXT_PUBLIC_ENCRYPTION_KEY not set");
  }

  const key = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY, "base64");
  if (key.length !== 32) {
    throw new Error("Encryption key must be 32 bytes after base64 decoding");
  }

  const nonce = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGO, key, nonce);

  const jsonData = JSON.stringify(body);
  let encrypted = cipher.update(jsonData, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const authTag = cipher.getAuthTag();
  const encryptedWithTag = Buffer.concat([encrypted, authTag]);

  return {
    encrypted: encryptedWithTag.toString("base64"),
    nonce: nonce.toString("base64"),
  };
}
