import { eq, sql } from "drizzle-orm";
import { users } from "../db/schema/user.schema";
import { db } from "../utils/db";
import { CreateUserInput, User } from "../types/user.dto";
import { verifications } from "../db/schema/verification.schema";
import { reports } from "../db/schema/report.schema";
import { transformData } from "../utils/helper";

/**
 * Retrieves all users with their reports
 * @returns List of users with their reports
 */
const getAll = async () => {
  return await db.select().from(users);
};

/**
 * Retrieves all users with their associated reports
 * @returns List of users with their reports
 */
const getUsersWithReports = async () => {
  const res = await db
    .select({
      userId: users.id,
      email: users.email,
      username: users.username,
      reportId: reports.id,
      reportData: reports.data,
    })
    .from(users)
    .leftJoin(reports, eq(reports.userId, users.id));

  const usersMap = new Map<string, any>();

  res.forEach((row) => {
    if (!usersMap.has(row.userId)) {
      usersMap.set(row.userId, {
        id: row.userId,
        email: row.email,
        username: row.username,
        reports: [],
      });
    }

    if (row.reportId) {
      usersMap.get(row.userId).reports.push({
        id: row.reportId,
        data: row.reportData,
      });
    }
  });

  return Array.from(usersMap.values());
};

/**
 * Retrieves a single user by ID
 * @param id - User ID
 * @returns User object or null if not found
 */
const getOne = async (id: string): Promise<User> => {
  const user = await db.select().from(users).where(eq(users.id, id));
  return user.length > 0 ? user[0] : null;
};

/**
 * Retrieves a single user by username
 * @param username - Username
 * @returns User object or null if not found
 */
const getByUsername = async (username: string) => {
  const user = await db
    .select()
    .from(users)
    .where(sql`${users.username} = ${username}`);
  return user.length > 0 ? user[0] : null;
};

const getByEmail = async (email: string) => {
  const resp = await db.select().from(users).where(eq(users.email, email));
  return resp.length > 0 ? resp[0] : null;
};

const create = async (input: CreateUserInput): Promise<User> => {
  const newUser = await db.insert(users).values(input).returning();
  return newUser[0];
};

/**
 * Updates an existing user and returns the updated user
 * @param user - User data to update
 * @returns Updated user object or null if not found
 */
const updateOne = async (user: User): Promise<User> => {
  const resp = await db
    .update(users)
    .set(user)
    .where(eq(users.id, user.id))
    .returning();
  return resp.length > 0 ? resp[0] : null;
};

/**
 * Deletes a user by ID
 * @param id - User ID
 */
const deleteOne = async (id: string) => {
  // remove all verification codes from user
  await db.delete(verifications).where(eq(verifications.userId, id));

  // remove user
  await db.delete(users).where(eq(users.id, id));
};

export default {
  getOne,
  getAll,
  create,
  getByUsername,
  getByEmail,
  updateOne,
  deleteOne,
  getUsersWithReports,
};
