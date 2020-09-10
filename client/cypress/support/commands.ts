/* eslint-disable @typescript-eslint/no-namespace */
import { Book, Author, User } from "../../src/types";
import { localUrl } from '../../src/constants';

export function registerTyping(user: User): void {
    const { username, password, name } = user;
    cy.get('.form > :nth-child(1) > input').type(username);
    cy.get('.equal > :nth-child(1) > input').type(password);
    cy.get(':nth-child(2) > input').type(password);
    if (name) {
        cy.get(':nth-child(3) > input').type(name);
    }
}

export function loginTyping(user: User): void {
    const { username, password } = user;
    cy.get(':nth-child(1) > .ui > input').type(username);
    cy.get(':nth-child(2) > .ui > input').type(password);
}

export function register(user: User): void {
    cy.visit(localUrl);
    cy.contains('Login').click();
    cy.contains('Sign up').click();
    cy.contains('Book Store Sign up');

    registerTyping(user);

    cy.get('.right.column > .ui').click();
    cy.wait(1000);
    cy.get('.content > .inverted').should('not.exist');
}

export function login(user: User): void {
    cy.visit(localUrl);
    cy.contains('Login').click();
    cy.contains('Book Store Log in');

    loginTyping(user);

    cy.get('.segment > .teal').click();
    cy.getCookie('session-cookie');
    cy.contains('Logout');
}

export function logout(): void {
    cy.visit(localUrl);
    cy.contains('Logout').click();
    cy.contains('Login');
}

export function bookTyping(book: Book): void {
    const { title, published, author, genres, rating, description } = book;
    
    cy.get(':nth-child(1) > input').type(title);
    cy.get(':nth-child(2) > input').type(published);
    cy.get(':nth-child(3) > input').type(author);
    cy.get(':nth-child(4) > input').type(genres.join(', '));
    if (description) {
        cy.get(':nth-child(5) > input').type(description);
    }
    if (rating) {
        cy.get(':nth-child(6) > input').type(rating.toString());
    }
}

export function createBook(book: Book): void {
    cy.visit(localUrl);
    cy.contains('Book').click();
    cy.contains('Add new book').click();

    bookTyping(book);

    cy.contains('Save').click();
    cy.contains(book.title);
}

export function authorTyping(author: Author): void {
    const { name, ssn, gender, birth, address } = author;

    cy.get(':nth-child(1) > input').type(name);
    cy.get(':nth-child(2) > input').type(ssn);
    cy.get('.form > :nth-child(3) > .ui').select(gender);
    if (birth) {
        cy.get(':nth-child(4) > input').type(birth);
    }
    if (address) {
        cy.get(':nth-child(5) > input').type(address);
    }
}

export function createAuthor(author: Author): void {
    cy.visit(localUrl);
    cy.contains('Author').click();
    cy.contains('Add new author').click();

    authorTyping(author);

    cy.contains('Save').click();
    cy.contains(author.name);
}
   
Cypress.Commands.add('registerTyping', registerTyping);
Cypress.Commands.add('register', register);
Cypress.Commands.add('loginTyping', loginTyping);
Cypress.Commands.add('login', login);
Cypress.Commands.add('logout', logout);
Cypress.Commands.add('bookTyping', bookTyping);
Cypress.Commands.add('createBook', createBook);
Cypress.Commands.add('authorTyping', authorTyping);
Cypress.Commands.add('createAuthor', createAuthor);
   
declare global {
    namespace Cypress {
        interface Chainable {
            registerTyping: typeof registerTyping
            register: typeof register
            loginTyping: typeof loginTyping
            login: typeof login
            logout: typeof logout
            bookTyping: typeof bookTyping
            createBook: typeof createBook
            authorTyping: typeof authorTyping
            createAuthor: typeof createAuthor
        }
    }
}