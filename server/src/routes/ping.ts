import express, { Request, Response, Router } from 'express';
import logger from '../utils/logger';

const pingRouter: Router = express.Router();

pingRouter.get('/', (req: Request, res: Response): void => {
    logger.info(req.ip);
    res.send(req.ip);
});

export default pingRouter;