import { Document } from "mongoose";
import { Book as BookType } from "../types";
import Book from "../models/book.model";
import User from "../models/user.model";
import { BookDto } from "../types";

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
