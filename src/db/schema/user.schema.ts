import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./helpers.schema";
import { v7 as uuid } from "uuid";

export const users = pgTable("users", {
  id: text("id")
    .$defaultFn(() => uuid())
    .primaryKey()
    .notNull()
    .unique(),
  username: varchar("username", { length: 30 }),
  googleId: varchar("google_id"),
  email: varchar("email").unique().notNull(),
  password: varchar("password"),
  localisation: varchar("localisation", { length: 30 }),
  expoPushToken: varchar("expoPushToken"),
  isVerified: boolean("isVerified").default(false),
  ...timestamps,
});
