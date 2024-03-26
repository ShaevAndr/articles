import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class CacheService {
    constructor(private readonly redisService: RedisService) { }

    async get(key: string) {
        const client = this.redisService.getClient();
        const cachedData = await client.get(key);
        return JSON.parse(cachedData);
    }

    async set(key: string, data: any, expiresIn: number) {
        const client = this.redisService.getClient();
        await client.set(key, JSON.stringify(data), 'EX', expiresIn);
    }

    async delete(key: string) {
        const client = this.redisService.getClient();
        await client.del(key);
    }
}