
import { RedisHelper } from '@src/config/redis';
import { v4 as uuidv4 } from 'uuid'; // For generating unique session identifiers

const generateSessionAndSaveToRedis= async (userId: number) => {
    const sessionId = uuidv4(); // Generate a unique session identifier
    await RedisHelper.set(`sess:${sessionId}`, JSON.stringify({ userId}), 3600);
    return sessionId;
};

const deleteSessionFromRedis = async (sessionId: string) => {
    try {
        if(await RedisHelper.get(`sess:${sessionId}`)){
            await RedisHelper.del(`sess:${sessionId}`);
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

const getUserFromRedis = async (sessionId: string) => {
    try {
        const session = await RedisHelper.get(`sess:${sessionId}`);
        if(session){
            return JSON.parse(session);
        }
        return null;
    } catch (error) {
        return null;
    }
};

export{
    generateSessionAndSaveToRedis,
    deleteSessionFromRedis,
    getUserFromRedis
}