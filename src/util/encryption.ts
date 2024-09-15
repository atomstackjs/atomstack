import crypto from "crypto";

/**
 * Encrypts a string using AES-256-GCM encryption algorithm.
 *
 * @param value - The string to be encrypted.
 * @param [deterministic=false] - Indicates whether the encryption should be deterministic.
 *
 * The function uses the `ENCRYPTION_KEY` environment variable to generate a secret key.
 * For deterministic encryption, a fixed initialization vector (IV) is used.
 * For non-deterministic encryption, a random IV is generated.
 *
 * Example usage:
 * ```typescript
 * const encryptedValue = await encrypt("mySecretValue");
 * ```
 */
export function encrypt(value: Buffer, deterministic: boolean = false) {
  if (!process.env.ATOMSTACK_ENCRYPTION_KEY) {
    throw new Error("ATOMSTACK_ENCRYPTION_KEY environment variable is not set");
  }

  const secret = crypto.createHash("sha256").update(process.env.ATOMSTACK_ENCRYPTION_KEY).digest();
  let iv;

  if (deterministic) {
    iv = Buffer.alloc(16, 0);
  } else {
    iv = crypto.randomBytes(16);
  }

  const cipher = crypto.createCipheriv("aes-256-gcm", secret, iv);
  const encryptedValue = cipher.update(value.toString(), "utf8", "hex") + cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  let final;

  if (deterministic) {
    final = `${authTag}:${encryptedValue}`;
  } else {
    final = `${iv.toString("hex")}:${authTag}:${encryptedValue}`;
  }

  return Promise.resolve(Buffer.from(final));
}

/**
 * Decrypts an encrypted string using AES-256-GCM encryption algorithm.
 *
 * @param value - The encrypted string to be decrypted.
 * @param [deterministic=false] - Indicates whether the encryption was deterministic.
 *
 * The function uses the `ENCRYPTION_KEY` environment variable to generate a secret key.
 * For deterministic encryption, a fixed initialization vector (IV) is used.
 * For non-deterministic encryption, the IV is extracted from the encrypted string.
 *
 * Example usage:
 * ```typescript
 * const decryptedValue = await decrypt(encryptedValue);
 * ```
 */
export function decrypt(value: Buffer, deterministic = false) {
  const secret = crypto.createHash("sha256").update(process.env.ATOMSTACK_ENCRYPTION_KEY!).digest();
  let authTag;
  let iv;
  let encryptedValue;

  if (deterministic) {
    [authTag, encryptedValue] = value.toString().split(":");

    iv = Buffer.alloc(16, 0).toString("hex");
  } else {
    [iv, authTag, encryptedValue] = value.toString().split(":");
  }
  const decipher = crypto.createDecipheriv("aes-256-gcm", secret, Buffer.from(iv, "hex"));
  decipher.setAuthTag(Buffer.from(authTag, "hex"));
  const decryptedValue = decipher.update(encryptedValue, "hex", "utf8") + decipher.final("utf8");

  return Promise.resolve(Buffer.from(decryptedValue));
}
