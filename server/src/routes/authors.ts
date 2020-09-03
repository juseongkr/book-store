import express, { Request, Response, NextFunction, Router } from 'express';
import { Document, MongooseFilterQuery } from 'mongoose';
import Author from '../models/author';
import middleware from '../utils/middlewares';
import logger from '../utils/logger';
import { authorValidation, validate } from '../utils/validator';

const authorsRouter: Router = express.Router();

authorsRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { search } = req.query;
    const filterQuery: MongooseFilterQuery<Pick<Document, "_id">> = {};
    if (search) {
        filterQuery.name = {
            $regex: search,
            $options: 'i'
        }
    }

    try {
        const authors: Array<Document> = await Author.find(filterQuery)
                                                     .sort({ createdAt: -1 });
        res.json(authors);
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

authorsRouter.get('/:ssn', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    middleware.isLoggedIn, validate(authorValidation),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body: any = req.body;
    const session: Express.Session | undefined = req.session;
    try {
        const duplicated: Document | null = await Author.findOne({ ssn: body.ssn });
        if (duplicated) {
            res.status(409).send({
                error: 'ssn conflict',
            });
        } else {
            const author: Document = new Author({
                ssn: body.ssn,
                name: body.name,
                gender: body.gender,
                birth: body?.birth,
                address: body?.address,
                uploader: session!.user.id,
            });
            const savedAuthor: Document = await author.save();
            res.json(savedAuthor);
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

authorsRouter.delete('/:ssn', middleware.isLoggedIn, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const session: Express.Session | undefined = req.session;
    try {
        const deleted: Document | null = await Author.findOneAndDelete({ uploader: session!.user.id, ssn: req.params.ssn });
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
    middleware.isLoggedIn, validate(authorValidation),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body: any = req.body;
    const session: Express.Session | undefined = req.session;
    try {
        const author: Document = {
            ...body,
        };
        const updated: Document | null = await Author.findOneAndUpdate({ uploader: session!.user.id, ssn: req.params.ssn }, author, { new: true });
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