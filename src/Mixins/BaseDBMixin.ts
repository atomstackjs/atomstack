import { kebabCase } from "lodash";
import Moleculer, { Context, Service, ServiceSchema, ServiceSettingSchema } from "moleculer";
import { object } from "yup";
import { Locator, Prisma, PrismaClient } from "../services/db/locator/prisma/client/index.js";
import { YupValidator } from "../ServiceValidators/YupValidator.ts";
import { decrypt, encrypt } from "../util/encryption.ts";
import MoleculerServerError = Moleculer.Errors.MoleculerServerError;

export interface IDbMixinSettings extends ServiceSettingSchema {
  databaseURL: string;
  /**
   * Fields that should be encrypted using a random encryption algorithm
   */
  encryptedFields?: string[];
  /**
   * Fields that should be encrypted using a deterministic encryption algorithm
   */
  deterministicEncryptedFields?: string[];

  /**
   * Foreign key constraints that should be enforced. This is enforced by the service, not the database. See the
   * README for more information.
   */
  foreignKeyConstraints?: string[]
}

// all the delegate types are generated, but have the same structure so we're gunna use Account as our generic
type TModelDelegate = Prisma.LocatorDelegate
type TFindUniqueArgs = Prisma.LocatorFindUniqueArgs
type TFindManyArgs = Prisma.LocatorFindManyArgs
export type TCreateArgs = Prisma.LocatorCreateArgs
type TCreateManyArgs = Prisma.LocatorCreateManyArgs
type TUpdateArgs = Prisma.LocatorUpdateArgs
type TUpdateManyArgs = Prisma.LocatorUpdateManyArgs
type TDeleteArgs = Prisma.LocatorDeleteArgs
type TDeleteManyArgs = Prisma.LocatorDeleteManyArgs
type TAggregateArgs = Prisma.LocatorAggregateArgs
type TModel = Locator


interface IGroupByArgs extends Prisma.LocatorGroupByArgs {
  orderBy: Prisma.LocatorOrderByWithAggregationInput | Prisma.LocatorOrderByWithAggregationInput[]
}

export interface IDBMixinService<TPrismaClient extends PrismaClient, TDbSettings extends IDbMixinSettings = IDbMixinSettings> extends Service<TDbSettings> {
  db: TPrismaClient
  model: TModelDelegate
  cascadeDelete(ctx: Context, id: string): Promise<void>
  cascadeDeleteMany(ctx: Context, ids: string[]): Promise<void>
  breakCache(ctx: Context, res: unknown): Promise<unknown>
  encryptWhere(ctx: Context<TFindUniqueArgs>): Promise<void>
  encryptData(ctx: Context<TUpdateArgs>): Promise<void>
  encryptNonDeterministicFields(record: Record<string, unknown>): Promise<void>
  encryptDeterministicFields(record: Record<string, unknown>): Promise<void>
  decryptFields(ctx: Context, res: unknown): Promise<unknown>
  decryptNonDeterministicFields(record: Record<string, unknown>): Promise<Record<string, unknown>>
  decryptDeterministicFields(record: Record<string, unknown>): Promise<Record<string, unknown>>
}

export type TDBServiceSchema<
  TPrismaClient extends PrismaClient,
  TMixinSettings extends IDbMixinSettings = IDbMixinSettings,
  TService extends IDBMixinService<TPrismaClient, TMixinSettings> = IDBMixinService<TPrismaClient, TMixinSettings>
> = ServiceSchema<TMixinSettings, TService>

async function wrapPrismaOrThrow<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new MoleculerServerError(e.message, 404, "NOT_FOUND")
    }

    throw e
  }
}

export default function <
  TPrismaClient extends PrismaClient = PrismaClient,
  TMixinSettings extends IDbMixinSettings = IDbMixinSettings,
  TService extends IDBMixinService<TPrismaClient, TMixinSettings> = IDBMixinService<TPrismaClient, TMixinSettings>,
