import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import middleware from '../utils/middlewares';

const authRouter = express.Router();

authRouter.get('/check', middleware.isLoggedIn, (req, res, next) => {
    const session = req.session;
    if (session?.user) {
        res.json({ username: session.user.username, id: session.user.id });
    } else {
        next();
    }
});

authRouter.post('/register', middleware.isNotLoggedIn, async (req, res, next) => {
    const { username, password, name } = req.body;
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
        
        res.json({ username, id: savedUser.get('id'), name });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

authRouter.post('/login', middleware.isNotLoggedIn, async (req, res, next) => {
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

        req.session!.user = {
            username: username,
            id: user.get('id'),
        };

        res.json({ username, id: user.get('id') });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

authRouter.post('/logout', middleware.isLoggedIn, (req, res, next) => {
    req.session!.destroy(err => {
        if (err) {
            console.error(err);
            next();
        } else {
            res.clearCookie('session-cookie').status(204).redirect('/');
        }
    });
});

export default authRouter;