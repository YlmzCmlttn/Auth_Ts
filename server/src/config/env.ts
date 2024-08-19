type ENV = {
    PORT: number;
    DATABASE_URL: string;
    REDIS_URL: string;
    REDIS_PORT: number;
};

const env: ENV = {
    PORT: Number(process.env.PORT) as number,
    DATABASE_URL: process.env.DATABASE_URL as string,
    REDIS_URL: process.env.REDIS_URL as string,
    REDIS_PORT: Number(process.env.REDIS_PORT) as number,
};

export default env;
