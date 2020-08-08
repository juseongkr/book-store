import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';

const unknownEndpoint = (_req: any, res: any): void => {
    res.status(404).send({ error: 'unknownEndpoint' });
};

const errorHandler = (err: any, _req: any, res: any, next: any): void => {
    if (err.name === 'CaseError' && err.kind === 'ObjectId') {
        res.status(400).send({ error: 'malformatted id' });
    } else if (err.name == 'ValidationError') {
        res.status(400).end({ error: err.message });
    } else {
        next(err);
    }
};

const jwtHandler = (req: any, _res: any, next: any) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next();
    }
    try {
        req.body.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        next(err);
    }
};

const isLoggedIn = (req: any, res: any, next: any): void => {
    const token = req.cookies.access_token;
    if (token) {
        next();
    } else {
        res.status(401).send({ error: 'unauthorized access' });
    }
};

export default { unknownEndpoint, errorHandler, jwtHandler, isLoggedIn };