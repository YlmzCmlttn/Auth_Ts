import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import logger from '@src/config/logger';
import { 
    getUserFromRedis,
    deleteSessionFromRedis,
    generateSessionAndSaveToRedis
 } from '@src/db/redisQuaries';
import { verifyAccessToken } from '@src/utils/authUtils'
import createError from 'http-errors';

const NAMESPACE = 'AuthenticationMiddleware';

const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userId: string | undefined;

        if (req.isMobile) {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                logger.error(NAMESPACE, "Access token not found", "authenticate");
                return next(createError.Unauthorized());
            }

            const payload = verifyAccessToken(token);
            userId = payload.userId;                
        } else {
            const session_id = req.cookies.session_id;

            if (!session_id) {
                logger.error(NAMESPACE, "Session ID not found", "authenticate");
                return next(createError.Unauthorized());
            }

            const user = await getUserFromRedis(session_id);

            if (!user) {
                logger.error(NAMESPACE, "Unauthorized", "authenticate");
                return next(createError.Unauthorized());
            }

            await deleteSessionFromRedis(session_id);
            const newSessionId = await generateSessionAndSaveToRedis(user.userId);
            res.cookie('session_id', newSessionId, { httpOnly: true });
            userId = user.userId;
        }

        req.userId = userId;
        next();
    }catch(error: any) {
        logger.error(NAMESPACE, "Authentication error", error.message);
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return next(createError.Unauthorized("Invalid or expired token"));
        }
        return next(createError.InternalServerError("An unexpected error occurred"));
    }
});

export { authenticate };