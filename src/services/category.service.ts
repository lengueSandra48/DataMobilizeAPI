import { eq } from "drizzle-orm";
import { categories } from "../db/schema/category.schema";
import { CategoryInput } from "../types/category.type";
import { db } from "../utils/db";

/**
 * Creates a new category
 * @param category - CategoryInput data to create
 * @returns Created category object or null if creation failed
 */
const create = async (
  category: CategoryInput
): Promise<CategoryInput | null> => {
  const resp = await db
    .insert(categories)
    .values(category)
    .onConflictDoNothing()
    .returning();
  return resp.length > 0 ? resp[0] : null;
};

/**
 * Retrieves all categories
 * @returns List of all categories
 */
const getAll = async (): Promise<CategoryInput[]> => {
  return await db.select().from(categories);
};

/**
 * Retrieves a single category by ID
 * @param id - CategoryInput ID
 * @returns CategoryInput object or null if not found
 */
const getOne = async (id: string): Promise<CategoryInput | null> => {
  const resp = await db.select().from(categories).where(eq(categories.id, id));
  return resp.length > 0 ? resp[0] : null;
};

export default { create, getAll, getOne };
