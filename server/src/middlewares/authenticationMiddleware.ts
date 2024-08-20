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

const authenticate = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        const session_id = req.cookies.session_id;
        const User = await getUserFromRedis(session_id);
        if(!User){
            logger.error(NAMESPACE, "Unauthorized", "authenticate");
            return next(createError.Unauthorized())
        }
        if(User.userId){
            await deleteSessionFromRedis(session_id);
            const sessionId = await generateSessionAndSaveToRedis(User.userId);
            res.cookie('session_id', sessionId, { httpOnly: true });
        }
        req.userId = User.userId;        
        next();
    }catch(error : any){        
        next(error);
    }
});

const authenticateToken = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    // try{
    //     const authHeader = req.headers['authorization'];
    //     const token = authHeader && authHeader.split(' ')[1]; // Bearer token
    //     if(!token){
    //         logger.error(NAMESPACE, "Unauthorized", "authenticateToken");
    //         return next(createError.Unauthorized())
    //     }
    //     const payload = verifyAccessToken(token);
    //     req.userId = payload;
    //     next();
    // }catch(error : any){        
    //     next(error);
    // }
});

export { authenticate,authenticateToken };