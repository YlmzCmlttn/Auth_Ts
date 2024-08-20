type ENV = {
    PORT: number;
    DATABASE_URL: string;
    REDIS_URL: string;
    REDIS_PORT: number;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
};

const env: ENV = {
    PORT: Number(process.env.PORT) as number,
    DATABASE_URL: process.env.DATABASE_URL as string,
    REDIS_URL: process.env.REDIS_URL as string,
    REDIS_PORT: Number(process.env.REDIS_PORT) as number,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
};

export default env;
