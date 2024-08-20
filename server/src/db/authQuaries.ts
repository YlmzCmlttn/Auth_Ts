import { PostgreSQLHelper } from '@src/config/db';

const isEmailExistsInDb = async (email: string) => {
    const existingUsers = await PostgreSQLHelper.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUsers.length > 0) {
        return true;
    }
    return false;
}
const isUserNameExistsInDb = async (username: string) => {
    const existingUsernames =await PostgreSQLHelper.query('SELECT id FROM users WHERE username = $1', [username]);
    if(existingUsernames.length > 0){
        return true;
    }
    return false;
}

const getUserWithEmailFromDb = async (email: string) => {
    const user = await PostgreSQLHelper.query('SELECT * FROM users WHERE email = $1', [email]);
    if(user.length > 0){
        return user[0];
    }
    return null;
}

const getUserWithIDFromDb = async (id: string) => {
    const user = await PostgreSQLHelper.query('SELECT * FROM users WHERE id = $1', [id]);
    if(user.length > 0){
        return user[0];
    }
    return null;
}


const getUserWithUsernameFromDb = async (username: string) => {
    const user = await PostgreSQLHelper.query('SELECT * FROM users WHERE username = $1', [username]);
    if(user.length > 0){
        return user[0];
    }
    return null;
}

const saveUserToDb = async (fullname: string, email: string, hashedPassword: string, username: string) => {    
    try {
        await PostgreSQLHelper.query('BEGIN');
        const newUser = await PostgreSQLHelper.query(
            'INSERT INTO users(email, username, fullname, password, role) VALUES($1, $2, $3, $4, $5) RETURNING id',
            [email, username, fullname, hashedPassword, 'User'] // Assuming the default role is 'Patient'
        );
        await PostgreSQLHelper.query('COMMIT');
        return newUser[0];
    }catch (error) {
        await PostgreSQLHelper.query('ROLLBACK');
        throw error;
    }
};
export{
    isEmailExistsInDb,
    isUserNameExistsInDb,
    saveUserToDb,
    getUserWithEmailFromDb,
    getUserWithUsernameFromDb,
    getUserWithIDFromDb
};