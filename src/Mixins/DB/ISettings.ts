import { ServiceSettingSchema } from "moleculer";

export interface ISettings extends ServiceSettingSchema {
  /**
   * Fields that should be encrypted using a random encryption algorithm
   */
  encryptedFields?: string[];

  /**
   * Fields that should be encrypted using a deterministic encryption algorithm
   */
  deterministicEncryptedFields?: string[];

  /**
   * Fields that should be encrypted using one way bcrypt encryption
   */
  hashedFields?: string[];
}
