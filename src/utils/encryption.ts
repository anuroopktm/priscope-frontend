const ALGO = "AES-GCM";
const IV_LENGTH = 12;

const base64ToBytes = (base64: string) =>
  Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

const bytesToBase64 = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes));

export const encryptData = async (payload: object) => {
  const keyBase64 = import.meta.env.VITE_ENCRYPTION_KEY;

  if (!keyBase64) {
    throw new Error("VITE_ENCRYPTION_KEY not set");
  }

  const keyBytes = base64ToBytes(keyBase64);
  if (keyBytes.length !== 32) {
    throw new Error("Encryption key must be 32 bytes");
  }

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    ALGO,
    false,
    ["encrypt"],
  );

  const nonce = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: ALGO, iv: nonce },
    cryptoKey,
    new TextEncoder().encode(JSON.stringify(payload)),
  );

  return {
    encrypted: bytesToBase64(new Uint8Array(encryptedBuffer)),
    nonce: bytesToBase64(nonce),
  };
};
