import { State, Action } from "../types";

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_BOOK_LIST":
      return {
        ...state,
        books: {
          ...action.payload.reduce(
            (init, book) => ({
              ...init,
              [book.isbn]: book,
            }),
            {}
          ),
        },
      };
    case "ADD_BOOK":
      return {
        ...state,
        books: {
          ...state.books,
          [action.payload.isbn]: action.payload,
        },
      };
    case "DEL_BOOK":
      const retBook = {
        ...state,
        books: {
          ...state.books,
        },
      };
      delete retBook.books[action.payload.isbn];

      return retBook;
    case "SET_AUTHOR_LIST":
      return {
        ...state,
        authors: {
          ...action.payload.reduce(
            (init, author) => ({
              ...init,
              [author.ssn]: author,
            }),
            {}
          ),
        },
      };
    case "ADD_AUTHOR":
      return {
        ...state,
        authors: {
          ...state.authors,
          [action.payload.ssn]: action.payload,
        },
      };
    case "DEL_AUTHOR":
      const retAuthor = {
        ...state,
        authors: {
          ...state.authors,
        },
      };
      delete retAuthor.authors[action.payload.ssn];

      return retAuthor;
    case "SET_USER":
      return {
        ...state,
        userInfo: action.payload,
      };
    case "SET_ACTIVE":
      return {
        ...state,
        actived: action.payload,
      };
    case "SET_TOTAL_PAGE":
      return {
        ...state,
        totalPage: action.payload,
      };
    case "SET_CUR_PAGE":
      return {
        ...state,
        curPage: action.payload,
      };
    case "SET_PAGE_LIMIT":
      return {
        ...state,
        pageLimit: action.payload,
      };
    default:
      return state;
  }
};
