import express from 'express';
import Book from '../models/book';

const booksRouter = express.Router();

booksRouter.get('/', async (_req, res, next) => {
    try {
        const books = await Book.find({});
        res.json(books);
    } catch (err) {
        next(err);
    }
});

booksRouter.get('/:isbn', async (req, res, next) => {
    try {
        const book = await Book.findOne({ isbn: req.params.isbn });
        if (book) {
            res.json(book);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        next(err);
    }
});

booksRouter.post('/', async (req, res, next) => {
    const body = req.body;
    try {
        const book = new Book({
            isbn: body.isbn,
            title: body.title,
            published: body.published,
            author: body.author,
            genres: body.genres,
            rating: body?.rating,
            description: body?.description,
        });
        
        const savedBook = await book.save();
        res.json(savedBook);
    } catch (err) {
        next(err);
    }
});

booksRouter.delete('/:isbn', async (req, res, next) => {
    try {
        await Book.findOneAndRemove({ isbn: req.params.isbn });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

booksRouter.put('/:isbn', async (req, res, next) => {
    const body = req.body;
    try {
        const book = {
            ...body,
        };
        await Book.findOneAndUpdate({ isbn: body.isbn }, book, { new: true });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

export default booksRouter;