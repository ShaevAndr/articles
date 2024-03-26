import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisModule } from 'nestjs-redis';

@Module({
  imports: [RedisModule.register({
    host: 'localhost',
    port: 6379,
  })],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule { }