import express, { Request, Response, NextFunction } from "express";
import Book from "../models/book.model";
import middleware from "../utils/middlewares";
import logger from "../utils/logger";
import { bookValidation, validate } from "../utils/validator";
import {
  createBook,
  deleteBook,
  getBookPage,
  updateBook,
} from "../services/books.service";
import { StatusCodes } from "http-status-codes";

const booksRouter = express.Router();

booksRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { search, genre, page } = req.query;

    try {
      const books = await getBookPage({
        search: String(search ?? ""),
        page: Number(page ?? 1),
        genre: String(genre ?? ""),
      });

      res.json(books);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
);

booksRouter.get(
  "/:isbn",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const book = await Book.findOne({
        isbn: req.params.isbn,
      });

      if (book) {
        res.json(book);
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
);

booksRouter.post(
  "/",
  middleware.isLoggedIn,
  validate(bookValidation),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body;
    const session = req.session;

    try {
      const book = {
        isbn: body.isbn,
        title: body.title,
        published: body.published,
        author: body.author,
        genres: body.genres,
        rating: body?.rating,
        description: body?.description,
        uploader: session!.user.id,
      };

      const savedBook = await createBook(book);
      if (savedBook) {
        res.json(savedBook);
      } else {
        res.status(StatusCodes.CONFLICT).send({
          error: "isbn conflict",
        });
      }
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
);

booksRouter.delete(
  "/:isbn",
  middleware.isLoggedIn,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const session = req.session;

    try {
      const deleted = await deleteBook({
        uploader: session!.user.id,
        isbn: req.params.isbn,
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

booksRouter.put(
  "/:isbn",
  middleware.isLoggedIn,
  validate(bookValidation),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body;
    const session = req.session;

    try {
      const book = {
        isbn: req.params.isbn,
        title: body.title,
        published: body.published,
        author: body.author,
        genres: body.genres,
        rating: body?.rating,
        description: body?.description,
        uploader: session!.user.id,
      };

      const updated = await updateBook(book);
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

export default booksRouter;
