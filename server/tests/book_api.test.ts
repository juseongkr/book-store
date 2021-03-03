import supertest from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import { test_user as user, test_book as book } from "../src/utils/test.data";
import { StatusCodes } from "http-status-codes";

const api = supertest.agent(app);

beforeAll(async () => {
  const response = await api
    .post("/api/auth/login")
    .send(user)
    .expect(StatusCodes.OK)
    .expect("Content-Type", /application\/json/);

  expect(response.get("set-cookie")[0]).toContain("session-cookie");
});

describe("BOOK API TEST", () => {
  test("GET: /api/books (Read a list of the entire book)", async () => {
    await api
      .get("/api/books")
      .expect(StatusCodes.OK)
      .expect("Content-Type", /application\/json/);
  });

  test("POST: /api/books (Create a new book)", async () => {
    const { text: createdBook } = await api
      .post("/api/books")
      .send(book)
      .expect(StatusCodes.OK)
      .expect("Content-Type", /application\/json/);

    expect(createdBook).toContain(book.title);
  });

  test("GET: /api/books/:isbn (Read the created book)", async () => {
    const { text: createdBook } = await api
      .get(`/api/books/${book.isbn}`)
      .expect(StatusCodes.OK)
      .expect("Content-Type", /application\/json/);

    expect(createdBook).toContain(book.title);
  });

  test("PUT: /api/books/:isbn (Update the created book)", async () => {
    const { text: createdBook } = await api
      .get(`/api/books/${book.isbn}`)
      .expect(StatusCodes.OK)
      .expect("Content-Type", /application\/json/);

    const updatedBook = {
      ...JSON.parse(createdBook),
      rating: 5,
    };

    await api
      .put(`/api/books/${updatedBook.isbn}`)
      .send(updatedBook)
      .expect(StatusCodes.OK);
  });

  test("DELETE: /api/books (Delete the created book)", async () => {
    await api.delete(`/api/books/${book.isbn}`).expect(204);
  });

  test("GET: /api/books/:isbn (Check if the book has been deleted)", async () => {
    const { text: createdBook } = await api
      .get(`/api/books/${book.isbn}`)
      .expect(StatusCodes.NOT_FOUND);

    expect(createdBook).toBeFalsy();
  });
});

afterAll(async () => {
  const { header: response } = await api
    .post("/api/auth/logout")
    .send(user)
    .expect(StatusCodes.MOVED_TEMPORARILY);

  expect(response["set-cookie"][0]).toContain("session-cookie=;");
  mongoose.connection.close();
});
