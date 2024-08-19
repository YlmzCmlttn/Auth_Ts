// src/server.ts

import express from 'express';
import cookieParser from 'cookie-parser';
import env from './config/env';
import logging from './config/logger';
const NAMESPACE = 'Server';
const PORT = env.PORT;

const app = express();
app.listen(PORT, () => {
    logging.success(NAMESPACE, `Server is running on http://localhost:${PORT}`);}
);
