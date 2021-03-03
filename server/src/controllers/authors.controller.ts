import express, { Request, Response, NextFunction } from "express";
import { Document, MongooseFilterQuery } from "mongoose";
import Author from "../models/author.model";
import middleware from "../utils/middlewares";
import logger from "../utils/logger";
import { authorValidation, validate } from "../utils/validator";
import {
  createAuthor,
  deleteAuthor,
  updateAuthor,
} from "../services/authors.service";
import { StatusCodes } from "http-status-codes";

const authorsRouter = express.Router();

authorsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { search, page } = req.query;
    const filterQuery: MongooseFilterQuery<Pick<Document, "_id">> = {};

    if (search) {
      filterQuery.name = {
        $regex: search,
        $options: "i",
      };
    }

    try {
      const authors = await Author.find(filterQuery)
        .sort({ createdAt: -1 })
        .limit(Number(page) ?? 0);
      res.json(authors);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
);

authorsRouter.get(
  "/:ssn",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const author = await Author.findOne({
        ssn: req.params.ssn,
      });

      if (author) {
        res.json(author);
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
);

authorsRouter.post(
  "/",
  middleware.isLoggedIn,
  validate(authorValidation),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body;
    const session = req.session;

    try {
      const author = {
        ssn: body.ssn,
        name: body.name,
        birth: body?.birth,
        address: body?.address,
        gender: body.gender,
        uploader: session!.user.id,
      };

      const savedAuthor = createAuthor(author);
      if (savedAuthor) {
        res.json(savedAuthor);
      } else {
        res.status(StatusCodes.CONFLICT).send({
          error: "ssn conflict",
        });
      }
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
);

authorsRouter.delete(
  "/:ssn",
  middleware.isLoggedIn,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const session = req.session;

    try {
      const deleted = await deleteAuthor({
        uploader: session!.user.id,
        ssn: req.params.ssn,
      });

      if (deleted) {
        res.status(StatusCodes.NO_CONTENT).end();
      } else {
        res.status(StatusCodes.BAD_REQUEST).end();
      }
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
);

authorsRouter.put(
  "/:ssn",
  middleware.isLoggedIn,
  validate(authorValidation),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body;
    const session = req.session;

    try {
      const author = {
        ssn: req.params.ssn,
        name: body.name,
        birth: body?.birth,
        address: body?.address,
        gender: body.gender,
        uploader: session!.user.id,
      };
      const updated = await updateAuthor(author);

      if (updated) {
        res.status(StatusCodes.OK).end();
      } else {
        res.status(StatusCodes.BAD_REQUEST).end();
      }
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
);

export default authorsRouter;
