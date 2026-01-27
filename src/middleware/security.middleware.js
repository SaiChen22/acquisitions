import { slidingWindow } from '@arcjet/node';
import aj from '../config/arcjet.js';
import logger from '#config/logger.js';

const securityMiddleware = async (req, res, next) => {
    try {
        const role = req.user?.role || 'guest';
        let limit;
        let message;

        switch (role) {
            case 'admin':
                limit = 20;
                message = 'Admin rate limit exceeded';
                break;
            case 'user':
                limit = 10;
                message = 'User rate limit exceeded';
                break;
            default:
                limit = 5;
                message = 'Guest rate limit exceeded';
        }

        const client = aj.withRule(slidingWindow({ mode: 'LIVE', interval: '1m', max: limit, name: `${role}_rate_limit` }));
        const decision = await client.protect(req);
        if (decision.isDenied() && decision.reason.isBot()) {
            logger.warn('Bot request blocked:',{ip: req.ip, userAgent: req.headers['user-agent']});
            return res.status(403).json({ error: 'Forbidden', message: 'Bot traffic is not allowed' });
        }

        if (decision.isDenied() && decision.reason.isShield()) {
            logger.warn('Shield blocked request:', {ip: req.ip, userAgent: req.headers['user-agent']});
            return res.status(403).json({ error: 'Forbidden', message: 'Request blocked by security shield' });
        }
        if (decision.isDenied() && decision.reason.isRateLimit()) {
            logger.warn('Rate limit exceeded:', {ip: req.ip, userAgent: req.headers['user-agent']});
            return res.status(429).json({ error: 'Too Many Requests', message });
        }
        next();
    }

    catch (error) {
        console.error('Security middleware error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'An error occurred while processing your request.' });
    }
};

export default securityMiddleware;