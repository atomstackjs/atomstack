import Moleculer, { Context, Service, ServiceMethods, ServiceSchema, ServiceSettingSchema } from "moleculer";
import { array, boolean, number, object, string } from "yup";
import { YupValidator } from "../../ServiceValidators/YupValidator.ts";
import { decrypt, encrypt } from "../../util/encryption.ts";
import MoleculerServerError = Moleculer.Errors.MoleculerServerError;
import { Prisma } from "./prisma/client/index.js";
import TestModelDelegate = Prisma.TestModelDelegate;

export interface IDBSettings extends ServiceSettingSchema {
  /**
   * Fields that should be encrypted using a random encryption algorithm
   */
  encryptedFields?: string[];
  /**
   * Fields that should be encrypted using a deterministic encryption algorithm
   */
  deterministicEncryptedFields?: string[];
}

type TWhere = Record<string, unknown>
type TSelect = Record<string, unknown>

interface IFindParams {
  where: TWhere
  select?: TSelect
  include?: never
  omit?: never
}

interface IFindUniqueParams extends IFindParams {
  where: TWhere & {id: string}
}

interface ICreateParams {
  data: IModelInstance
  select?: TSelect
  include?: never
  omit?: never
}

interface ICreateManyParams {
  data: ICreateParams[]
}

type TUpdateParams = IFindParams & ICreateParams
type TUpdateManyParams = IFindParams & ICreateManyParams

interface IAggregateParams extends IFindParams {
  orderBy: Record<string, unknown>
  skip: number
  take: number
  cursor: string
}

export interface IModelInstance {
  id?: string
}

export interface IModelDelegate<TModelInstance = IModelInstance> {
  findUnique: (args: IFindUniqueParams) => Promise<TModelInstance>
  findUniqueOrThrow: (args: IFindUniqueParams) => Promise<TModelInstance>
  findFirst: (args: IFindParams) => Promise<TModelInstance>
  findFirstOrThrow: (args: IFindParams) => Promise<TModelInstance>
  findMany: (args: IFindParams) => Promise<TModelInstance[]>
  create: (args: ICreateParams) => Promise<TModelInstance>
  createMany: (args: ICreateManyParams) => Promise<TModelInstance[]>
  update: (args: TUpdateParams) => Promise<TModelInstance>
  updateMany: (args: TUpdateManyParams) => Promise<TModelInstance[]>
  delete: (args: IFindParams) => Promise<TModelInstance>
  deleteMany: (args: IFindParams) => Promise<TModelInstance[]>
  aggregate: (args: IAggregateParams) => Promise<TModelInstance>
  groupBy: (args: IAggregateParams) => Promise<TModelInstance>
}

export interface IDBService<TPrismaClient = unknown, TModel extends IModelInstance = IModelInstance> extends Service<IDBSettings> {
  db: TPrismaClient
  model: IModelDelegate
  modelClass: IModelInstance
  cascadeDelete(ctx: Context, id: string): Promise<void>
  cascadeDeleteMany(ctx: Context, ids: string[]): Promise<void>
  breakCache(ctx: Context, res: unknown): Promise<unknown>
  encryptWhere(ctx: Context<IFindParams>): Promise<void>
  encryptData(ctx: Context<TUpdateParams>): Promise<void>
  encryptNonDeterministicFields(record: TModel | Record<string, unknown>): Promise<void>
  encryptDeterministicFields(record: TModel | Record<string, unknown>): Promise<void>
  decryptFields(ctx: Context, res: unknown): Promise<unknown>
  decryptNonDeterministicFields(record: Record<string, unknown>): Promise<Record<string, unknown>>
  decryptDeterministicFields(record: Record<string, unknown>): Promise<Record<string, unknown>>
}

async function wrapPrismaOrThrow<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if ((e as Error).name === "PrismaClientKnownRequestError") {
      throw new MoleculerServerError((e as Error).message, 404, "NOT_FOUND")
    }
    throw e
  }
}

