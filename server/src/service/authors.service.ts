import { Document } from 'mongoose';
import { Author as AuthorType } from '../types';
import Author from '../models/author';
import { AuthorDto } from '../types';

export const updateAuthor = async (newAuthor: AuthorType): Promise<Document | null> => {
    const { ssn, uploader } = newAuthor;
    return await Author.findOneAndUpdate({ ssn, uploader }, newAuthor, { new: true });
}

export const deleteAuthor = async (authorDto: AuthorDto): Promise<Document | null> => {
    const { ssn, uploader } = authorDto;
    return await Author.findOneAndDelete({ ssn, uploader });
}

export const addAuthor = async (newAuthor: AuthorType): Promise<Document | null> => {
    const { ssn } = newAuthor;
    const duplicated: Document | null = await Author.findOne({ ssn });
    if (duplicated) {
        return null;
    }
    const savedAuthor: Document | null = await new Author({
        ...newAuthor,
    }).save();
    return savedAuthor;
}