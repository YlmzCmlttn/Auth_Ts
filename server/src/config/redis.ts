import Redis from 'ioredis';
import env from '@src/config/env';
import logger from '@src/config/logger';

const NAMESPACE = 'Redis';

interface RedisError extends Error {
    message: string;
}

const redis = new Redis({
    port: env.REDIS_PORT,
    host: env.REDIS_URL
});

export const RedisHelper = {
    connect() {
        redis.on('connect', () => {
            logger.success(NAMESPACE, 'Connected to Redis.');
        });

        redis.on('error', (err: RedisError) => {
            logger.error(NAMESPACE, `Redis connection error: ${err.message}`);
        });
    },

    async disconnect() {
        await redis.quit();
        logger.success(NAMESPACE, 'Disconnected from Redis.');
    },

    async sadd(key: string, value: string) {
        try {
            await redis.sadd(key, value);
            logger.success(NAMESPACE, `Key set in Redis: ${key}`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                logger.error(NAMESPACE, `Error setting key in Redis: ${err.message}`);
            }
            throw err;
        }
    },

    async srem(key: string, value: string) {
        try {
            await redis.srem(key, value);
            logger.success(NAMESPACE, `Key set in Redis: ${key}`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                logger.error(NAMESPACE, `Error setting key in Redis: ${err.message}`);
            }
            throw err;
        }
    },

    async smembers(key: string) {
        try {
            const value = await redis.smembers(key);
            logger.success(NAMESPACE, `Key retrieved from Redis: ${key}`);
            return value;
        } catch (err: unknown) {
            if (err instanceof Error) {
                logger.error(NAMESPACE, `Error retrieving key from Redis: ${err.message}`);
            }
            throw err;
        }
    },

    async set(key: string, value: string, ttl: number) {
        try {
            await redis.set(key, value, 'EX', ttl);
            logger.success(NAMESPACE, `Key set in Redis: ${key}`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                logger.error(NAMESPACE, `Error setting key in Redis: ${err.message}`);
            }
            throw err;
        }
    },

    async get(key: string) {
        try {
            const value = await redis.get(key);
            if(value){
                logger.success(NAMESPACE, `Key retrieved from Redis: ${key}`);
            }else{
                logger.warn(NAMESPACE, `Key not found in Redis: ${key}`);
            }
            return value;
        } catch (err: unknown) {
            if (err instanceof Error) {
                logger.error(NAMESPACE, `Error retrieving key from Redis: ${err.message}`);
            }
            throw err;
        }
    },

    async del(key: string) {
        try {
            await redis.del(key);
            logger.success(NAMESPACE, `Key deleted from Redis: ${key}`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                logger.error(NAMESPACE, `Error deleting key from Redis: ${err.message}`);
            }
            throw err;
        }
    }
};
