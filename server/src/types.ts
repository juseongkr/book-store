export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
}

export interface Author {
    ssn: string;
    name: string;
    birth?: string;
    gender: Gender;
}

export interface Book {
    isbn: string;
    title: string;
    published: string;
    author: string;
    genres: string[];
    rating?: number;
    description?: string;
}

export type AuthorInfo = Omit<Author, 'ssn'>;