import { Service } from "moleculer";
import { ISettings } from "./ISettings.ts";
import { PrismaClient } from "@prisma/client";

export interface IGenericModelService<TPrismaClient> extends Service<ISettings> {
  prisma: TPrismaClient
  model: unknown
  initializePrismaClient(prismaClient: PrismaClient): TPrismaClient
}

export interface IService<TPrismaClient extends PrismaClient, TDelegate> extends IGenericModelService<TPrismaClient> {
  model: TDelegate
}
