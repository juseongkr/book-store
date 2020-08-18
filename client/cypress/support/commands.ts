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

export function createBook(book: Book): void {
    // not implemented yet
}

export function createAuthor(author: Author): void {
    // not implemented yet
}
   
Cypress.Commands.add('registerTyping', registerTyping);
Cypress.Commands.add('register', register);
Cypress.Commands.add('loginTyping', loginTyping);
Cypress.Commands.add('login', login);
Cypress.Commands.add('logout', logout);
Cypress.Commands.add('createBook', createBook);
Cypress.Commands.add('createAuthor', createAuthor);
   
declare global {
    namespace Cypress {
        interface Chainable {
            registerTyping: typeof registerTyping
            register: typeof register
            loginTyping: typeof loginTyping
            login: typeof login
            logout: typeof logout
            createBook: typeof createBook
            createAuthor: typeof createAuthor
        }
    }
}