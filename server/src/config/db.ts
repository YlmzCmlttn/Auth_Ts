import { Pool } from 'pg';
import env  from '@src/config/env';
import logger from '@src/config/logger';

const NAMESPACE = 'PostgreSQL';
const pool = new Pool({
    connectionString:env.DATABASE_URL
});

export const PostgreSQLHelper = {
    // Connect to the PostgreSQL server
    async connect() {
        try {
            await pool.connect(); // Establish a new connection from the pool            
            logger.success(NAMESPACE,`Connected to the PostgreSQL database.`);
        } catch (err : any) {
            logger.error(NAMESPACE,`Connection to PostgreSQL database failed. Error: ${err.message}`);
            //wait 5 seconds and try again
            logger.warn(NAMESPACE,`Waiting 5 seconds and trying to connect to the PostgreSQL database again.`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            logger.warn(NAMESPACE,`Trying to connect to the PostgreSQL database again.`);
            await this.connect();
        }
    },

    // Disconnect from the PostgreSQL server
    async disconnect() {
        await pool.end(); // Close all connections in the pool
        logger.success(NAMESPACE,`Disconnected from the PostgreSQL database.`);
    },

    // Perform a query on the PostgreSQL server
    async query(text: string, params?: any[]) {
        try {
            const result = await pool.query(text, params); // Execute the query with parameters
            const { rows } = result;
            return rows;
        } catch (err : any) {
            logger.error(NAMESPACE,`Query failed. Error: ${err.message}`);
            throw err;
        }
    }
};