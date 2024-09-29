import { Context, Service, ServiceSchema } from "moleculer";
import { Redis as RedisClient } from "ioredis";

export interface IRedisService extends Service {
  redis: RedisClient
}

export function Redis(keyPrefix: string): Partial<ServiceSchema<IRedisService>> {
  const redisMixin: Partial<ServiceSchema<IRedisService>> = {
    created() {
      const url = new URL(process.env.REDIS_URL!)
      this.redis = new RedisClient(parseInt(url.port), url.host)
    },
    actions: {
      get: {
        params: {
          key: "string|required"
        },
        handler(ctx: Context<{ key: string }>) {
          return this.redis.get(`${keyPrefix}.${ctx.params.key}`)
        }
      },
      set: {
        params: {
          key: "string|required",
          value: "any|required"
        },
        handler(ctx: Context<{ key: string, value: unknown }>) {
          return this.set(`${keyPrefix}.${ctx.params.key}`, ctx.params.value)
        }
      }
    }
  }

  return redisMixin
}
