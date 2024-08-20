
import express from 'express';
import webAuthRoutes from './webAuthRoutes'
import mobileAuthRoutes from './mobileAuthRoutes'


const router = express.Router();
router.use('',webAuthRoutes);
router.use('/mobile',mobileAuthRoutes);
export default router;