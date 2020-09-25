import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { User } from '../src/types';
import UserSchema from '../src/models/user.model';
import { temp_user as user } from '../src/utils/test.data';
const api = supertest.agent(app);

describe('AUTH API TEST: Register', () => {
    test('POST: /api/auth/register (Register a new user)', async () => {
        const { text: response } = await api.post('/api/auth/register')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response).toContain(user.username);
    });

    test('POST: /api/auth/register (Conflicted username)', async () => {
        const { text: response } = await api.post('/api/auth/register')
            .send(user)
            .expect(409)
            .expect('Content-Type', /application\/json/);

        expect(response).toContain('username conflict');
    });

    test('POST: /api/auth/register (Missing information)', async () => {
        const { text: response } = await api.post('/api/auth/register')
            .send({ username: 'auth_testing', password: '' })
            .expect(401)
            .expect('Content-Type', /application\/json/);

        expect(response).toContain('Invalid value');
    });
});

describe('AUTH API TEST: Login', () => {
    test('POST: /api/auth/login (Missing information)', async () => {
        const { text: response } = await api.post('/api/auth/login')
            .send({ username: '', password: '' })
            .expect(401)
            .expect('Content-Type', /application\/json/);

        expect(response).toContain('Invalid value');
    });

    test('POST: /api/auth/login (Invalid username)', async () => {
        const { text: response } = await api.post('/api/auth/login')
            .send({ username: 'invalid username', password: 'invalid password' })
            .expect(401)
            .expect('Content-Type', /application\/json/);

        expect(response).toContain('Invalid value');
    });

    test('POST: /api/auth/login (Invalid password)', async () => {
        const invalidPassword: User = {
            ...user,
            password: 'invalid password',
        };

        const { text: response } = await api.post('/api/auth/login')
            .send(invalidPassword)
            .expect(401)
            .expect('Content-Type', /application\/json/);

        expect(response).toContain('Unauthorized access');
    });

    test('POST: /api/auth/login (Authorized access)', async () => {
        const response = await api.post('/api/auth/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.text).toContain(user.username);
        expect(response.get('set-cookie')[0]).toContain('session-cookie');
    });
});

describe('AUTH API TEST: Check logged in', () => {
    test('GET: /api/auth/check (Checking authentication)', async () => {
        const response = await api.get('/api/auth/check')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.text).toContain(user.username);
    });
});

describe('AUTH API TEST: Logout', () => {
    test('POST /api/auth/logout (Authorized logout)', async () => {
        const { header: response } = await api.post('/api/auth/logout')
            .send(user)
            .expect(302);

        expect(response['set-cookie'][0]).toContain('session-cookie=;');
    });
});

describe('AUTH API TEST: Check not logged in', () => {
    test('GET: /api/auth/check (Checking authentication)', async () => {
        await api.get('/api/auth/check')
            .expect(401);
    });
});

describe('AUTH API TEST: Unregister', () => {
    test('POST: /api/auth/login (Authorized access)', async () => {
        const response = await api.post('/api/auth/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.text).toContain(user.username);
        expect(response.get('set-cookie')[0]).toContain('session-cookie');
    });

    test('DELETE: /api/auth/unregister (Delete user account)', async () => {
        const { header: response } = await api.delete('/api/auth/unregister')
            .send(user)
            .expect(204);

        expect(response['set-cookie'][0]).toContain('session-cookie=;');
    });

    test('POST: /api/auth/login (Unauthorized access)', async () => {
        const response = await api.post('/api/auth/login')
            .send(user)
            .expect(401)
            .expect('Content-Type', /application\/json/);

        expect(response.text).toContain('Unauthorized access');
    });
});

afterAll(async () => {
    try {
        await UserSchema.findOneAndDelete({ username: user.username });
    } catch (err) {
        console.error(err);
    }
    mongoose.connection.close();
});