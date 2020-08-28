import { User } from '../src/types';
import { Author, Gender } from "../src/types";

export const tester_user: User = {
    username: 'cypress_tester@email.com',
    password: 'cypress1234',
};

export const dummy_user: User = {
    username: 'dummy_tester@email.com',
    password: 'dummy1234',
};

export const dummy_author: Author = {
    ssn: '9999999999999',
    name: 'created by jest code',
    birth: '2020-01-01',
    address: 'undefined',
    gender: Gender.Other,
    uploader: '',
};