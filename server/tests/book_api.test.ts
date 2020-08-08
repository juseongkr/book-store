import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { Book, User } from '../src/types';
const api = supertest.agent(app);

const book: Book = {
    isbn: '000000000',
    title: 'created by jest code',
    published: '2020-01-01',
    author: 'jest',
    genres: ['sample1', 'sample2'],
    rating: 1,
    description: 'no comment',
    uploader: '',
};

const user: User = {
    username: 'tester',
    password: 'tester1234',
    name: 'api tester',
};

beforeAll(async () => {
    const response = await api.post('/api/auth/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    expect(response.get('set-cookie')[0]).toContain('access_token');
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
            .expect(204);
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

    expect(response['set-cookie'][0]).toContain('access_token=;');
    mongoose.connection.close();
});