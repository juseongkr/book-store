import express, { Request, Response, NextFunction, Router } from 'express';
import { Document } from 'mongoose';
import User from '../models/user';
import middleware from '../utils/middlewares';
import logger from '../utils/logger';
import { userValidation, validate } from '../utils/validator';
import { hashPassword, updateUserInfo, validateUserPassword } from '../service/auth.service';

const authRouter: Router = express.Router();

authRouter.get('/check',
    middleware.isLoggedIn,
    (req: Request, res: Response): void => {
    const session: Express.Session | undefined = req.session;
    if (session?.user) {
        res.json({ username: session.user.username, name: session.user.name, id: session.user.id });
    } else {
        res.status(401).end();
    }
});

authRouter.post('/register',
    middleware.isNotLoggedIn,
    validate(userValidation),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password, name } = req.body;

    try {
        const user: Document | null = await User.findOne({ username });
        if (user) {
            res.status(409).json({
                error: 'username conflict',
            });
            return;
        }

        await new User({
            password: await hashPassword(password),
            username,
            name,
        }).save();

        res.json({ username, name });
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

authRouter.post('/login',
    middleware.isNotLoggedIn,
    validate(userValidation),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;

    try {
        const user: Document | null = await validateUserPassword({ username, password });
        if (!user) {
            res.status(401).json({
                error: 'Unauthorized access',
            });
            return;
        }

        const updated: Document | null = await updateUserInfo({ username }, {
            ...user.toJSON(),
            ip_address: req.ip,
            last_login: new Date().toISOString(),
        });
        if (updated) {
            req.session!.user = {
                id: user.get('id'),
                name: user.get('name'),
                username,
            };
        }

        res.json({ username, name: user.get('name') });
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

authRouter.post('/logout',
    middleware.isLoggedIn,
    (req: Request, res: Response, next: NextFunction): void => {
    req.session!.destroy(err => {
        if (err) {
            logger.error(err);
            next();
        } else {
            res.clearCookie('session-cookie').redirect('/');
        }
    });
});

authRouter.put('/reset',
    middleware.isLoggedIn,
    validate(userValidation),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password, oldPassword, name } = req.body;

    try {
        const user: Document | null = await validateUserPassword({ username, password: oldPassword });
        if (!user) {
            res.status(401).json({
                error: 'Unauthorized access',
            });
            return;
        }

        const updated: Document | null = await updateUserInfo({ username }, {
            ...user.toJSON(),
            password: await hashPassword(password),
            name,
        });
        if (updated) {
            req.session!.destroy(err => {
                if (err) {
                    logger.error(err);
                    next();
                } else {
                    res.clearCookie('session-cookie').end();
                }
            });
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

authRouter.delete('/unregister',
    middleware.isLoggedIn,
    validate(userValidation),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;
    try {

        const user: Document | null = await validateUserPassword({ username, password });
        if (!user) {
            res.status(401).json({
                error: 'Unauthorized access',
            });
            return;
        }

        const deleted: Document | null = await updateUserInfo({ username }, {
            ...user.toJSON(),
            deactivated: true,
        });
        if (deleted) {
            req.session!.destroy(err => {
                if (err) {
                    logger.error(err);
                    next();
                } else {
                    res.clearCookie('session-cookie').status(204).end();
                }
            });
        } else {
            res.status(400).end();
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

export default authRouter;