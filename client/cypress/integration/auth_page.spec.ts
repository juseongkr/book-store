import { User } from '../../src/types';
import { localUrl } from '../../src/constants';

const user: User = {
    username: 'cypress_tester@email.com',
    password: 'cypress1234',
};

describe('Auth page testing', () => {
    beforeEach(() => {
        cy.visit(localUrl);
        cy.contains('Login').click();
        cy.contains('Sign up').click();
        cy.contains('Book Store Sign up');

    })
    describe('Register page testing', () => {
        it('Register with a new user', () => {
            cy.register(user);
        });

        it('Register with invalid username', () => {
            const invalid: User = {
                ...user,
                username: 'invalid username',
            };

            cy.registerTyping(invalid);

            cy.contains('You must fill out email');
        });

        it('Register with invalid password (short password)', () => {
            const invalid: User = {
                ...user,
                password: 'short',
            };

            cy.registerTyping(invalid);

            cy.contains('You must fill out password at least 8 characters');
        });

        it('Register with invalid password (not match password)', () => {
            cy.get('.form > :nth-child(1) > input').type(user.username);
            cy.get('.equal > :nth-child(1) > input').type(user.password);
            cy.get(':nth-child(2) > input').type(user.password + 'password');

            cy.contains('Please re-enter your password');
        });
    });

    describe('Login page testing', () => {
        beforeEach(() => {
            cy.visit(localUrl);
            cy.contains('Login').click();
            cy.contains('Book Store Log in');
        });

        it('Login with invalid username', () => {
            const invalid: User = {
                ...user,
                username: 'invalid',
            };
            cy.loginTyping(invalid);
            cy.get('.segment > .teal').click();

            cy.contains('invalid username');
        });

        it('Login with invalid password', () => {
            const invalid: User = {
                ...user,
                password: 'invalid',
            };
            cy.loginTyping(invalid);
            cy.get('.segment > .teal').click();

            cy.contains('invalid password');
        });

        it('Login with a new user', () => {
            cy.login(user);
        });
    });

    describe('Logout function testing', () => {
        beforeEach(() => {
            cy.login(user);
        });

        it('Logout user', () => {
            cy.logout();
        });
    });

    describe('Unregister page testing', () => {
        // not implemented yet
    });
});