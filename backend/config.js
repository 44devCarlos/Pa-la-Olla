import dotenv from "dotenv";
dotenv.config();

export const { PORT = 3305, DB_PASSWORD = "1234", PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
export const PAYPAL_API = "https://api-m.sandbox.paypal.com";