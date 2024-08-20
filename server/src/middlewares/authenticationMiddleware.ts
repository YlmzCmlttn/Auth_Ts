import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import logger from '@src/config/logger';
import { getUserFromRedis } from '@src/db/redisQuaries';
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
        req.userId = User.userId;
        next();
    }catch(error : any){        
        next(error);
    }
});

export { authenticate };