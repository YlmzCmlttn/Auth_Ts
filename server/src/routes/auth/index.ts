import express from 'express'

import { 
    registerController,loginController,logoutController,getMeController
} from '@src/controllers/authControllers';

import { 
    registerValidatorScheme,loginValidatorScheme
} from '@src/validators/authValidators';

import {
    validate
} from '@src/middlewares/validationMiddleware';

import { authenticate } from '@src/middlewares/authenticationMiddleware';

const router = express.Router();

router.post('/register',validate(registerValidatorScheme),registerController);
router.post('/login',validate(loginValidatorScheme),loginController);
router.post('/logout',logoutController);
router.get('/me',authenticate,getMeController);
export default router;