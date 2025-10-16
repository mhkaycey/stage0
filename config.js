import { config } from "dotenv";
import process from "process";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
config();

export const {
    NODE_ENV,
    PORT,
    USER_EMAIL,
    USER_NAME,
    USER_STACK,
    DATABASE_URL,
    SERVER_URL,
    
 
} = process.env;