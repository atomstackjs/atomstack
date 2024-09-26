import {Context, Errors, ServiceSchema} from "moleculer";
import {array, boolean, number, object, string} from "yup";
import {YupValidator} from "../../ServiceValidators/index.js";
import {decrypt, encrypt} from "../../util/encryption.ts";
import {IService} from "./IService.ts";

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
export const Base: Partial<ServiceSchema<IService>> = {
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
    error: {
      "*": ["handleError"]
    }
  },

  actions: {
    /**
     * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#count
     */
    count: {
      params: {
        $$validator: YupValidator,
        where: object().optional(),
      },
      async handler() {
        throw new Error("Not implemented")
      }
    },


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
      async handler() {
        throw new Error("Not implemented")
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
      async handler() {
        throw new Error("Not implemented")
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
      async handler() {
        throw new Error("Not implemented")
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
      async handler() {
        throw new Error("Not implemented")
      }
    },

    /**
     * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update
     */
    createMany: {
      params: {
        $$validator: YupValidator,
        data: array().of(object()).required(),
        skipDuplicates: boolean().optional(),
      },
      async handler() {
        throw new Error("Not implemented")
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
      async handler() {
        throw new Error("Not implemented")
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
      async handler() {
        throw new Error("Not implemented")
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
      async handler() {
        throw new Error("Not implemented")
      }
    },

    /**
     * @see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#deletemany
     */
    deleteMany: {
      params: {
        $$validator: YupValidator,
        where: object().required(),
      },
      async handler() {
        throw new Error("Not implemented")
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
      async handler() {
        throw new Error("Not implemented")
      }
    },
  },

  methods: {
    async breakCache(_ctx: Context, res: unknown) {
      if (this.broker.cacher) {
        await this.broker.cacher.clean(`${this.name}.**`)
      }

      return res
    },
    async encryptWhere(ctx: Context<{ where: Record<string, string> }>) {
      const where = ctx.params.where
      await this.encryptNonDeterministicFields(where)
      await this.encryptDeterministicFields(where)
    },
    async encryptData(ctx: Context<{ data: Record<string, string> }>) {
      await this.encryptNonDeterministicFields(ctx.params.data)
      await this.encryptDeterministicFields(ctx.params.data)
    },
    async encryptNonDeterministicFields(record: Record<string, string>) {
      if (this.settings.encryptedFields) {
        for (const field of this.settings.encryptedFields) {
          if (record[field]) {
            record[field] = (await encrypt(Buffer.from(record[field]))).toString()
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
    async handleError(_ctx: Context, err: Error) {
      if (err instanceof Errors.MoleculerError) {
        throw err
      }

      throw new Errors.MoleculerError(err.message, 500, "INTERNAL_SERVER_ERROR", {error: err})
    }
  }
}
