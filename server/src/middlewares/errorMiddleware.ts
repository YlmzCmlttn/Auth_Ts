import { ErrorRequestHandler, RequestHandler, Request, Response, NextFunction } from 'express';

class NotFoundError extends Error {
    statusCode = 404;
    constructor(uri: string,message?: string) {
        super(`${uri} not found.` + (message ? ` ${message}` : ""));
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

const notFound: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const error = new NotFoundError(req.originalUrl,"Check your URL");
    error.statusCode = 404;
    next(error);
};

const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode === 200 ? 500 : err.statusCode || 500;
    let message = err.message;
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }
    if(err.isJoi === true){
        statusCode = 422;
    }

    res.status(statusCode).json({
        status: statusCode,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

export { notFound, errorHandler };
