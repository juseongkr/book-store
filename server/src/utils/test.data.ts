import { User, Gender, Author, Book } from "../types";

export const test_user: User = {
  username: "test@email.com",
  password: "test1234",
  name: "test",
};

export const temp_user: User = {
  username: "temp@email.com",
  password: "temp1234",
  name: "temp",
};

export const test_author: Author = {
  ssn: "000000000",
  name: "created by jest code",
  birth: "2020-01-01",
  address: "undefined",
  gender: Gender.Other,
  uploader: "",
};

export const test_book: Book = {
  isbn: "000000000",
  title: "created by jest code",
  published: "2020-01-01",
  author: "jest",
  genres: ["sample1", "sample2"],
  rating: 1,
  description: "no comment",
  uploader: "",
};
