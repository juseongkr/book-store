import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { Author, Gender } from '../src/types';
const api = supertest(app);

const author: Author = {
    ssn: '000000000',
    name: 'created by jest code',
    birth: '2020-01-01',
    address: 'undefined',
    gender: Gender.Other,
};

describe('AUTHOR API TEST', () => {
    test('GET: /api/authors (Read a list of the entire author)', async () => {
        await api.get('/api/authors')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('POST: /api/authors (Create a new author)', async () => {
        await api.post('/api/authors')
            .send(author)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('GET: /api/authors/:ssn (Read the created author)', async () => {
        await api.get(`/api/authors/${author.ssn}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('PUT: /api/authors (Update the created author)', async () => {
        const updatedAuthor: Author = {
            ...author,
            address: 'updated address',
        }

        await api.put(`/api/authors/${updatedAuthor.ssn}`)
            .send(updatedAuthor)
            .expect(204);
    });

    test('DELETE: /api/authors (Check if the author has been deleted)', async () => {
        await api.delete(`/api/authors/${author.ssn}`)
            .expect(204);
    });

    test('GET: /api/authors/:ssn', async () => {
        await api.get(`/api/authors/${author.ssn}`)
            .expect(404);
    });
});

afterAll(() => {
    mongoose.connection.close();
});