
import bcrypt from 'bcrypt';
import { db } from '#config/database.js';
import { users } from '#models/users.model.js';
import { eq } from 'drizzle-orm';
import loggers from '#config/logger.js';

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);

    }
    catch (error) {
        loggers.error('Error hashing password:', error);
        throw new Error('Password hashing failed');
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    }
    catch (error) {
        loggers.error('Error comparing password:', error);
        throw new Error('Password comparison failed');
    }
};

export const createUser = async ({name,email,password,role='user'}) => {
    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length > 0) throw new Error('User with this email already exists');
        const hashedPassword =  await hashPassword(password);
        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role
        }).returning({id:users.id,name:users.name,email:users.email,role:users.role,created_at:users.created_at});

        loggers.info(`User created with Email: ${newUser.email}`);
        return newUser;
    }
    catch (error) {
        loggers.error('Error creating user:', error);
        throw error;
    }
};

export const authenticateUser = async ({email, password}) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await comparePassword(password, user.password);
        
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        loggers.info(`User authenticated: ${user.email}`);
        return user;
    }
    catch (error) {
        loggers.error('Error authenticating user:', error);
        throw error;
    }
};