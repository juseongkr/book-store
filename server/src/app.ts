import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { MONGODB_URI } from './utils/config';
import mongoose from 'mongoose';
import pingRouter from './routes/ping';
import booksRouter from './routes/books';
import middleware from './utils/middlewares';

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

app.use('/api/ping', pingRouter);
app.use('/api/books', booksRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;