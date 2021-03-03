import * as dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT ?? "3000";

export const MONGODB_URI =
  process.env.MONGODB_URI?.toString() ?? "undefined";

export const SECRET_KEY =
  process.env.SECRET_KEY?.toString() ?? "sekret";

export const REDIS_HOST =
  process.env.REDIS_HOST?.toString() ?? "undefined";

export const REDIS_PASSWORD =
  process.env.REDIS_PASSWORD?.toString() ?? "undefined";
