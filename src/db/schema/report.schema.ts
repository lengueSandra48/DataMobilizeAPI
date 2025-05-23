import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "./helpers.schema";
import { v7 as uuid } from "uuid";
import { users } from "./user.schema";

export const reports = pgTable("reports", {
  id: text("id")
    .$defaultFn(() => uuid())
    .primaryKey()
    .notNull()
    .unique(),
  data: jsonb("data").notNull(),
  userId: text("userId").references(() => users.id),
  ...timestamps,
});
