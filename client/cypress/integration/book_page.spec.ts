import { Book } from "../../src/types";
import { tester_user, dummy_book as book } from "../data";
import { localUrl } from "../../src/constants";

describe("Book page testing", () => {
  const newTitle: string = "new book title here";
  beforeEach(() => {
    cy.login(tester_user);
  });

  describe("Create book page testing", () => {
    beforeEach(() => {
      cy.visit(localUrl);
      cy.contains("Book").click();
      cy.contains("Add new book").click();
    });

    it("Create with a new book", () => {
      cy.createBook(book);
    });

    it("Create with invalid published", () => {
      const invalid: Book = {
        ...book,
        published: "20200101",
      };
      cy.bookTyping(invalid);

      cy.contains("Invalid date format");
    });
  });

  describe("Update book information testing", () => {
    beforeEach(() => {
      cy.visit(localUrl);
      cy.contains("Book").click();
    });

    it("Update book title", () => {
      cy.contains(book.title).click();
      cy.contains("Update").click();
      cy.get(":nth-child(1) > input").clear().type(newTitle);

      cy.contains("Save").click();
      cy.contains(newTitle);
    });

    it("Update book rating", () => {
      cy.contains(newTitle).click();
      cy.contains("Update").click();
      cy.get(":nth-child(6) > input").clear().type("5");

      cy.wait(1000);
      cy.contains("Save").click();
    });

    it("Update book author", () => {
      cy.contains(newTitle).click();
      cy.contains("Update").click();
      cy.get(":nth-child(3) > input").clear().type("unknown");

      cy.wait(1000);
      cy.contains("Save").click();
    });

    it("Update with invalid published", () => {
      cy.contains(newTitle).click();
      cy.contains("Update").click();
      cy.get(":nth-child(2) > input").clear().type("1231241212312");
      cy.get(":nth-child(5) > input").clear();

      cy.contains("Invalid date format");
    });
  });

  describe("Delete book testing", () => {
    beforeEach(() => {
      cy.visit(localUrl);
      cy.contains("Book").click();
    });

    it("Delete created book", () => {
      cy.contains(newTitle).click();
      cy.contains("Delete").click();

      cy.wait(1000);
      cy.contains(newTitle).should("not.exist");
    });

    afterEach(() => {
      cy.logout();
    });
  });
});
