import request from 'supertest';
import app from '#src/app.js';
import { describe, it, expect } from '@jest/globals';


describe('API Endpoints', () => {
    describe('GET /health', () => {
        it('should return status OK', async () => {
            // Test implementation here
            const response = await request(app).get('/health').expect(200);
            expect(response.body).toHaveProperty('status', 'OK');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
        });
    });

    describe('GET /api', () => {
        it('should return API message', async () => {
            const response= await request(app).get('/api').expect(200);
            expect(response.body).toHaveProperty('message', 'Acquisitions Service API');
            expect(response.body).toHaveProperty('version', '1.0.0');
        }
        );
    });

    describe('GET /nonexistent', () => {
        it('should return 404 Not Found', async () => {
            const response = await request(app).get('/nonexistent').expect(404);
            expect(response.body).toHaveProperty('error', 'Not Found');
            expect(response.body).toHaveProperty('message', 'The requested resource was not found');
        });
    });
});