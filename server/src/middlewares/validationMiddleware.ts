import asyncHandler from 'express-async-handler';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import logger from '@src/config/logger';

const NAMESPACE = 'ValidationMiddleware';

const validate = (schema: Joi.ObjectSchema) => asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    try{
        req.validatedBody = await schema.validateAsync(req.body);
        next();
    }catch(error : any){
        logger.error(NAMESPACE, error.message);
        next(error);
    }
});

export { validate };