export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
}

export enum ActiveItem {
    Home = 'home',
    Book = 'book',
    Author = 'author',
    Login = 'login',
    Info = 'info',
}

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
    uploader: string;
}

export interface Book {
    isbn: string;
    title: string;
    published: string;
    author: string;
    genres: string[];
    rating?: number;
    description?: string;
    uploader: string;
}

export interface User {
    username: string;
    password: string;
    name?: string;
}

export interface UserInfo {
    username: string;
    id: string;
    name?: string;
}

export type AuthorInfo = Omit<Author, 'ssn'>;
export type BookInfo = Omit<Book, 'isbn'>;

export type State = {
    books: {
        [isbn: string]: Book,
    },
    authors: {
        [ssn: string]: Author,
    },
    userInfo: UserInfo,
    actived: ActiveItem,
};

export type Action =
| {
    type: 'SET_BOOK_LIST';
    payload: Array<Book>;
} | {
    type: 'ADD_BOOK';
    payload: Book;
} | {
    type: 'DEL_BOOK';
    payload: Book;
} | {
    type: 'SET_AUTHOR_LIST';
    payload: Array<Author>;
} | {
    type: 'ADD_AUTHOR';
    payload: Author;
} | {
    type: 'DEL_AUTHOR';
    payload: Author;
} | {
    type: 'SET_USER';
    payload: UserInfo;
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

export interface NewUser extends User {
    passwordCheck?: string;
}

export type BookFormProps = {
    onSubmit: (values: Book) => void;
    onClose: () => void;
    modalOpen: boolean;
    errMsg?: string | null;
};

export type AuthorFormProps = {
    onSubmit: (values: Author) => void;
    onClose: () => void;
    modalOpen: boolean;
    errMsg?: string | null;
};

export type RegisterFormProps = {
    onSubmit: (values: NewUser) => void;
    onClose: () => void;
    modalOpen: boolean;
    errMsg? : string | null;
};