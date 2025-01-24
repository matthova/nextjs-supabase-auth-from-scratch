const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const ITERATIONS = 100000;
const ALGORITHM = { name: "AES-GCM", length: 256 };

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function deriveKey(salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.HEADER_ENCODE_SECRET),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    ALGORITHM,
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(plaintext: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext)
  );

  const concatenated = new Uint8Array(
    salt.length + iv.length + encrypted.byteLength
  );
  concatenated.set(salt, 0);
  concatenated.set(iv, salt.length);
  concatenated.set(new Uint8Array(encrypted), salt.length + iv.length);

  return btoa(String.fromCharCode(...concatenated));
}

export async function decrypt(ciphertext: string): Promise<string> {
  const concatenated = new Uint8Array(
    atob(ciphertext)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  const salt = concatenated.slice(0, SALT_LENGTH);
  const iv = concatenated.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const encrypted = concatenated.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(salt);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  );

  return decoder.decode(decrypted);
}
