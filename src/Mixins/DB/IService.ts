import { Service } from "moleculer";
import { ISettings } from "./ISettings.ts";

export interface IService<TPrismaClient = unknown> extends Service<ISettings> {
  prisma: TPrismaClient
  createPrismaClient(prismaClient: new () => TPrismaClient): TPrismaClient
}
