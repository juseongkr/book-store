import express, { Request, Response, Router } from 'express';

const pingRouter: Router = express.Router();

pingRouter.get('/', (_req: Request, res: Response): void => {
    res.send('pong');
});

export default pingRouter;