>(
  clientConstructor: new () => TPrismaClient,
  name: keyof TPrismaClient & string,
): Partial<TDBServiceSchema<TPrismaClient, TMixinSettings, TService>> {
  return {
    name: `db.${name}`,
    hooks: {
      before: {
        "create": ["encryptData"],
        "update": ["encryptData", "encryptWhere"],
        "findUnique": ["encryptWhere"],
        "findFirst": ["encryptWhere"],
        "findMany": ["encryptWhere"],
        "delete": ["encryptWhere"],
        "deleteMany": ["encryptWhere"]
      },
      after: {
        "*": ["decryptFields"],
        "create": ["breakCache"],
        "destroy": ["breakCache"],
        "update": ["breakCache"]
      }
    },

    async started() {
      // prase the database URL and create a new Sequelize instance
      this.db = new clientConstructor()
      this.model = this.db[name] as TModelDelegate
    },

    methods: {
      async cascadeDeleteMany(ctx: Context, ids: string[]) {
        if (this.settings.foreignKeyConstraints) {
          for (const id of ids) {
            await this.cascadeDelete(ctx, id)
          }
        }
      },
      async cascadeDelete(ctx: Context, id: string) {
        if (this.settings.foreignKeyConstraints) {
          for (const name of this.settings.foreignKeyConstraints) {
            await ctx.call(`data.${kebabCase(name)}.deleteMany`, {
              where: {
                [this.name.replace("data.", "") + "Id"]: id
              }
            })
          }
        }
      },
      async breakCache(_ctx: Context, res: unknown) {
        if (this.broker.cacher) {
          await this.broker.cacher.clean(`${this.name}.**`)
        }

        return res
      },
      async encryptWhere(ctx: Context<TFindUniqueArgs>) {
        const where = ctx.params.where
        await this.encryptNonDeterministicFields(where)
        await this.encryptDeterministicFields(where)
      },
      async encryptData(ctx: Context<TUpdateArgs>) {
        const record = ctx.params.data
        await this.encryptNonDeterministicFields(record)
        await this.encryptDeterministicFields(record)
      },
      async encryptNonDeterministicFields(record: Record<string, unknown>) {
        if (this.settings.encryptedFields) {
          for (const field of this.settings.encryptedFields) {
            if (record[field]) {
              record[field] = (await encrypt(Buffer.from(record[field] as string))).toString()
            }
          }
        }
      },
      async encryptDeterministicFields(record: Record<string, unknown>) {
        if (this.settings.deterministicEncryptedFields) {
          for (const field of this.settings.deterministicEncryptedFields) {
            if (record[field]) {
              record[field] = (await encrypt(Buffer.from(record[field] as string), true)).toString()
            }
          }
        }
      },
      async decryptFields(_ctx: Context, res: Record<string, unknown> | Record<string, unknown>[]) {
        if (!res) return res

        if (res instanceof Array) {
          const newRes = []
          for (let record of res) {
            record = await this.decryptNonDeterministicFields(record)
            newRes.push(await this.decryptDeterministicFields(record))

            res = newRes
          }
        } else {
          res = await this.decryptNonDeterministicFields(res)
          res = await this.decryptDeterministicFields(res)
        }

        return res
      },
      async decryptNonDeterministicFields(record: Record<string, unknown>) {
        if (this.settings.encryptedFields) {
          for (const field of this.settings.encryptedFields) {
            if (record[field]) {
              record[field] = (await decrypt(Buffer.from(record[field] as string), true)).toString()
            }
          }
        }

        return record
      },
      async decryptDeterministicFields(record: Record<string, unknown>) {
        if (this.settings.deterministicEncryptedFields) {
          for (const field of this.settings.deterministicEncryptedFields) {
            if (record[field]) {
              record[field] = (await decrypt(Buffer.from(record[field] as string), true)).toString()
            }
          }
        }

        return record
      },
    },

    actions: {
      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique
       */
      findUnique: {
        params: {
          where: "object",
          select: "object|optional",
          include: "object|optional",
          omit: "object|optional"
        },
        cache: true,
        async handler(ctx: Context<TFindUniqueArgs>) {
          return this.model.findUnique(ctx.params);
        }
      },

      findUniqueOrThrow: {
        params: {
          where: "object",
          select: "object|optional",
          include: "object|optional",
          omit: "object|optional"
        },
        cache: true,
        async handler(ctx: Context<TFindUniqueArgs>) {
          return wrapPrismaOrThrow(() => this.model.findUniqueOrThrow(ctx.params))
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findfirst
       */
      findFirst: {
        params: {
          where: "object",
          select: "object|optional",
          include: "object|optional",
          omit: "object|optional"
        },
        cache: true,
        async handler(ctx: Context<TFindUniqueArgs>) {
          return this.model.findFirst(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findFirstOrThrow
       */
      findFirstOrThrow: {
        params: {
          where: "object",
          select: "object|optional",
          include: "object|optional",
          omit: "object|optional"
        },
        cache: true,
        async handler(ctx: Context<TFindUniqueArgs>) {
          return wrapPrismaOrThrow(() => this.model.findFirstOrThrow(ctx.params))
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
       */

      findMany: {
        params: {
          where: "object",
          select: "object|optional",
          include: "object|optional",
          omit: "object|optional",
          orderBy: "object|optional",
          skip: "number|optional",
          take: "number|optional",
          cursor: "string|optional",
        },
        cache: true,
        async handler(ctx: Context<TFindManyArgs>) {
          return this.model.findMany(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create
       */
      create: {
        params: {
          $$validator: YupValidator,
          data: object({}).required(),
          select: object({}).optional(),
          include: object({}).optional(),
          omit: object({}).optional(),
        },
        async handler(ctx: Context<TCreateArgs>) {
          return this.model.create(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update
       */
      createMany: {
        params: {
          data: "object[]",
          skipDuplicates: "boolean|optional"
        },
        async handler(ctx: Context<TCreateManyArgs>) {
          return this.model.createMany(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update
       */
      update: {
        params: {
          where: "object",
          data: "object",
          select: "object|optional",
          include: "object|optional",
          omit: "object|optional",
        },
        async handler(ctx: Context<TUpdateArgs>) {
          return this.model.update(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#updatemany
       */
      updateMany: {
        params: {
          where: "object",
          data: "object",
        },
        async handler(ctx: Context<TUpdateManyArgs>) {
          return this.model.updateMany(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#delete
       */
      delete: {
        params: {
          where: "object",
          select: "object|optional",
          include: "object|optional",
          omit: "object|optional",
        },
        async handler(ctx: Context<TDeleteArgs>) {
          const record = await this.model.findFirst(ctx.params)

          if (record) {
            await this.cascadeDelete(ctx, record.id)

            await this.broker.sendToChannel(`${this.name}.deleted`, {
              records: [record]
            })
          }

          return this.model.delete(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#deletemany
       */
      deleteMany: {
        params: {
          where: "object",
        },
        async handler(ctx: Context<TDeleteManyArgs>) {
          const findParams: TFindManyArgs = ctx.params

          const records: TModel[] = await this.model.findMany({
            ...findParams,
          })

          if (records.length !== 0) {
            const ids = records.map(record => record.id)
            await this.cascadeDeleteMany(ctx, ids)

            this.broker.sendToChannel(`${this.name}.deleted`, {

            })
          }

          return this.model.deleteMany(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#aggregate
       */
      aggregate: {
        params: {
          where: "object|optional",
          select: "object|optional",
          include: "object|optional",
          omit: "object|optional",
          orderBy: "object|optional",
          skip: "number|optional",
          take: "number|optional",
          cursor: "string|optional",
        },
        async handler(ctx: Context<TAggregateArgs>) {
          return this.model.aggregate(ctx.params);
        }
      },

      groupBy: {
        params: {
          by: "object",
          where: "object|optional",
          select: "object|optional",
          include: "object|optional",
          omit: "object|optional",
          orderBy: "object|optional",
          skip: "number|optional",
          take: "number|optional",
          cursor: "string|optional",
        },
        async handler(ctx: Context<IGroupByArgs>) {
          return this.model.groupBy(ctx.params);
        }
      }
    }
  }
}
