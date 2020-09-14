import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { test_user as user, test_book as book } from '../src/utils/test.data';
const api = supertest.agent(app);

beforeAll(async () => {
    const response = await api.post('/api/auth/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    expect(response.get('set-cookie')[0]).toContain('session-cookie');
});

describe('BOOK API TEST', () => {
    test('GET: /api/books (Read a list of the entire book)', async () => {
        await api.get('/api/books')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('POST: /api/books (Create a new book)', async () => {
        const { text: createdBook } = await api.post('/api/books')
            .send(book)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        
        expect(createdBook).toContain(book.title);
    });

    test('GET: /api/books/:isbn (Read the created book)', async () => {
        const { text: createdBook } = await api.get(`/api/books/${book.isbn}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        
        expect(createdBook).toContain(book.title);
    });

    test('PUT: /api/books/:isbn (Update the created book)', async () => {
        const { text: createdBook } = await api.get(`/api/books/${book.isbn}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        
        const updatedBook = {
            ...JSON.parse(createdBook),
            rating: 5,
        }

        await api.put(`/api/books/${updatedBook.isbn}`)
            .send(updatedBook)
            .expect(200);
    });

    test('DELETE: /api/books (Delete the created book)', async () => {
        await api.delete(`/api/books/${book.isbn}`)
            .expect(204);
    });

    test('GET: /api/books/:isbn (Check if the book has been deleted)', async () => {
        const { text: createdBook } = await api.get(`/api/books/${book.isbn}`)
            .expect(404);
        
        expect(createdBook).toBeFalsy();
    });
});

afterAll(async () => {
    const { header: response } = await api.post('/api/auth/logout')
        .send(user)
        .expect(302);

    expect(response['set-cookie'][0]).toContain('session-cookie=;');
    mongoose.connection.close();
});