/**
* BaseDBMixin
*
* This mixin provides a set of common database operations for services using
* Prisma ORM. It includes hooks for encrypting and decrypting data, as well as
* methods for handling cascading deletes and cache invalidation.
*
* @template TPrismaClient - The type of the Prisma client.
* @template TMixinSettings - The type of the mixin settings.
* @template TService - The type of the service.
*
* @param {new () => TPrismaClient} clientConstructor - The constructor for the
* Prisma client.
* @param {keyof TPrismaClient & string} name - The name of the Prisma model.
*
* @returns {Partial<TDBServiceSchema<TPrismaClient, TMixinSettings, TService>>}
* The service schema.
*
* @example
* import BaseDBMixin from './BaseDBMixin';
* import { PrismaClient } from '@prisma/client';
*
* const LocatorService = {
*   name: 'locator',
*   mixins: [BaseDBMixin(PrismaClient, 'locator')],
*   settings: {
*     encryptedFields: ['secretField'],
*     deterministicEncryptedFields: ['uniqueField'],
*     foreignKeyConstraints: ['relatedModel']
*   },
*   actions: {
*     // Custom actions here
*   }
* };
*
* module.exports = LocatorService;
*
* ## Settings
* |--------------------------------|------------|---------|------------------------------------------|
* | `encryptedFields`              | `string[]` | `[]`    | Fields that should be encrypted          |
* |                                |            |         | before saving to the database.           |
* | `deterministicEncryptedFields` | `string[]` | `[]`    | Fields to be deterministically encrypted |
* |                                |            |         | before saving to the database.           |
* | `foreignKeyConstraints`        | `string[]` | `[]`    | Related models to check for cascading    |
* |                                |            |         | deletes.                                 |
*
* ## Actions
* | Action            | Description                 | Params                                                   |
* |-------------------|-----------------------------|----------------------------------------------------------|
* | findUnique        | Find a unique record        | `where: object`, `select?: object`, `include?: object`,  |
* |                   |                             | `omit?: object`                                          |
* | findUniqueOrThrow | Find unique record or throw | `where: object`, `select?: object`, `include?: object`,  |
* |                   |                             | `omit?: object`                                          |
* | findFirst         | Find the first record       | `where: object`, `select?: object`, `include?: object`,  |
* |                   |                             | `omit?: object`                                          |
* | findFirstOrThrow  | Find first or throw error   | `where: object`, `select?: object`, `include?: object`,  |
* |                   |                             | `omit?: object`                                          |
* | findMany          | Find multiple records       | `where: object`, `select?: object`, `include?: object`,  |
* |                   |                             | `omit?: object`, `orderby?: object`, `skip?: number`,    |
* |                   |                             | `take?: number`, `cursor?: string`                       |
* | create            | Create a new record         | `data: object`, `select?: object`, `include?: object`,   |
* |                   |                             | `omit?: object`                                          |
* | createMany        | Create multiple records     | `data: object[]`, `skipDuplicates?: boolean`             |
* | update            | Update a record             | `where: object`, `data: object`, `select?: object`,      |
* |                   |                             | `include?: object`, `omit?: object`                      |
* | updateMany        | Update multiple records     | `where: object`, `data: object`                          |
* | delete            | Delete a record             | `where: object`, `select?: object`, `include?: object`,  |
* |                   |                             | `omit?: object`                                          |
* | deleteMany        | Delete multiple records     | `where: object`                                          |
* | aggregate         | Aggregate records           | `where?: object`, `select?: object`, `include?: object`, |
* |                   |                             | `omit?: object`, `orderBy?: object`, `skip?: number`,    |
* |                   |                             | `take?: number`, `cursor?: string`                       |
* | groupBy           | Group records               | `by: object`, `where?: object`, `select?: object`,       |
* |                   |                             | `include?: object`, `omit?: object`, `orderBy?: object`, |
* |                   |                             | `skip?: number`, `take?: number`, `cursor?: string`      |
*
* ## Channel Events
* | Event Name               | Description                              | Params                                                 |
* |--------------------------|------------------------------------------|--------------------------------------------------------|
* | `db.<model>.deleted`     | Triggered when a record is deleted.      | `records: Array<{ id: string, [key: string]: any }> }` |
* | `db.<model>.created`     | Triggered when a record is created.      | `record: { id: string, [key: string]: any } }`         |
* | `db.<model>.updated`     | Triggered when a record is updated.      | `record: { id: string, [key: string]: any } }`         |
* | `db.<model>.cache.break` | Triggered when the cache is invalidated. |                                                        |
   * 
   * ## Encryption
   *
   * Encryption protects sensitive data by converting it into a format that is
   * unreadable without the correct decryption key. This mixin supports two types
   * of encryption:
   *
   * 1. **Standard Encryption**: Produces different ciphertexts each time, suitable
   *    for fields like passwords.
   *
   * 2. **Deterministic Encryption**: Always produces the same ciphertext for the
   *    same plaintext, useful for fields that need to be queried or indexed, like
   *    email addresses. However, it is less secure than standard encryption.
   *
   * ### When to Use Deterministic Encryption
   *
   * Use deterministic encryption when you need to:
   * - Perform equality searches on encrypted fields.
   * - Index encrypted fields for faster query performance.
   * - Maintain referential integrity between encrypted fields in different tables.
   *
   * **Note**: Avoid deterministic encryption for highly sensitive data that does
   * not need querying, as it offers lower security than standard encryption.
   */
