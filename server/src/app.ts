import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import rateLimit from 'express-rate-limit';

import connectRedis from 'connect-redis';
import redis from 'redis';
import hpp from 'hpp';

import { MONGODB_URI, SECRET_KEY, REDIS_HOST, REDIS_PASSWORD } from './utils/config';
import mongoose from 'mongoose';
import pingRouter from './routes/ping';
import booksRouter from './routes/books';
import authorsRouter from './routes/authors';
import middleware from './utils/middlewares';
import authRouter from './routes/auth';
import logger from './utils/logger';

if (MONGODB_URI === 'undefined' || REDIS_HOST === 'undefined') {
    logger.error('PATH ERROR', MONGODB_URI, REDIS_HOST);
    process.exit(0);
}

mongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
	useUnifiedTopology: true,
})
.catch(err => {
    logger.error('CONNECTION FAILED', err.message);
});

const RedisStore: connectRedis.RedisStore = connectRedis(session);
const redisClient: redis.RedisClient = redis.createClient({
    url: `redis://${REDIS_HOST}`,
    password: REDIS_PASSWORD,
});

const limiter: rateLimit.RateLimit = rateLimit({
    windowMs: 1000 * 60 * 5,
    max: 500,
});

const app: Express = express();
app.set('trust proxy', true);
app.use(morgan('combined', {
    stream: {
        write: (text: string): void => {
            logger.info(text);
        }
    },
}));
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(limiter);
app.use(express.static('build'));
app.use(express.json());
app.use(cookieParser(SECRET_KEY));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: SECRET_KEY,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
        secure: false, // true: https only
    },
    name: 'session-cookie',
    store: new RedisStore({
        client: redisClient,
        logErrors: true,
    }),
}));

app.use('/api/ping', pingRouter);
app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);
app.use('/api/authors', authorsRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;