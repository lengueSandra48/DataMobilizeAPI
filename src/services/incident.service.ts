import { eq } from "drizzle-orm";
import { incidents } from "../db/schema/incident.schema";
import { db } from "../utils/db";
import { IncidentInput } from "../types/incident.type";

/**
 * Creates a new incident
 * @param incident - IncidentInput data to create
 * @returns Created incident object or null if creation failed
 */
const create = async (
  incident: IncidentInput
): Promise<IncidentInput | null> => {
  const resp = await db.insert(incidents).values(incident).returning();
  return resp.length > 0 ? resp[0] : null;
};

/**
 * Retrieves all incidents
 * @returns List of all incidents
 */
const getAll = async (): Promise<IncidentInput[]> => {
  return db.select().from(incidents);
};

/**
 * Retrieves a single incident by ID
 * @param id - IncidentInput ID
 * @returns IncidentInput object or null if not found
 */
const getOne = async (id: string): Promise<IncidentInput | null> => {
  const resp = await db.select().from(incidents).where(eq(incidents.id, id));
  return resp.length > 0 ? resp[0] : null;
};

/**
 * Deletes an incident by ID
 * @param id - IncidentInput ID
 */
const deleteOne = async (id: string): Promise<void> => {
  await db.delete(incidents).where(eq(incidents.id, id));
};

/**
 * Updates an existing incident and returns the updated incident
 * @param id - IncidentInput ID
 * @param report - IncidentInput data to update
 * @returns Updated incident object or null if not found
 */
const updateOne = async (id: string, incident: IncidentInput) => {
  const resp = await db
    .update(incidents)
    .set(incident)
    .where(eq(incidents.id, id))
    .returning();
  return resp.length > 0 ? resp[0] : null;
};

export default { create, getAll, getOne, deleteOne, updateOne };
