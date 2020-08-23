export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
}

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
    genres: Array<string>;
    rating?: number;
    description?: string;
    uploader: string;
}

export interface User {
    username: string;
    password: string;
    name?: string;
}

export type AuthorInfo = Omit<Author, 'ssn'>;