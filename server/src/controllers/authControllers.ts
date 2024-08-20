import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import createError from 'http-errors';
import {
    isEmailExistsInDb,
    isUserNameExistsInDb,
    saveUserToDb,
    getUserWithEmailFromDb,
    getUserWithUsernameFromDb,
    getUserWithIDFromDb
} from '@src/db/authQuaries'

import { 
    generateSessionAndSaveToRedis,
    deleteSessionFromRedis 
} from '@src/db/redisQuaries';

import logger from '@src/config/logger';
const NAMESPACE = 'AuthController';

const registerController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {    
    //Chech user is already there (db);
    const {email,password} = req.validatedBody;
    if(await isEmailExistsInDb(email)){
        logger.error(NAMESPACE, "Email already registered: " + JSON.stringify({email}), "registerUser");
        throw createError.Conflict(`${email} is already registered`);
    }
    let userCount = 0;
    let username = email.split('@')[0];
    username = username.replace(/[^a-zA-Z0-9]/g, '_');
    let final_username = username;
    while(await isUserNameExistsInDb(final_username)){
        final_username = `${username}${++userCount}`;
    }
    username = final_username;
    const salt = await bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const newUser = await saveUserToDb(username,email,hashedPassword,username);
    const sessionId = await generateSessionAndSaveToRedis(newUser.id);
    res.cookie('session_id', sessionId, { httpOnly: true });
    res.status(201).json({
        message: "User created successfully",
        user: {
            id: newUser.id,
            username: username
        }
    });
});

const loginController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { login, password } = req.validatedBody;
    let user;
    
    if (login.includes('@')) {
        user = await getUserWithEmailFromDb(login);
        if (!user) {
            throw createError.Unauthorized('Invalid email or password');
        }
    } else {
        user = await getUserWithUsernameFromDb(login);
        if (!user) {
            throw createError.Unauthorized('Invalid username or password');
        }
    }

    // Validate the password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw createError.Unauthorized('Invalid email or password');
    }

    const sessionId = await generateSessionAndSaveToRedis(user.id);
    res.cookie('session_id', sessionId, { httpOnly: true });

    res.status(200).json({
        message: "Login successful",
        user: {
            username: user.username,
            role: user.role
        }
    });
});

const logoutController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {    
    const sessionId = req.cookies.session_id;
        
    if(!await deleteSessionFromRedis(sessionId)){
        res.status(400).json({ message: 'Not logged in' });
    }else{
        res.clearCookie('session_id');
        res.status(200).json({ message: 'Logout successful' });
    }
});

const getMeController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if(!req.userId){
        throw createError.InternalServerError('User not found');
    }
    const user = await getUserWithIDFromDb(req.userId);
    if(!user){
        throw createError.InternalServerError('User not found');
    }
    res.status(200).json({
        user: {
            username: user.username,
            fullname: user.fullname
        }
    });
});

export{
    registerController,
    loginController,
    logoutController,
    getMeController

};