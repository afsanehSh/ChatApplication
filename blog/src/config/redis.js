import Redis from 'ioredis'

export const redisClient = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  keyPrefix: process.env.REDIS_KEY_PREFIX
})
