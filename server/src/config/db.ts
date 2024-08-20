// src/db.ts
import { DataSource } from "typeorm";
import env from '@src/config/env';
import logger from '@src/config/logger';

const NAMESPACE = 'Database';
export const db = new DataSource({
    type: "postgres",
    url: env.DATABASE_URL,
    entities: [__dirname + '/../entity/**/*.entity.ts'],
    logging: true,
    synchronize: true,
});


export async function initializeDatabase() {
    try {
        await db.initialize(); // This initializes the connection to the database
        logger.success(NAMESPACE,`Connected to the PostgreSQL database.`);
    } catch (error) {
        logger.error(NAMESPACE,`Connection to PostgreSQL database failed. Error: ${error}`);
        logger.warn(NAMESPACE,`Waiting 5 seconds and trying to connect to the PostgreSQL database again.`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        logger.warn(NAMESPACE,`Trying to connect to the PostgreSQL database again.`);
        initializeDatabase();
    }
}