export function Base<TService extends IDBService, TPrismaClient>(
  clientConstructor: new() => TPrismaClient,
  name: keyof TPrismaClient & string
): ServiceSchema {

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
      this.db = new clientConstructor()
      this.model = (this.db as Record<string, TestModelDelegate>)[name]
    },

    actions: {
      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique
       */
      findUnique: {
        params: {
          $$validator: YupValidator,
          where: object().required(),
          select: object().optional(),
          include: object().optional(),
          omit: object().optional(),
        },
        cache: true,
        async handler(ctx: Context<IFindUniqueParams>) {
          return this.model.findUnique(ctx.params);
        }
      },

      findUniqueOrThrow: {
        params: {
          $$validator: YupValidator,
          where: object().required(),
          select: object().optional(),
          include: object().optional(),
          omit: object().optional(),
        },
        cache: true,
        async handler(ctx: Context<IFindUniqueParams>) {
          return wrapPrismaOrThrow(() => this.model.findUniqueOrThrow(ctx.params))
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findfirst
       */
      findFirst: {
        params: {
          $$validator: YupValidator,
          where: object().required(),
          select: object().optional(),
          include: object().optional(),
          omit: object().optional(),
        },
        cache: true,
        async handler(ctx: Context<IFindParams>) {
          return this.model.findFirst(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findFirstOrThrow
       */
      findFirstOrThrow: {
        params: {
          $$validator: YupValidator,
          where: object().required(),
          select: object().optional(),
          include: object().optional(),
          omit: object().optional(),
        },
        cache: true,
        async handler(ctx: Context<IFindParams>) {
          return wrapPrismaOrThrow(() => this.model.findFirstOrThrow(ctx.params))
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
       */

      findMany: {
        params: {
          $$validator: YupValidator,
          where: object().required(),
          select: object().optional(),
          include: object().optional(),
          omit: object().optional(),
          orderby: object().optional(),
          skip: number().optional(),
          take: number().optional(),
          cursor: string().optional(),
        },
        cache: true,
        async handler(ctx: Context<IFindParams>) {
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
        async handler(ctx: Context<ICreateParams>) {
          return this.model.create(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update
       */
      createMany: {
        params: {
          data: array().of(object()).required(),
          skipDuplicates: boolean().optional(),
        },
        async handler(ctx: Context<ICreateManyParams>) {
          return this.model.createMany(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update
       */
      update: {
        params: {
          $$validator: YupValidator,
          where: object().required(),
          data: object().required(),
          select: object().optional(),
          include: object().optional(),
          omit: object().optional(),
        },
        async handler(ctx: Context<TUpdateParams>) {
          return this.model.update(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#updatemany
       */
      updateMany: {
        params: {
          $$validator: YupValidator,
          where: object().required(),
          data: object().required(),
        },
        async handler(ctx: Context<TUpdateManyParams>) {
          return this.model.updateMany(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#delete
       */
      delete: {
        params: {
          $$validator: YupValidator,
          where: object().required(),
          select: object().optional(),
          include: object().optional(),
          omit: object().optional(),
        },
        async handler(ctx: Context<IFindParams>) {
          const record = await this.model.findFirst(ctx.params)

          if (record) {
            await this.cascadeDelete(ctx, record.id as string)

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
          where: object().required(),
        },
        async handler(ctx: Context<IFindParams>) {
          const findParams: IFindParams = ctx.params

          const records = await this.model.findMany({
            ...findParams,
          })

          if (records.length !== 0) {
            const ids = records.map(record => record.id)
            await this.cascadeDeleteMany(ctx, ids)

            this.broker.sendToChannel(`${this.name}.deleted`, {})
          }

          return this.model.deleteMany(ctx.params);
        }
      },

      /**
       * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#aggregate
       */
      aggregate: {
        params: {
          $$validator: YupValidator,
          where: object().optional(),
          select: object().optional(),
          include: object().optional(),
          omit: object().optional(),
          orderBy: object().optional(),
          skip: number().optional(),
          take: number().optional(),
          cursor: string().optional(),

        },
        async handler(ctx: Context<IAggregateParams>) {
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
        async handler(ctx: Context<IAggregateParams>) {
          return this.model.groupBy(ctx.params);
        }
      }
    },

    methods:  {
      async breakCache(_ctx: Context, res: unknown) {
        if (this.broker.cacher) {
          await this.broker.cacher.clean(`${this.name}.**`)
        }

        return res
      },
      async encryptWhere(ctx: Context<IFindParams>) {
        const where = ctx.params.where
        await this.encryptNonDeterministicFields(where)
        await this.encryptDeterministicFields(where)
      },
      async encryptData(ctx: Context<TUpdateParams>) {
        const record = ctx.params.data
        await this.encryptNonDeterministicFields(record)
        await this.encryptDeterministicFields(record)
      },
      async encryptNonDeterministicFields(record: TService["modelClass"]) {
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
    }
  }
}

