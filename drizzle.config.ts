import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import {
  DATABASE,
  HOST,
  PORT,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from "./src/startup/config";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${HOST}:${POSTGRES_PORT}/${DATABASE}`,
  },
  migrations: {
    table: "my-migrations-table", 
    schema: "public", 
  },
});
