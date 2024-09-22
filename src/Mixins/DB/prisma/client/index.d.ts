
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model TestModel
 * 
 */
export type TestModel = $Result.DefaultSelection<Prisma.$TestModelPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more TestModels
 * const testModels = await prisma.testModel.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more TestModels
   * const testModels = await prisma.testModel.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.testModel`: Exposes CRUD operations for the **TestModel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TestModels
    * const testModels = await prisma.testModel.findMany()
    * ```
    */
  get testModel(): Prisma.TestModelDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.19.1
   * Query Engine version: 69d742ee20b815d88e17e54db4a2a7a3b30324e3
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    TestModel: 'TestModel'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "testModel"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      TestModel: {
        payload: Prisma.$TestModelPayload<ExtArgs>
        fields: Prisma.TestModelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TestModelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestModelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TestModelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestModelPayload>
          }
          findFirst: {
            args: Prisma.TestModelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestModelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TestModelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestModelPayload>
          }
          findMany: {
            args: Prisma.TestModelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestModelPayload>[]
          }
          create: {
            args: Prisma.TestModelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestModelPayload>
          }
          createMany: {
            args: Prisma.TestModelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TestModelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestModelPayload>[]
          }
          delete: {
            args: Prisma.TestModelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestModelPayload>
          }
          update: {
            args: Prisma.TestModelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestModelPayload>
          }
          deleteMany: {
            args: Prisma.TestModelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TestModelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TestModelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestModelPayload>
          }
          aggregate: {
            args: Prisma.TestModelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTestModel>
          }
          groupBy: {
            args: Prisma.TestModelGroupByArgs<ExtArgs>
            result: $Utils.Optional<TestModelGroupByOutputType>[]
          }
          count: {
            args: Prisma.TestModelCountArgs<ExtArgs>
            result: $Utils.Optional<TestModelCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model TestModel
   */

  export type AggregateTestModel = {
    _count: TestModelCountAggregateOutputType | null
    _min: TestModelMinAggregateOutputType | null
    _max: TestModelMaxAggregateOutputType | null
  }

  export type TestModelMinAggregateOutputType = {
    id: string | null
    plainText: string | null
    encryptedText: string | null
    deterministicEncryptedText: string | null
  }

  export type TestModelMaxAggregateOutputType = {
    id: string | null
    plainText: string | null
    encryptedText: string | null
    deterministicEncryptedText: string | null
  }

  export type TestModelCountAggregateOutputType = {
    id: number
    plainText: number
    encryptedText: number
    deterministicEncryptedText: number
    _all: number
  }


  export type TestModelMinAggregateInputType = {
    id?: true
    plainText?: true
    encryptedText?: true
    deterministicEncryptedText?: true
  }

  export type TestModelMaxAggregateInputType = {
    id?: true
    plainText?: true
    encryptedText?: true
    deterministicEncryptedText?: true
  }

  export type TestModelCountAggregateInputType = {
    id?: true
    plainText?: true
    encryptedText?: true
    deterministicEncryptedText?: true
    _all?: true
  }

  export type TestModelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TestModel to aggregate.
     */
    where?: TestModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestModels to fetch.
     */
    orderBy?: TestModelOrderByWithRelationInput | TestModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TestModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TestModels
    **/
    _count?: true | TestModelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TestModelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TestModelMaxAggregateInputType
  }

  export type GetTestModelAggregateType<T extends TestModelAggregateArgs> = {
        [P in keyof T & keyof AggregateTestModel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTestModel[P]>
      : GetScalarType<T[P], AggregateTestModel[P]>
  }




  export type TestModelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TestModelWhereInput
    orderBy?: TestModelOrderByWithAggregationInput | TestModelOrderByWithAggregationInput[]
    by: TestModelScalarFieldEnum[] | TestModelScalarFieldEnum
    having?: TestModelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TestModelCountAggregateInputType | true
    _min?: TestModelMinAggregateInputType
    _max?: TestModelMaxAggregateInputType
  }

  export type TestModelGroupByOutputType = {
    id: string
    plainText: string
    encryptedText: string
    deterministicEncryptedText: string
    _count: TestModelCountAggregateOutputType | null
    _min: TestModelMinAggregateOutputType | null
    _max: TestModelMaxAggregateOutputType | null
  }

  type GetTestModelGroupByPayload<T extends TestModelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TestModelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TestModelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TestModelGroupByOutputType[P]>
            : GetScalarType<T[P], TestModelGroupByOutputType[P]>
        }
      >
    >


  export type TestModelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    plainText?: boolean
    encryptedText?: boolean
    deterministicEncryptedText?: boolean
  }, ExtArgs["result"]["testModel"]>

  export type TestModelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    plainText?: boolean
    encryptedText?: boolean
    deterministicEncryptedText?: boolean
  }, ExtArgs["result"]["testModel"]>

  export type TestModelSelectScalar = {
    id?: boolean
    plainText?: boolean
    encryptedText?: boolean
    deterministicEncryptedText?: boolean
  }


  export type $TestModelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TestModel"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      plainText: string
      encryptedText: string
      deterministicEncryptedText: string
    }, ExtArgs["result"]["testModel"]>
    composites: {}
  }

  type TestModelGetPayload<S extends boolean | null | undefined | TestModelDefaultArgs> = $Result.GetResult<Prisma.$TestModelPayload, S>

  type TestModelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TestModelFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TestModelCountAggregateInputType | true
    }

  export interface TestModelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TestModel'], meta: { name: 'TestModel' } }
    /**
     * Find zero or one TestModel that matches the filter.
     * @param {TestModelFindUniqueArgs} args - Arguments to find a TestModel
     * @example
     * // Get one TestModel
     * const testModel = await prisma.testModel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TestModelFindUniqueArgs>(args: SelectSubset<T, TestModelFindUniqueArgs<ExtArgs>>): Prisma__TestModelClient<$Result.GetResult<Prisma.$TestModelPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TestModel that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TestModelFindUniqueOrThrowArgs} args - Arguments to find a TestModel
     * @example
     * // Get one TestModel
     * const testModel = await prisma.testModel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TestModelFindUniqueOrThrowArgs>(args: SelectSubset<T, TestModelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TestModelClient<$Result.GetResult<Prisma.$TestModelPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TestModel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestModelFindFirstArgs} args - Arguments to find a TestModel
     * @example
     * // Get one TestModel
     * const testModel = await prisma.testModel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TestModelFindFirstArgs>(args?: SelectSubset<T, TestModelFindFirstArgs<ExtArgs>>): Prisma__TestModelClient<$Result.GetResult<Prisma.$TestModelPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TestModel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestModelFindFirstOrThrowArgs} args - Arguments to find a TestModel
     * @example
     * // Get one TestModel
     * const testModel = await prisma.testModel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TestModelFindFirstOrThrowArgs>(args?: SelectSubset<T, TestModelFindFirstOrThrowArgs<ExtArgs>>): Prisma__TestModelClient<$Result.GetResult<Prisma.$TestModelPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TestModels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestModelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TestModels
     * const testModels = await prisma.testModel.findMany()
     * 
     * // Get first 10 TestModels
     * const testModels = await prisma.testModel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const testModelWithIdOnly = await prisma.testModel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TestModelFindManyArgs>(args?: SelectSubset<T, TestModelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestModelPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TestModel.
     * @param {TestModelCreateArgs} args - Arguments to create a TestModel.
     * @example
     * // Create one TestModel
     * const TestModel = await prisma.testModel.create({
     *   data: {
     *     // ... data to create a TestModel
     *   }
     * })
     * 
     */
    create<T extends TestModelCreateArgs>(args: SelectSubset<T, TestModelCreateArgs<ExtArgs>>): Prisma__TestModelClient<$Result.GetResult<Prisma.$TestModelPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TestModels.
     * @param {TestModelCreateManyArgs} args - Arguments to create many TestModels.
     * @example
     * // Create many TestModels
     * const testModel = await prisma.testModel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TestModelCreateManyArgs>(args?: SelectSubset<T, TestModelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TestModels and returns the data saved in the database.
     * @param {TestModelCreateManyAndReturnArgs} args - Arguments to create many TestModels.
     * @example
     * // Create many TestModels
     * const testModel = await prisma.testModel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TestModels and only return the `id`
     * const testModelWithIdOnly = await prisma.testModel.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TestModelCreateManyAndReturnArgs>(args?: SelectSubset<T, TestModelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestModelPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TestModel.
     * @param {TestModelDeleteArgs} args - Arguments to delete one TestModel.
     * @example
     * // Delete one TestModel
     * const TestModel = await prisma.testModel.delete({
     *   where: {
     *     // ... filter to delete one TestModel
     *   }
     * })
     * 
     */
    delete<T extends TestModelDeleteArgs>(args: SelectSubset<T, TestModelDeleteArgs<ExtArgs>>): Prisma__TestModelClient<$Result.GetResult<Prisma.$TestModelPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TestModel.
     * @param {TestModelUpdateArgs} args - Arguments to update one TestModel.
     * @example
     * // Update one TestModel
     * const testModel = await prisma.testModel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TestModelUpdateArgs>(args: SelectSubset<T, TestModelUpdateArgs<ExtArgs>>): Prisma__TestModelClient<$Result.GetResult<Prisma.$TestModelPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TestModels.
     * @param {TestModelDeleteManyArgs} args - Arguments to filter TestModels to delete.
     * @example
     * // Delete a few TestModels
     * const { count } = await prisma.testModel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TestModelDeleteManyArgs>(args?: SelectSubset<T, TestModelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TestModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestModelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TestModels
     * const testModel = await prisma.testModel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TestModelUpdateManyArgs>(args: SelectSubset<T, TestModelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TestModel.
     * @param {TestModelUpsertArgs} args - Arguments to update or create a TestModel.
     * @example
     * // Update or create a TestModel
     * const testModel = await prisma.testModel.upsert({
     *   create: {
     *     // ... data to create a TestModel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TestModel we want to update
     *   }
     * })
     */
    upsert<T extends TestModelUpsertArgs>(args: SelectSubset<T, TestModelUpsertArgs<ExtArgs>>): Prisma__TestModelClient<$Result.GetResult<Prisma.$TestModelPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TestModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestModelCountArgs} args - Arguments to filter TestModels to count.
     * @example
     * // Count the number of TestModels
     * const count = await prisma.testModel.count({
     *   where: {
     *     // ... the filter for the TestModels we want to count
     *   }
     * })
    **/
    count<T extends TestModelCountArgs>(
      args?: Subset<T, TestModelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TestModelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TestModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestModelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TestModelAggregateArgs>(args: Subset<T, TestModelAggregateArgs>): Prisma.PrismaPromise<GetTestModelAggregateType<T>>

    /**
     * Group by TestModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestModelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TestModelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TestModelGroupByArgs['orderBy'] }
        : { orderBy?: TestModelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TestModelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTestModelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TestModel model
   */
  readonly fields: TestModelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TestModel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TestModelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TestModel model
   */ 
  interface TestModelFieldRefs {
    readonly id: FieldRef<"TestModel", 'String'>
    readonly plainText: FieldRef<"TestModel", 'String'>
    readonly encryptedText: FieldRef<"TestModel", 'String'>
    readonly deterministicEncryptedText: FieldRef<"TestModel", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TestModel findUnique
   */
  export type TestModelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestModel
     */
    select?: TestModelSelect<ExtArgs> | null
    /**
     * Filter, which TestModel to fetch.
     */
    where: TestModelWhereUniqueInput
  }

  /**
   * TestModel findUniqueOrThrow
   */
  export type TestModelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestModel
     */
    select?: TestModelSelect<ExtArgs> | null
    /**
     * Filter, which TestModel to fetch.
     */
    where: TestModelWhereUniqueInput
  }

  /**
   * TestModel findFirst
   */
  export type TestModelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestModel
     */
    select?: TestModelSelect<ExtArgs> | null
    /**
     * Filter, which TestModel to fetch.
     */
    where?: TestModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestModels to fetch.
     */
    orderBy?: TestModelOrderByWithRelationInput | TestModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TestModels.
     */
    cursor?: TestModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TestModels.
     */
    distinct?: TestModelScalarFieldEnum | TestModelScalarFieldEnum[]
  }

  /**
   * TestModel findFirstOrThrow
   */
  export type TestModelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestModel
     */
    select?: TestModelSelect<ExtArgs> | null
    /**
     * Filter, which TestModel to fetch.
     */
    where?: TestModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestModels to fetch.
     */
    orderBy?: TestModelOrderByWithRelationInput | TestModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TestModels.
     */
    cursor?: TestModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TestModels.
     */
    distinct?: TestModelScalarFieldEnum | TestModelScalarFieldEnum[]
  }

  /**
   * TestModel findMany
   */
  export type TestModelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestModel
     */
    select?: TestModelSelect<ExtArgs> | null
    /**
     * Filter, which TestModels to fetch.
     */
    where?: TestModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestModels to fetch.
     */
    orderBy?: TestModelOrderByWithRelationInput | TestModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TestModels.
     */
    cursor?: TestModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestModels.
     */
    skip?: number
    distinct?: TestModelScalarFieldEnum | TestModelScalarFieldEnum[]
  }

  /**
   * TestModel create
   */
  export type TestModelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestModel
     */
    select?: TestModelSelect<ExtArgs> | null
    /**
     * The data needed to create a TestModel.
     */
    data: XOR<TestModelCreateInput, TestModelUncheckedCreateInput>
  }

  /**
   * TestModel createMany
   */
  export type TestModelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TestModels.
     */
    data: TestModelCreateManyInput | TestModelCreateManyInput[]
  }

  /**
   * TestModel createManyAndReturn
   */
  export type TestModelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestModel
     */
    select?: TestModelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TestModels.
     */
    data: TestModelCreateManyInput | TestModelCreateManyInput[]
  }

  /**
   * TestModel update
   */
  export type TestModelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestModel
     */
    select?: TestModelSelect<ExtArgs> | null
    /**
     * The data needed to update a TestModel.
     */
    data: XOR<TestModelUpdateInput, TestModelUncheckedUpdateInput>
    /**
     * Choose, which TestModel to update.
     */
    where: TestModelWhereUniqueInput
  }

  /**
   * TestModel updateMany
   */
  export type TestModelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TestModels.
     */
    data: XOR<TestModelUpdateManyMutationInput, TestModelUncheckedUpdateManyInput>
    /**
     * Filter which TestModels to update
     */
    where?: TestModelWhereInput
  }

  /**
   * TestModel upsert
   */
  export type TestModelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestModel
     */
    select?: TestModelSelect<ExtArgs> | null
    /**
     * The filter to search for the TestModel to update in case it exists.
     */
    where: TestModelWhereUniqueInput
    /**
     * In case the TestModel found by the `where` argument doesn't exist, create a new TestModel with this data.
     */
    create: XOR<TestModelCreateInput, TestModelUncheckedCreateInput>
    /**
     * In case the TestModel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TestModelUpdateInput, TestModelUncheckedUpdateInput>
  }

  /**
   * TestModel delete
   */
  export type TestModelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestModel
     */
    select?: TestModelSelect<ExtArgs> | null
    /**
     * Filter which TestModel to delete.
     */
    where: TestModelWhereUniqueInput
  }

  /**
   * TestModel deleteMany
   */
  export type TestModelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TestModels to delete
     */
    where?: TestModelWhereInput
  }

  /**
   * TestModel without action
   */
  export type TestModelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestModel
     */
    select?: TestModelSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TestModelScalarFieldEnum: {
    id: 'id',
    plainText: 'plainText',
    encryptedText: 'encryptedText',
    deterministicEncryptedText: 'deterministicEncryptedText'
  };

  export type TestModelScalarFieldEnum = (typeof TestModelScalarFieldEnum)[keyof typeof TestModelScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type TestModelWhereInput = {
    AND?: TestModelWhereInput | TestModelWhereInput[]
    OR?: TestModelWhereInput[]
    NOT?: TestModelWhereInput | TestModelWhereInput[]
    id?: StringFilter<"TestModel"> | string
    plainText?: StringFilter<"TestModel"> | string
    encryptedText?: StringFilter<"TestModel"> | string
    deterministicEncryptedText?: StringFilter<"TestModel"> | string
  }

  export type TestModelOrderByWithRelationInput = {
    id?: SortOrder
    plainText?: SortOrder
    encryptedText?: SortOrder
    deterministicEncryptedText?: SortOrder
  }

  export type TestModelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TestModelWhereInput | TestModelWhereInput[]
    OR?: TestModelWhereInput[]
    NOT?: TestModelWhereInput | TestModelWhereInput[]
    plainText?: StringFilter<"TestModel"> | string
    encryptedText?: StringFilter<"TestModel"> | string
    deterministicEncryptedText?: StringFilter<"TestModel"> | string
  }, "id">

  export type TestModelOrderByWithAggregationInput = {
    id?: SortOrder
    plainText?: SortOrder
    encryptedText?: SortOrder
    deterministicEncryptedText?: SortOrder
    _count?: TestModelCountOrderByAggregateInput
    _max?: TestModelMaxOrderByAggregateInput
    _min?: TestModelMinOrderByAggregateInput
  }

  export type TestModelScalarWhereWithAggregatesInput = {
    AND?: TestModelScalarWhereWithAggregatesInput | TestModelScalarWhereWithAggregatesInput[]
    OR?: TestModelScalarWhereWithAggregatesInput[]
    NOT?: TestModelScalarWhereWithAggregatesInput | TestModelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TestModel"> | string
    plainText?: StringWithAggregatesFilter<"TestModel"> | string
    encryptedText?: StringWithAggregatesFilter<"TestModel"> | string
    deterministicEncryptedText?: StringWithAggregatesFilter<"TestModel"> | string
  }

  export type TestModelCreateInput = {
    id?: string
    plainText: string
    encryptedText: string
    deterministicEncryptedText: string
  }

  export type TestModelUncheckedCreateInput = {
    id?: string
    plainText: string
    encryptedText: string
    deterministicEncryptedText: string
  }

  export type TestModelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    plainText?: StringFieldUpdateOperationsInput | string
    encryptedText?: StringFieldUpdateOperationsInput | string
    deterministicEncryptedText?: StringFieldUpdateOperationsInput | string
  }

  export type TestModelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    plainText?: StringFieldUpdateOperationsInput | string
    encryptedText?: StringFieldUpdateOperationsInput | string
    deterministicEncryptedText?: StringFieldUpdateOperationsInput | string
  }

  export type TestModelCreateManyInput = {
    id?: string
    plainText: string
    encryptedText: string
    deterministicEncryptedText: string
  }

  export type TestModelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    plainText?: StringFieldUpdateOperationsInput | string
    encryptedText?: StringFieldUpdateOperationsInput | string
    deterministicEncryptedText?: StringFieldUpdateOperationsInput | string
  }

  export type TestModelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    plainText?: StringFieldUpdateOperationsInput | string
    encryptedText?: StringFieldUpdateOperationsInput | string
    deterministicEncryptedText?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type TestModelCountOrderByAggregateInput = {
    id?: SortOrder
    plainText?: SortOrder
    encryptedText?: SortOrder
    deterministicEncryptedText?: SortOrder
  }

  export type TestModelMaxOrderByAggregateInput = {
    id?: SortOrder
    plainText?: SortOrder
    encryptedText?: SortOrder
    deterministicEncryptedText?: SortOrder
  }

  export type TestModelMinOrderByAggregateInput = {
    id?: SortOrder
    plainText?: SortOrder
    encryptedText?: SortOrder
    deterministicEncryptedText?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use TestModelDefaultArgs instead
     */
    export type TestModelArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TestModelDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}