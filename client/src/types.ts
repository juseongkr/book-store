export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
};

export enum ActiveItem {
    Home = 'home',
    Book = 'book',
    Author = 'author',
    Login = 'login',
};

export type GenderSelect = {
    value: Gender;
    label: string;
};

export interface Author {
    ssn: string;
    name: string;
    birth?: string;
    address?: string;
    gender: Gender;
};

export interface Book {
    isbn: string;
    title: string;
    published: string;
    author: string;
    genres: string[];
    rating?: number;
    description?: string;
};

export interface User {
    username: string;
    password: string;
    name?: string;
};

export type AuthorInfo = Omit<Author, 'ssn'>;
export type BookInfo = Omit<Book, 'isbn'>;

export type State = {
    books: {
        [isbn: string]: Book,
    },
    authors: {
        [ssn: string]: Author,
    },
    username: string,
    actived: ActiveItem,
};

export type Action =
| {
    type: 'SET_BOOK_LIST';
    payload: Book[];
} | {
    type: 'ADD_BOOK';
    payload: Book;
} | {
    type: 'DEL_BOOK';
    payload: Book;
} | {
    type: 'SET_AUTHOR_LIST';
    payload: Author[];
} | {
    type: 'ADD_AUTHOR';
    payload: Author;
} | {
    type: 'DEL_AUTHOR';
    payload: Author;
} | {
    type: 'SET_USER';
    payload: string;
} | {
    type: 'SET_ACTIVE';
    payload: ActiveItem;
};

export type StateProviderProps = {
    reducer: React.Reducer<State, Action>;
    children: React.ReactElement;
};

export type RatingProps = {
    rating: number;
};

export type BookFormProps = {
    onSubmit: (values: Book) => void;
    onClose: () => void;
    modalOpen?: boolean;
    errMsg?: string | null;
};

export type AuthorFormProps = {
    onSubmit: (values: Author) => void;
    onClose: () => void;
    modalOpen?: boolean;
    errMsg?: string | null;
};

export type BookModalProps = {
    onSubmit: (values: Book) => void;
    onClose: () => void;
    modalOpen: boolean;
    errMsg?: string | null;
};

export type AuthorModalProps = {
    onSubmit: (values: Author) => void;
    onClose: () => void;
    modalOpen: boolean;
    errMsg?: string | null;
};