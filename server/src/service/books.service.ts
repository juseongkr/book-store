import { Document } from 'mongoose';
import { Book as BookType } from '../types';
import Book from '../models/book';
import User from '../models/user';
import { BookDto } from '../types';

export const updateBook = async (newBook: BookType): Promise<Document | null> => {
    const { isbn, uploader } = newBook;
    return await Book.findOneAndUpdate({ isbn, uploader }, newBook, { new: true });
}

export const deleteBook = async (bookDto: BookDto): Promise<Document | null> => {
    const { isbn, uploader } = bookDto;
    const deleted: Document | null = await Book.findOneAndDelete({ isbn, uploader });
    if (deleted) {
        await User.findByIdAndUpdate(uploader, {
            $pull: {
                books: deleted!.get('id')
            }
        });
    }
    return deleted;
}

export const addBook = async (newBook: BookType): Promise<Document | null> => {
    const { isbn, uploader } = newBook;
    const duplicated: Document | null = await Book.findOne({ isbn });
    if (duplicated) {
        return null;
    }
    const savedBook: Document | null = await new Book({
        ...newBook,
    }).save();
    await User.findByIdAndUpdate(uploader, {
        $addToSet: {
            books: savedBook
        }
    }, {
        new: true,
    });
    return savedBook;
}