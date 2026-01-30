import logger from '#config/logger.js';
import pkg from 'jsonwebtoken';

const { sign, verify } = pkg;

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-please-change-this-in-production';
const JWT_EXPIRES_IN = '1d';

export const jwttoken = {
  sign: payload => {
    try {
      return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      logger.error('Error signing JWT:', error);
      throw error;
    }
  },

  verify: token => {
    try {
      return verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Error verifying JWT:', error);
      throw error;
    }
  },
};
