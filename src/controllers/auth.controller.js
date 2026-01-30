import logger from '#config/logger.js';
import { signupSchema, signinSchema } from '../validations/auth.validation.js';
import { formatValidationErrors } from '../utils/format.js';
import { createUser, authenticateUser } from '../services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import jwttoken from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res
        .status(400)
        .json({
          error: 'Validation Error',
          details: formatValidationErrors(validationResult.error),
        });
    }

    const { name, email, password, role } = validationResult.data;

    const user = await createUser({ name, email, password, role });

    const token = jwttoken.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    cookies.set(res, 'token', token);

    logger.info(`User signed up: Name=${name}, Email=${email}, Role=${role}`);
    res.status(201).json({
      message: 'User signed up successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    logger.error('Error in signup controller:', error);
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res
        .status(400)
        .json({
          error: 'Validation Error',
          details: formatValidationErrors(validationResult.error),
        });
    }

    const { email, password } = validationResult.data;

    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    cookies.set(res, 'token', token);

    logger.info(`User signed in: Email=${email}`);
    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error in signin controller:', error);
    if (
      error.message === 'User not found' ||
      error.message === 'Invalid password'
    ) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');

    logger.info('User signed out');
    res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (error) {
    logger.error('Error in signout controller:', error);
    next(error);
  }
};
