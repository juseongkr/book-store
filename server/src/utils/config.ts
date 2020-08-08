import * as dotenv from "dotenv";
dotenv.config();

export const PORT: number = parseInt(process.env.PORT as string) || 3000;
export const MONGODB_URI: string = process.env.MONGODB_URI?.toString() || 'undefined';
export const JWT_SECRET: string = process.env.JWT_SECRET?.toString() || 'sekret';