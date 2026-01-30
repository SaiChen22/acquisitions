import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/users.model.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from '#services/auth.service.js';

export const getAllUsers = async () => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);

    return allUsers;
  } catch (e) {
    logger.error('Error in getAllUsers:', e);
    throw e;
  }
};

export const getUserById = async id => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (e) {
    logger.error('Error in getUserById:', e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      throw new Error('User not found');
    }

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    // Add updated_at timestamp
    updates.updated_at = new Date();

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    logger.info(`User updated: ${updatedUser.email}`);
    return updatedUser;
  } catch (e) {
    logger.error('Error in updateUser:', e);
    throw e;
  }
};

export const deleteUser = async id => {
  try {
    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Delete user
    await db.delete(users).where(eq(users.id, id));

    logger.info(`User deleted with ID: ${id}`);
    return { id, message: 'User deleted successfully' };
  } catch (e) {
    logger.error('Error in deleteUser:', e);
    throw e;
  }
};
