import { Document } from "mongoose";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Author {
  ssn: string;
  name: string;
  birth?: string;
  address?: string;
  gender: Gender;
  uploader: string;
}

export interface Book {
  isbn: string;
  title: string;
  published: string;
  author: string;
  genres: Array<string>;
  rating?: number;
  description?: string;
  uploader: string;
}

export interface User {
  username: string;
  password: string;
  name?: string;
}

export type AuthorDto = Pick<Author, "ssn" | "uploader">;

export type BookDto = Pick<Book, "isbn" | "uploader">;

export interface UserDto {
  username: string;
  password?: string;
}

export interface FilterDto {
  search: String;
  page: Number;
}

export type AuthorInfo = Omit<Author, "ssn">;

export type AuthorPage = {
  pagination: {
    total: Number;
    count: Number;
    page: Number;
  };
  data: Document[];
};
