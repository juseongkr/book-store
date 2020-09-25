import { Document } from 'mongoose';
import User from '../models/user';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../types';

export const validateUserPassword = async (userDto: UserDto): Promise<Document | null> => {
    const { username, password } = userDto;
    const user: Document | null = await User.findOne({ username, deactivated: false });
    if (user) {
        return await bcrypt.compare(password, user.get('password')) ? user : null;
    }

    return user;
};

export const updateUserInfo = async (userDto: UserDto, newUser: Document): Promise<Document | null> => {
    const { username } = userDto;

    return await User.findOneAndUpdate({ username, deactivated: false }, newUser, { new: true });
}

export const hashPassword = async (password: string, saltRound=12): Promise<string> => {
    return await bcrypt.hash(password, saltRound);
}