import express, { Request, Response, NextFunction, Router } from 'express';
import { Document, MongooseFilterQuery } from 'mongoose';
import Author from '../models/author';
import middleware from '../utils/middlewares';
import logger from '../utils/logger';
import { authorValidation, validate } from '../utils/validator';
import { addAuthor, deleteAuthor, updateAuthor } from '../service/authors.service';

const authorsRouter: Router = express.Router();

authorsRouter.get('/',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { search, page } = req.query;
    const filterQuery: MongooseFilterQuery<Pick<Document, "_id">> = {};
    if (search) {
        filterQuery.name = {
            $regex: search,
            $options: 'i'
        }
    }

    try {
        const authors: Array<Document> = await Author.find(filterQuery)
                                                     .sort({ createdAt: -1 })
                                                     .limit(Number(page) ?? 0);
        res.json(authors);
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

authorsRouter.get('/:ssn',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const author: Document | null = await Author.findOne({ ssn: req.params.ssn });
        if (author) {
            res.json(author);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

authorsRouter.post('/',
    middleware.isLoggedIn,
    validate(authorValidation),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body: any = req.body;
    const session: Express.Session | undefined = req.session;
    try {
        const author = {
            ssn: body.ssn,
            name: body.name,
            birth: body?.birth,
            address: body?.address,
            gender: body.gender,
            uploader: session!.user.id,
        }
        const savedAuthor: Document | null = await addAuthor(author);
        if (savedAuthor) {
            res.json(savedAuthor);
        } else {
            res.status(409).send({
                error: 'ssn conflict',
            });
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

authorsRouter.delete('/:ssn',
    middleware.isLoggedIn,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const session: Express.Session | undefined = req.session;
    try {
        const deleted: Document | null = await deleteAuthor({ uploader: session!.user.id, ssn: req.params.ssn });
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

authorsRouter.put('/:ssn',
    middleware.isLoggedIn,
    validate(authorValidation),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body: any = req.body;
    const session: Express.Session | undefined = req.session;
    try {
        const author = {
            ssn: req.params.ssn,
            name: body.name,
            birth: body?.birth,
            address: body?.address,
            gender: body.gender,
            uploader: session!.user.id,
        }
        const updated: Document | null = await updateAuthor(author);
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

export default authorsRouter;