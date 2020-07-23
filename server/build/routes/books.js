"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_1 = __importDefault(require("../models/book"));
const booksRouter = express_1.default.Router();
booksRouter.get('/', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield book_1.default.find({});
        res.json(books);
    }
    catch (err) {
        next(err);
    }
}));
booksRouter.get('/:isbn', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_1.default.findOne({ isbn: req.params.isbn });
        if (book) {
            res.json(book);
        }
        else {
            res.status(404).end();
        }
    }
    catch (err) {
        next(err);
    }
}));
booksRouter.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const book = new book_1.default({
            isbn: body.isbn,
            title: body.title,
            published: body.published,
            author: body.author,
            genres: body.genres,
            rating: body === null || body === void 0 ? void 0 : body.rating,
            description: body === null || body === void 0 ? void 0 : body.description,
        });
        const savedBook = yield book.save();
        res.json(savedBook);
    }
    catch (err) {
        next(err);
    }
}));
booksRouter.delete('/:isbn', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield book_1.default.findOneAndRemove({ isbn: req.params.isbn });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
}));
exports.default = booksRouter;
