import { Module, Global } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

export const REDIS_CLIENT = 'REDIS_CLIENT'

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        const redis = new Redis({
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD', ''),
          db: configService.get('REDIS_DB', 0),
          retryStrategy: (times: number) => {
            const delay = Math.min(times * 200, 2000)
            return delay
          },
        })

        redis.on('connect', () => console.log('Redis Connected'))
        redis.on('error', (error) => console.error('Redis Error', error.message))
        return redis
      },
      inject: [ConfigService],
    }
  ],
  exports: [REDIS_CLIENT]
})

export class RedisModule {}


