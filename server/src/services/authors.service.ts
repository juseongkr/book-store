import { Document } from "mongoose";
import { Author as AuthorType } from "../types";
import Author from "../models/author.model";
import { AuthorDto } from "../types";

export const updateAuthor = async (
  newAuthor: AuthorType
): Promise<Document | null> => {
  const { ssn, uploader } = newAuthor;

  return await Author.findOneAndUpdate({ ssn, uploader }, newAuthor, {
    new: true,
  });
};

export const deleteAuthor = async (
  authorDto: AuthorDto
): Promise<Document | null> => {
  const { ssn, uploader } = authorDto;

  return await Author.findOneAndDelete({ ssn, uploader });
};

export const createAuthor = async (
  newAuthor: AuthorType
): Promise<Document | null> => {
  const { ssn } = newAuthor;
  const duplicated = await Author.findOne({ ssn });

  if (duplicated) {
    return null;
  }

  return await new Author({
    ...newAuthor,
  }).save();
};
