import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { Book } from '../src/types';
const api = supertest(app);

const book: Book = {
    isbn: '000000000',
    title: 'created by jest code',
    published: '2020-01-01',
    author: 'jest',
    genres: ['sample1', 'sample2'],
    rating: 1,
    description: 'no comment',
};

describe('BOOK API TEST', () => {
    test('GET: /api/books (Read a list of the entire book)', async () => {
        await api.get('/api/books')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('POST: /api/books (Create a new book)', async () => {
        await api.post('/api/books')
            .send(book)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('GET: /api/books/:isbn (Read the created book)', async () => {
        await api.get(`/api/books/${book.isbn}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('PUT: /api/books (Update the created book)', async () => {
        const updatedBook: Book = {
            ...book,
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
        await api.get(`/api/books/${book.isbn}`)
            .expect(404);
    });
});

afterAll(() => {
    mongoose.connection.close();
});