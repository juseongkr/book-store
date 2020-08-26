import express, { Request, Response, NextFunction, Router } from 'express';
import { Document } from 'mongoose';
import Book from '../models/book';
import User from '../models/user';
import middleware from '../utils/middlewares';
import logger from '../utils/logger';

const booksRouter: Router = express.Router();

booksRouter.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const books: Array<Document> = await Book.find({}).sort({ createdAt: -1 });
        res.json(books);
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

booksRouter.get('/:isbn', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

booksRouter.post('/', middleware.isLoggedIn, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body: any = req.body;
    const session: Express.Session | undefined = req.session;
    try {
        const book: Document = new Book({
            isbn: body.isbn,
            title: body.title,
            published: body.published,
            author: body.author,
            genres: body.genres,
            rating: body?.rating,
            description: body?.description,
            uploader: session!.user.id,
        });
        
        const savedBook: Document = await book.save();
        await User.findByIdAndUpdate(session!.user.id, {
            $addToSet: { books: savedBook }
        }, { new: true });
        logger.info('book create: ' + body.isbn);
        res.json(savedBook);
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

booksRouter.delete('/:isbn', middleware.isLoggedIn, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const session: Express.Session | undefined = req.session;
    try {
        const deleted: Document | null = await Book.findOneAndDelete({ uploader: session!.user.id, isbn: req.params.isbn });
        if (deleted) {
            await User.findByIdAndUpdate(session!.user.id, {
                $pull: { books: deleted!.get('id') }
            });
            logger.info('book delete: ' + req.params.isbn);
            res.status(204).end();
        } else {
            res.status(400).end();
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

booksRouter.put('/:isbn', middleware.isLoggedIn, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body: any = req.body;
    const session: Express.Session | undefined = req.session;
    try {
        const book: Document = {
            ...body,
        };
        const updated: Document | null = await Book.findOneAndUpdate({ uploader: session!.user.id, isbn: req.params.isbn }, book, { new: true });
        if (updated) {
            logger.info('book update: ' + req.params.isbn);
            res.status(204).end();
        } else {
            res.status(400).end();
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

export default booksRouter;