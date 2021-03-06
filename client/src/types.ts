export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export enum ActiveItem {
  Home = "home",
  Book = "book",
  Author = "author",
  Login = "login",
  Info = "info",
}

export type GenderSelect = {
  value: Gender;
  label: string;
};

export interface Page {
  pagination: {
    total: number;
    count: number;
    page: number;
    limit: number;
  };
}

export interface Author {
  ssn: string;
  name: string;
  birth?: string;
  address?: string;
  gender: Gender;
  uploader: string;
}

export interface AuthorPage extends Page {
  data: Author[];
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

export interface BookPage extends Page {
  data: Book[];
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

export type AuthorInfo = Omit<Author, "ssn">;
export type BookInfo = Omit<Book, "isbn">;

export interface BookInput extends Omit<Book, "genres"> {
  genres: string;
}

export type State = {
  books: {
    [isbn: string]: Book;
  };
  authors: {
    [ssn: string]: Author;
  };
  userInfo: UserInfo;
  actived: ActiveItem;
  totalPage: number;
  curPage: number;
  pageLimit: number;
};

export type Action =
  | {
      type: "SET_BOOK_LIST";
      payload: Array<Book>;
    }
  | {
      type: "ADD_BOOK";
      payload: Book;
    }
  | {
      type: "DEL_BOOK";
      payload: Book;
    }
  | {
      type: "SET_AUTHOR_LIST";
      payload: Array<Author>;
    }
  | {
      type: "ADD_AUTHOR";
      payload: Author;
    }
  | {
      type: "DEL_AUTHOR";
      payload: Author;
    }
  | {
      type: "SET_USER";
      payload: UserInfo;
    }
  | {
      type: "SET_ACTIVE";
      payload: ActiveItem;
    }
  | {
      type: "SET_TOTAL_PAGE";
      payload: number;
    }
  | {
      type: "SET_CUR_PAGE";
      payload: number;
    }
  | {
      type: "SET_COUNT_PER_PAGE";
      payload: number;
    }
  | {
      type: "SET_PAGE_LIMIT";
      payload: number;
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
  oldPassword?: string;
}

export type BookFormProps = {
  onSubmit: (values: BookInput) => void;
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
  errMsg?: string | null;
};

export type PaginationProps = {
  postsPerPage: number;
  totalPosts: number;
  paginate: number;
};
