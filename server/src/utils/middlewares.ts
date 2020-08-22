import { Request, Response, NextFunction } from 'express';
import logger from "./logger";

const unknownEndpoint = (_req: Request, res: Response): void => {
    res.status(404).send({ error: 'unknownEndpoint' });
};

const errorHandler = (err: any, _req: Request, res: Response, next: NextFunction): void => {
    if (err.name === 'CaseError' && err.kind === 'ObjectId') {
        res.status(400).send({ error: 'malformatted id' });
    } else if (err.name === 'ValidationError') {
        res.status(400).end({ error: err.message });
    } else {
        logger.error(err);
        next(err);
    }
};

const isLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
    const session: Express.Session | undefined = req.session;
    if (session?.user) {
        next();
    } else {
        res.status(401).send({ error: 'unauthorized access' });
    }
};

const isNotLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
    const session: Express.Session | undefined = req.session;
    if (session?.user) {
        res.status(401).send({ error: 'unauthorized access' });
    } else {
        next();
    }
};

export default { unknownEndpoint, errorHandler, isLoggedIn, isNotLoggedIn };