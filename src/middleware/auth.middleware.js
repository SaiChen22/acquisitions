import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';

export const authenticate = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication token is required',
      });
    }

    // Verify token
    const decoded = jwttoken.verify(token);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

export const optionalAuthenticate = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        // Verify token
        const decoded = jwttoken.verify(token);

        // Attach user info to request
        req.user = decoded;
      } catch (error) {
        // Token is invalid, but we don't fail - just continue without user
        logger.warn('Invalid token in optionalAuthenticate:', error.message);
      }
    }

    next();
  } catch (error) {
    logger.error('Optional authentication error:', error);
    next();
  }
};
