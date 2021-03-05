import { localUrl } from "../../src/constants";
import { tester_user, dummy_author as author } from "../data";
import { Author, Gender } from "../../src/types";

describe("Author page testing", () => {
  const newName: string = "new author name here";
  beforeEach(() => {
    cy.login(tester_user);
  });

  describe("Create author page testing", () => {
    beforeEach(() => {
      cy.visit(localUrl);
      cy.contains("Author").click();
      cy.contains("Add new author").click();
    });

    it("Create with a new author", () => {
      cy.createAuthor(author);
    });

    it("Create with conflict ssn", () => {
      cy.authorTyping(author);

      cy.contains("Save").click();
      cy.wait(3000);
      cy.contains("ssn conflict");
    });

    it("Create with invalid birth", () => {
      const invalid: Author = {
        ...author,
        birth: "20201022",
      };
      cy.authorTyping(invalid);

      cy.contains("Invalid date format");
    });
  });

  describe("Update author information testing", () => {
    beforeEach(() => {
      cy.visit(localUrl);
      cy.contains("Author").click();
    });

    it("Update author name", () => {
      cy.contains(author.name).click();
      cy.contains("Update").click();
      cy.get(":nth-child(1) > input").clear().type(newName);

      cy.contains("Save").click();
      cy.contains(newName);
    });

    it("Update author gender", () => {
      cy.contains(newName).click();
      cy.contains("Update").click();
      cy.get(".form > :nth-child(2) > .ui").select(Gender.Female);

      cy.wait(1000);
      cy.contains("Save").click();
    });

    it("Update with invalid birth", () => {
      cy.contains(newName).click();
      cy.contains("Update").click();
      cy.get(":nth-child(3) > input").clear().type("11001012222");
      cy.get(":nth-child(4) > input").clear();

      cy.contains("Invalid date format");
    });
  });

  describe("Delete author testing", () => {
    beforeEach(() => {
      cy.visit(localUrl);
      cy.contains("Author").click();
    });

    it("Delete created author", () => {
      cy.contains(newName).click();
      cy.contains("Delete").click();

      cy.wait(1000);
      cy.contains(newName).should("not.exist");
    });
  });

  afterEach(() => {
    cy.logout();
  });
});
