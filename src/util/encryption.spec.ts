import { encrypt, decrypt } from "./encryption.ts";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

describe("Encryption Utility", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clears the cache
    process.env = { ...originalEnv }; // Make a copy of the original environment variables
    process.env.ATOMSTACK_ENCRYPTION_KEY = "testkey";
  });

  afterEach(() => {
    process.env = originalEnv; // Restore the original environment variables
  });

  describe("encrypt", () => {
    it("should throw an error if the encryption key is not set", async () => {
      delete process.env.ATOMSTACK_ENCRYPTION_KEY;
      try {
        await encrypt(Buffer.from("test"))
      } catch (e: unknown) {
        expect((e as Error).message).toEqual("ATOMSTACK_ENCRYPTION_KEY environment variable is not set")
      }
    });

    it("should encrypt a string deterministically", async () => {
      const value = Buffer.from("test");
      const encryptedValue = await encrypt(value, true);
      expect(encryptedValue).toBeInstanceOf(Buffer);
      expect(encryptedValue.toString()).toMatch(/^[a-f0-9]+:[a-f0-9]+$/);
    });

    it("should encrypt a string non-deterministically", async () => {
      const value = Buffer.from("test")
      const encryptedValue = await encrypt(value, false);
      expect(encryptedValue).toBeInstanceOf(Buffer);
      expect(encryptedValue.toString()).toMatch(/^[a-f0-9]+:[a-f0-9]+:[a-f0-9]+$/);
    });
  });

  describe("decrypt", () => {
    it("should decrypt a deterministically encrypted string", async () => {
      const value = Buffer.from("test")
      const encryptedValue = await encrypt(value, true);
      const decryptedValue = await decrypt(encryptedValue, true);
      expect(decryptedValue.toString()).toBe(value.toString());
    });

    it("should decrypt a non-deterministically encrypted string", async () => {
      const value = Buffer.from("test")
      const encryptedValue = await encrypt(value, false);
      const decryptedValue = await decrypt(encryptedValue, false);
      expect(decryptedValue.toString()).toBe(value.toString());
    });
  });
});
