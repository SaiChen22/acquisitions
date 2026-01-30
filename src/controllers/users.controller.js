import logger from '#config/logger.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '#services/user.service.js';
import { userIdSchema, updateUserSchema } from '#validations/users.validation.js';


export const fetchAllUsers = async (req,res,next) => {
    try{

        logger.info('Fetching all users');
        const users = await getAllUsers();
        res.json({
            message: 'Users fetched successfully',
            users,
            count: users.length

        });

    }
    catch(e){
        logger.error('Error in getAllUsers controller:', e);
        next(e);
    }
};

export const fetchUserById = async (req, res, next) => {
    try {
        logger.info('Fetching user by ID');
        
        // Validate request params
        const { id } = userIdSchema.parse(req.params);

        const user = await getUserById(id);

        res.json({
            message: 'User fetched successfully',
            user
        });

    } catch (e) {
        if (e.name === 'ZodError') {
            logger.error('Validation error in fetchUserById:', e.errors);
            return res.status(400).json({
                error: 'Validation failed',
                details: e.errors
            });
        }
        logger.error('Error in fetchUserById controller:', e);
        next(e);
    }
};

export const updateUserById = async (req, res, next) => {
    try {
        logger.info('Updating user');

        // Validate request params
        const { id } = userIdSchema.parse(req.params);

        // Validate request body
        const updates = updateUserSchema.parse(req.body);

        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'You must be logged in to update user information'
            });
        }

        // Check if user is updating their own info or is an admin
        if (req.user.id !== id && req.user.role !== 'admin') {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only update your own information'
            });
        }

        // Only admins can change roles
        if (updates.role && req.user.role !== 'admin') {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Only admins can change user roles'
            });
        }

        const updatedUser = await updateUser(id, updates);

        res.json({
            message: 'User updated successfully',
            user: updatedUser
        });

    } catch (e) {
        if (e.name === 'ZodError') {
            logger.error('Validation error in updateUserById:', e.errors);
            return res.status(400).json({
                error: 'Validation failed',
                details: e.errors
            });
        }
        logger.error('Error in updateUserById controller:', e);
        next(e);
    }
};

export const deleteUserById = async (req, res, next) => {
    try {
        logger.info('Deleting user');

        // Validate request params
        const { id } = userIdSchema.parse(req.params);

        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'You must be logged in to delete a user'
            });
        }

        // Check if user is deleting their own account or is an admin
        if (req.user.id !== id && req.user.role !== 'admin') {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only delete your own account'
            });
        }

        const result = await deleteUser(id);

        res.json({
            message: 'User deleted successfully',
            result
        });

    } catch (e) {
        if (e.name === 'ZodError') {
            logger.error('Validation error in deleteUserById:', e.errors);
            return res.status(400).json({
                error: 'Validation failed',
                details: e.errors
            });
        }
        logger.error('Error in deleteUserById controller:', e);
        next(e);
    }
};