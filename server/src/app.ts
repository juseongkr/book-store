import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { MONGODB_URI, JWT_SECRET } from './utils/config';
import mongoose from 'mongoose';
import pingRouter from './routes/ping';
import booksRouter from './routes/books';
import authorsRouter from './routes/authors';
import middleware from './utils/middlewares';
import authRouter from './routes/auth';

console.log('CONNECTING TO', MONGODB_URI);
if (MONGODB_URI === 'undefined') {
    console.log('CONNECTIION FIALED', MONGODB_URI);
    process.exit(0);
}
mongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
	useUnifiedTopology: true,
})
.then(() => {
    console.log('CONNECTED TO DB');
})
.catch(err => {
    console.error('CONNECTION FAILED', err.message);
})

const app = express();
app.use(morgan('combined'));
app.use(cors());
app.use(helmet());
app.use(express.static('build'));
app.use(express.json());
app.use(cookieParser(JWT_SECRET));

app.use('/api/ping', pingRouter);
app.use('/api/auth', authRouter);
app.use(middleware.jwtHandler);
app.use('/api/books', booksRouter);
app.use('/api/authors', authorsRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;