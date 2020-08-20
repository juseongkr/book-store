import { State, Action } from '../types';

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_BOOK_LIST':
            return {
                ...state,
                books: {
                    ...action.payload.reduce((init, book) => ({
                        ...init,
                        [book.isbn]: book,
                    }), {}),
                    ...state.books,
                }
            };
        case 'ADD_BOOK':
            return {
                ...state,
                books: {
                    ...state.books,
                    [action.payload.isbn]: action.payload,
                }
            };
        case 'DEL_BOOK':
            const retBook = {
                ...state,
                books: {
                    ...state.books,
                },
            };
            delete retBook.books[action.payload.isbn];

            return retBook;
        case 'SET_AUTHOR_LIST':
            return {
                ...state,
                authors: {
                    ...action.payload.reduce((init, author) => ({
                        ...init,
                        [author.ssn]: author,
                    }), {}),
                    ...state.authors,
                }
            };
        case 'ADD_AUTHOR':
            return {
                ...state,
                authors: {
                    ...state.authors,
                    [action.payload.ssn]: action.payload,
                }
            };
        case 'DEL_AUTHOR':
            const retAuthor = {
                ...state,
                authors: {
                    ...state.authors,
                },
            };
            delete retAuthor.authors[action.payload.ssn];

            return retAuthor;
        case 'SET_USER':
            return {
                ...state,
                userInfo: action.payload,
            };
        case 'SET_ACTIVE':
            return {
                ...state,
                actived: action.payload,
            };
        default:
            return state;
    }
};