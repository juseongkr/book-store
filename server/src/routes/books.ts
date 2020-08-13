import express from 'express';
import Book from '../models/book';
import middleware from '../utils/middlewares';

const booksRouter = express.Router();

booksRouter.get('/', async (_req, res, next) => {
    try {
        const books = await Book.find({}).sort({ createdAt: -1 });
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

booksRouter.post('/', middleware.isLoggedIn, async (req, res, next) => {
    const body = req.body;
    const session = req.session;
    try {
        const book = new Book({
            isbn: body.isbn,
            title: body.title,
            published: body.published,
            author: body.author,
            genres: body.genres,
            rating: body?.rating,
            description: body?.description,
            uploader: session!.user.id,
        });
        
        const savedBook = await book.save();
        res.json(savedBook);
    } catch (err) {
        next(err);
    }
});

booksRouter.delete('/:isbn', middleware.isLoggedIn, async (req, res, next) => {
    const session = req.session;
    try {
        const deleted = await Book.findOneAndDelete({ uploader: session!.user.id, isbn: req.params.isbn });
        if (deleted) {
            res.status(204).end();
        } else {
            res.status(400).end();
        }
    } catch (err) {
        next(err);
    }
});

booksRouter.put('/:isbn', middleware.isLoggedIn, async (req, res, next) => {
    const body = req.body;
    const session = req.session;
    try {
        const book = {
            ...body,
        };
        const updated = await Book.findOneAndUpdate({ uploader: session!.user.id, isbn: req.params.isbn }, book, { new: true });
        if (updated) {
            res.status(204).end();
        } else {
            res.status(400).end();
        }
    } catch (err) {
        next(err);
    }
});

export default booksRouter;