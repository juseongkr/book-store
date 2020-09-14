import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { Author } from '../src/types';
import { test_user as user, test_author as author } from '../src/utils/test.data';
const api = supertest.agent(app);


beforeAll(async () => {
    const response = await api.post('/api/auth/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.get('set-cookie')[0]).toContain('session-cookie');
});

describe('AUTHOR API TEST', () => {
    test('GET: /api/authors (Read a list of the entire author)', async () => {
        await api.get('/api/authors')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('POST: /api/authors (Create a new author)', async () => {
        const { text: createdAuthor } = await api.post('/api/authors')
            .send(author)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(createdAuthor).toContain(author.ssn);
    });

    test('GET: /api/authors/:ssn (Read the created author)', async () => {
        const { text: createdAuthor } = await api.get(`/api/authors/${author.ssn}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(createdAuthor).toContain(author.ssn);
    });

    test('PUT: /api/authors (Update the created author)', async () => {
        const { text: createdAuthor } = await api.get(`/api/authors/${author.ssn}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const updatedAuthor: Author = {
            ...JSON.parse(createdAuthor),
            address: 'updated address',
        }

        await api.put(`/api/authors/${updatedAuthor.ssn}`)
            .send(updatedAuthor)
            .expect(200);
    });

    test('DELETE: /api/authors (Check if the author has been deleted)', async () => {
        await api.delete(`/api/authors/${author.ssn}`)
            .expect(204);
    });

    test('GET: /api/authors/:ssn', async () => {
        const { text: createdAuthor } = await api.get(`/api/authors/${author.ssn}`)
            .expect(404);
        
        expect(createdAuthor).toBeFalsy();
    });

});

afterAll(async () => {
    const { header: response } = await api.post('/api/auth/logout')
        .send(user)
        .expect(302);

    expect(response['set-cookie'][0]).toContain('session-cookie=;');
    mongoose.connection.close();
});
