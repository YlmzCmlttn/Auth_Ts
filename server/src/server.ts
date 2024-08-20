// src/server.ts

import express from 'express';
import cookieParser from 'cookie-parser';
import env from './config/env';
import logging from './config/logger';
import { RedisHelper } from './config/redis';
import { initializeDatabase, db } from '@src/config/db';

import { notFound, errorHandler } from './middlewares/errorMiddleware';
import routes from './routes';

const NAMESPACE = 'Server';
const PORT = env.PORT;

RedisHelper.connect();
initializeDatabase();

const app = express();
const cors = require('cors');

app.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/',routes);
app.get('/', (req, res) => {
    res.send('Server is ready!');
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    logging.success(NAMESPACE, `Server is running on http://localhost:${PORT}`);}
);
export default app;