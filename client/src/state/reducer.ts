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
            const obj = {
                ...state,
                books: {
                    ...state.books,
                }
            };
            delete obj.books[action.payload.isbn];

            return obj;
        default:
            return state;
    }
};