import express from 'express';
import { fetchAllUsers, fetchUserById, updateUserById, deleteUserById } from '#controllers/users.controller.js';
import { authenticate } from '#middleware/auth.middleware.js';

const router = express.Router();

// Public route - get all users
router.get('/', fetchAllUsers);

// Public route - get user by ID
router.get('/:id', fetchUserById);

// Protected routes - require authentication
router.put('/:id', authenticate, updateUserById);
router.delete('/:id', authenticate, deleteUserById);

export default router;
