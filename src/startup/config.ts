import { config } from "dotenv";
import axios from "axios";

config();

// database
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_PORT = process.env.POSTGRES_PORT;
export const PORT = process.env.PORT;
export const DATABASE = process.env.DATABASE;
export const HOST = process.env.HOST;

// email client
export const EMAIL_API_KEY = process.env.BREVO_API_KEY;
export const EMAIL_API_URL = process.env.BREVO_API_URL;

// kody
export const KODY_NOREPLY_EMAIL = process.env.KODY_NOREPLY_EMAIL;

// notification
export const API_NOTIFICATION_URL = process.env.API_NOTIFICATION_URL;

// http clients
export const emailHttpClient = axios.create({
  baseURL: EMAIL_API_URL,
  headers: {
    "api-key": EMAIL_API_KEY,
    "content-type": "application/json",
    accept: "application/json",
  },
});

// google
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
export const CALLBACK_URL = process.env.CALLBACK_URL;
export const DATABASE_URL = process.env.DATABASE_URL;
export const SESSION_SECRET = process.env.SESSION_SECRET;
