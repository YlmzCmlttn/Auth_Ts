
import express from 'express';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import authRoutes from './auth'


const router = express.Router();


router.use(asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/mobile')) {
        req.isMobile = true;
        req.url = req.url.replace('/mobile', ''); // Adjust the path to match the route definitions
    }else{
        req.isMobile = false;
    }
    next();
}));

router.use('/auth',authRoutes);
export default router;