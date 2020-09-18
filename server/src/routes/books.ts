import express, { Request, Response, NextFunction, Router } from 'express';
import { Document, MongooseFilterQuery } from 'mongoose';
import Book from '../models/book';
import middleware from '../utils/middlewares';
import logger from '../utils/logger';
import { bookValidation, validate } from '../utils/validator';
import { addBook, deleteBook, updateBook } from '../service/books.service';

const booksRouter: Router = express.Router();

booksRouter.get('/',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { search, genre, page } = req.query;
    const filterQuery: MongooseFilterQuery<Pick<Document, "_id">> = {};
    if (search) {
        filterQuery.title = {
            $regex: search,
            $options: 'i'
        }
    }
    if (genre) {
        filterQuery.genres = {
            $in: genre.toString().toLowerCase().split(','),
        }
    }

    try {
        const books: Array<Document> = await Book.find(filterQuery)
                                                 .sort({ createdAt: -1 })
                                                 .limit(Number(page) ?? 0);
        res.json(books);
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

booksRouter.get('/:isbn',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const book: Document | null = await Book.findOne({ isbn: req.params.isbn });
        if (book) {
            res.json(book);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

booksRouter.post('/',
    middleware.isLoggedIn,
    validate(bookValidation),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body: any = req.body;
    const session: Express.Session | undefined = req.session;
    try {
        const book = {
            isbn: body.isbn,
            title: body.title,
            published: body.published,
            author: body.author,
            genres: body.genres,
            rating: body?.rating,
            description: body?.description,
            uploader: session!.user.id,
        };
        const savedBook: Document | null = await addBook(book);
        if (savedBook) {
            res.json(savedBook);
        } else {
            res.status(409).send({
                error: 'isbn conflict',
            });
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

booksRouter.delete('/:isbn',
    middleware.isLoggedIn,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const session: Express.Session | undefined = req.session;
    try {
        const deleted: Document | null = await deleteBook({ uploader: session!.user.id, isbn: req.params.isbn });
        if (deleted) {
            res.status(204).end();
        } else {
            res.status(400).end();
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

booksRouter.put('/:isbn',
    middleware.isLoggedIn,
    validate(bookValidation),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body: any = req.body;
    const session: Express.Session | undefined = req.session;
    try {
        const book = {
            isbn: req.params.isbn,
            title: body.title,
            published: body.published,
            author: body.author,
            genres: body.genres,
            rating: body?.rating,
            description: body?.description,
            uploader: session!.user.id,
        };

        const updated: Document | null = await updateBook(book);
        if (updated) {
            res.status(200).end();
        } else {
            res.status(400).end();
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

export default booksRouter;