import {Context, Service} from "moleculer";
import {ISettings} from "./ISettings.ts";

export interface IService<TPrismaClient = unknown> extends Service<ISettings> {
  prisma: TPrismaClient,
  cascadeDelete(ctx: Context, id: string): Promise<void>
  cascadeDeleteMany(ctx: Context, ids: string[]): Promise<void>
  breakCache(ctx: Context, res: unknown): Promise<unknown>
  encryptWhere(ctx: Context): Promise<void>
  encryptData(ctx: Context): Promise<void>
  encryptNonDeterministicFields(record: Record<string, unknown>): Promise<void>
  encryptDeterministicFields(record: Record<string, unknown>): Promise<void>
  decryptFields(ctx: Context, res: unknown): Promise<unknown>
  decryptNonDeterministicFields(record: Record<string, unknown>): Promise<Record<string, unknown>>
  decryptDeterministicFields(record: Record<string, unknown>): Promise<Record<string, unknown>>
}