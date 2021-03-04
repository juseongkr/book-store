import { Document, MongooseFilterQuery } from "mongoose";
import { Page, Book as BookType, FilterDto } from "../types";
import Book from "../models/book.model";
import User from "../models/user.model";
import { BookDto } from "../types";

export const getBookPage = async (filterDto: FilterDto): Promise<Page> => {
  const { search, page, genre } = filterDto;
  const filterQuery: MongooseFilterQuery<Pick<Document, "_id">> = {};
  const start = (Number(page) - 1) * 20;
  const end = start + 20;

  if (search) {
    filterQuery.title = {
      $regex: search,
      $options: "i",
    };
  }

  if (genre) {
    filterQuery.genres = {
      $in: genre.toString().toLowerCase().split(","),
    };
  }
  
  const books = await Book.find(filterQuery).sort({ createdAt: -1 });
  const pagedBooks = books.slice(start, end);

  return {
    pagination: {
      total: books.length,
      count: pagedBooks.length,
      page,
    },
    data: pagedBooks,
  };
};

export const updateBook = async (
  newBook: BookType
): Promise<Document | null> => {
  const { isbn, uploader } = newBook;

  return await Book.findOneAndUpdate({ isbn, uploader }, newBook, {
    new: true,
  });
};

export const deleteBook = async (
  bookDto: BookDto
): Promise<Document | null> => {
  const { isbn, uploader } = bookDto;
  const deleted = await Book.findOneAndDelete({
    isbn,
    uploader,
  });

  if (deleted) {
    await User.findByIdAndUpdate(uploader, {
      $pull: {
        books: deleted!.get("id"),
      },
    });
  }

  return deleted;
};

export const createBook = async (
  newBook: BookType
): Promise<Document | null> => {
  const { isbn, uploader } = newBook;
  const duplicated = await Book.findOne({ isbn });
  if (duplicated) {
    return null;
  }

  const savedBook = await new Book({ ...newBook }).save();
  await User.findByIdAndUpdate(
    uploader,
    {
      $addToSet: { books: savedBook },
    },
    {
      new: true,
    }
  );

  return savedBook;
};
