import { Document, MongooseFilterQuery } from "mongoose";
import { Author as AuthorType, Page, FilterDto } from "../types";
import Author from "../models/author.model";
import { AuthorDto } from "../types";

export const getAuthorPage = async (filterDto: FilterDto): Promise<Page> => {
  const { search, page } = filterDto;
  const filterQuery: MongooseFilterQuery<Pick<Document, "_id">> = {};
  const start = (Number(page) - 1) * 20;
  const end = start + 20;

  if (search) {
    filterQuery.name = {
      $regex: search,
      $options: "i",
    };
  }

  const authors = await Author.find(filterQuery).sort({ createdAt: -1 });
  const pagedAuthors = authors.slice(start, end);

  return {
    pagination: {
      total: authors.length,
      count: pagedAuthors.length,
      page,
    },
    data: pagedAuthors,
  };
};

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
