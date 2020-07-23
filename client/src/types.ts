export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
};

export type GenderSelect = {
    value: Gender;
    label: string;
}

export interface Author {
    ssn: string;
    name: string;
    birth?: string;
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

export type AuthorInfo = Omit<Author, 'ssn'>;
export type BookInfo = Omit<Book, 'isbn'>;

export type State = {
    books: {
        [isbn: string]: Book,
    }
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
};

export type StateProviderProps = {
    reducer: React.Reducer<State, Action>;
    children: React.ReactElement;
};

export type RatingProps = {
    rating: number;
};

export type FormProps = {
    onSubmit: (values: Book) => void;
    onClose: () => void;
    modalOpen?: boolean;
    errMsg?: string | null;
};

export type ModalProps = {
    onSubmit: (values: Book) => void;
    onClose: () => void;
    modalOpen: boolean;
    errMsg?: string;
};