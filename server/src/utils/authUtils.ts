// src/utils/authUtils.ts
import jwt from 'jsonwebtoken';
import env from '@src/config/env'

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;

interface JwtPayload {
    userId: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); // Access token expires in 15 minutes
};

export const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Refresh token expires in 7 days
};

export const verifyAccessToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    } catch (error) {
        throw new Error('Invalid access token');
    }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};
