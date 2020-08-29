import * as dotenv from "dotenv";
dotenv.config();

export const PORT: string = process.env.PORT ?? '3000';
export const MONGODB_URI: string = process.env.MONGODB_URI?.toString() ?? 'undefined';
export const SECRET_KEY: string = process.env.SECRET_KEY?.toString() ?? 'sekret';
export const REDIS_HOST: string = process.env.REDIS_HOST?.toString() ?? 'undefined';
export const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD?.toString() ?? 'undefined';

export const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;