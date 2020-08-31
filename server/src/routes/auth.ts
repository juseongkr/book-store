import express, { Request, Response, NextFunction, Router } from 'express';
import { Document } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user';
import middleware from '../utils/middlewares';
import logger from '../utils/logger';

const authRouter: Router = express.Router();

authRouter.get('/check', middleware.isLoggedIn, (req: Request, res: Response): void => {
    const session: Express.Session | undefined = req.session;
    if (session?.user) {
        res.json({ username: session.user.username, id: session.user.id });
    } else {
        res.status(401).end();
    }
});

authRouter.post('/register', middleware.isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, name } = req.body;
    if (!username || !password) {
        return res.status(401).json({
            error: 'must fill out username and password',
        });
    }

    try {
        const user: Document | null = await User.findOne({ username });
        if (user) {
            return res.status(409).json({
                error: 'username conflict',
            });
        }

        const hash: string = await bcrypt.hash(password, 12);
        const savedUser: Document = await new User({
            password: hash,
            username,
            name,
        }).save();

        res.json({ username, id: savedUser.get('id'), name });
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

authRouter.post('/login', middleware.isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(401).json({
            error: 'must fill out username and password',
        });
    }

    try {
        const user: Document | null = await User.findOne({ username, deactivated: false });
        if (!user) {
            return res.status(401).json({
                error: 'invalid username',
            });
        }

        const valid: boolean = await bcrypt.compare(password, user.get('password'));
        if (!valid) {
            return res.status(401).json({
                error: 'invalid password',
            });
        }

        const updatedUser: Document = {
            ...user.toJSON(),
            ip_address: req.ip,
            last_login: new Date().toISOString(),
        };

        const updated: Document | null = await User.findOneAndUpdate({ username, deactivated: false }, updatedUser, { new: true });
        if (updated) {
            req.session!.user = {
                username: username,
                id: user.get('id'),
            };
        }

        res.json({ username, id: user.get('id') });
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

authRouter.post('/logout', middleware.isLoggedIn, (req: Request, res: Response, next: NextFunction): void => {
    req.session!.destroy(err => {
        if (err) {
            logger.error(err);
            next();
        } else {
            res.clearCookie('session-cookie').redirect('/');
        }
    });
});

authRouter.delete('/unregister', middleware.isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
        const user: Document | null = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                error: 'invalid username',
            });
        }

        const valid: boolean = await bcrypt.compare(password, user.get('password'));
        if (!valid) {
            return res.status(401).json({
                error: 'invalid password',
            });
        }

        const updatedUser: Document = {
            ...user.toJSON(),
            deactivated: true,
        };

        const deleted: Document | null = await User.findOneAndUpdate({ username, deactivated: false }, updatedUser, { new: true });
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