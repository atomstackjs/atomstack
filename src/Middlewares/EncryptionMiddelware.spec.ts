import { describe, expect, it, jest } from "@jest/globals";
import { ServiceBroker, Transporters } from "moleculer";
import { Socket } from "net";
import { decrypt, encrypt } from "../util/encryption.ts";
import { EncryptionMiddleware } from "./EncryptionMiddleware.ts";

jest.mock("../util/encryption");

describe("EncryptionMiddleware", () => {
  describe("Unit tests", () => {
    it("should encrypt data before sending", async () => {
      const encryptedData = Buffer.from("encrypted data");

      const next = jest.fn<Transporters.Base["send"]>().mockResolvedValue();
      (encrypt as jest.Mock<(data: Buffer) => Promise<Buffer>>).mockResolvedValue(encryptedData);
      const wrappedFunction = EncryptionMiddleware.transporterSend!(next);
      await wrappedFunction("test", Buffer.from("test"), {})

      expect(encrypt).toHaveBeenCalledWith(Buffer.from("test"))
      expect(next).toHaveBeenCalledWith("test", Buffer.from("encrypted data"), {})
    });

    it("should decrypt data after receiving", async () => {
      const decryptedData = Buffer.from("decrypted data");
      const next = jest.fn<Transporters.Base["receive"]>().mockResolvedValue(undefined as never);
      (decrypt as jest.Mock<(data: Buffer) => Promise<Buffer>>).mockResolvedValue(decryptedData);
      const wrappedFunction = EncryptionMiddleware.transporterReceive!(next);
      const buffer = Buffer.from("encrypted data");
      const socket = new Socket();

      await wrappedFunction("test", buffer, socket);

      expect(decrypt).toHaveBeenCalledWith(buffer);
      expect(next).toHaveBeenCalledWith("test", decryptedData, socket);
    });

    it("should log an error if decryption fails", async () => {
      const mockBroker = new ServiceBroker({ logger: false });
      const next = jest.fn<Transporters.Base["receive"]>().mockResolvedValue(undefined as never);
      const error = new Error("decryption error");
      (decrypt as jest.Mock<(data: Buffer) => Promise<Buffer>>).mockRejectedValue(error);
      const wrappedFunction = EncryptionMiddleware.transporterReceive!(next).bind({ broker: mockBroker });
      const spy = jest.spyOn(mockBroker.logger, "error");
      const buffer = Buffer.from("encrypted data");
      const socket = new Socket();

      await wrappedFunction("test", buffer, socket);
      expect(spy).toHaveBeenCalledWith(error);
      expect(next).not.toHaveBeenCalled();
      expect(decrypt).toHaveBeenCalled();
    });
  });
})
