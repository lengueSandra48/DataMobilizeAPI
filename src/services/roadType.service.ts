import { roads } from "../db/schema/roadType.schema";
import { eq } from "drizzle-orm";
import { db } from "../utils/db";
import { RoadInput } from "../types/roadType.type";

/**
 * Creates a new road
 * @param road - Road data to create
 * @returns Created road object or null if creation failed
 */
const create = async (road: RoadInput): Promise<RoadInput | null> => {
  const response = await db
    .insert(roads)
    .values(road)
    .onConflictDoNothing()
    .returning();
  return response.length > 0 ? response[0] : null;
};

/**
 * Retrieves all roads
 * @returns List of all roads
 */
const getAll = async (): Promise<RoadInput[]> => {
  return await db.select().from(roads);
};

/**
 * Retrieves a single road by ID
 * @param id - Road ID
 * @returns Road object or null if not found
 */
const getOne = async (id: string): Promise<RoadInput | null> => {
  const response = await db.select().from(roads).where(eq(roads.id, id));
  return response.length > 0 ? response[0] : null;
};

/**
 * Deletes a road by ID
 * @param id - Road ID
 */
const deleteOne = async (id: string): Promise<void> => {
  await db.delete(roads).where(eq(roads.id, id));
};

/**
 * Updates an existing road and returns the updated road
 * @param id - Road ID
 * @param road - Road data to update
 * @returns Updated road object or null if not found
 */
const updateOne = async (
  id: string,
  road: RoadInput
): Promise<RoadInput | null> => {
  const response = await db
    .update(roads)
    .set(road)
    .where(eq(roads.id, id))
    .returning();
  return response.length > 0 ? response[0] : null;
};

export default { create, deleteOne, updateOne, getAll, getOne };
