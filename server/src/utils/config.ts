import * as dotenv from "dotenv";
dotenv.config();

export const PORT: number = parseInt(process.env.PORT as string) || 3000;
export const MONGODB_URI: string = process.env.MONGODB_URI?.toString() || 'undefined';
export const SECRET_KEY: string = process.env.SECRET_KEY?.toString() || 'sekret';
export const REDIS_HOST: string = process.env.REDIS_HOST?.toString() || 'undefiend';
export const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD?.toString() || 'undefined';