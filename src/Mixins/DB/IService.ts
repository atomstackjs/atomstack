import { Service } from "moleculer";
import { ISettings } from "./ISettings.ts";
import { PrismaClient } from "@prisma/client";

export interface IService<TPrismaClient extends PrismaClient, TDelegate> extends Service<ISettings> {
  prisma: TPrismaClient
  model: TDelegate
  createPrismaClient(prismaClient: new () => TPrismaClient): TPrismaClient
}
