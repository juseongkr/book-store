import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/config';
import middleware from '../utils/middlewares';

const authRouter = express.Router();

authRouter.get('/check', middleware.isLoggedIn, (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json(decoded);
    } catch (err) {
        next(err);
    }
});

authRouter.post('/register', async (req, res, next) => {
    const { username, name, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            return res.status(409).json({
                error: 'username conflict',
            });
        }
        const hash = await bcrypt.hash(password, 12);
        const savedUser = await new User({
            password: hash,
            username,
            name,
        }).save();

        const token = jwt.sign({
            _id: savedUser.get('id'),
            username,
        }, JWT_SECRET, {
            expiresIn: '7d',
        });
        res.cookie('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
        }).redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

authRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(401).json({
            error: 'must fill out username and password',
        });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                error: 'invalid username',
            });
        }
        const valid = await bcrypt.compare(password, user.get('password'));
        if (!valid) {
            return res.status(401).json({
                error: 'invalid password',
            });
        }

        const token = jwt.sign({
            _id: user.get('id'),
            username,
        }, JWT_SECRET, {
            expiresIn: '7d',
        });
        res.cookie('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
        }).json({ username: user.get('username'), id: user.get('id') });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

authRouter.post('/logout', middleware.isLoggedIn, (_req, res) => {
    res.clearCookie('access_token').status(204).redirect('/');
});

export default authRouter;