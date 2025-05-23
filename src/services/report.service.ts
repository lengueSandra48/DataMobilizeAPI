import { eq } from "drizzle-orm";
import { reports } from "../db/schema/report.schema";
import { db } from "../utils/db";
import { incidents } from "../db/schema/incident.schema";

/**
 * Creates a new report
 * @param report - Report data to create
 * @returns Created report object or null if creation failed
 */
const create = async (report) => {
  const response = await db.insert(reports).values(report).returning();
  return response.length > 0 ? response[0] : null;
};

/**
 * Retrieves a single report by ID
 * @param id - Report ID
 * @returns Report object or null if not found
 */
const getOne = async (id: string) => {
  const report = await db.select().from(reports).where(eq(reports.id, id));
  return report.length > 0 ? report[0] : null;
};

/**
 * Retrieves all reports
 * @returns List of all reports
 */
const getAll = async () => {
  return await db.select().from(reports);
};

/**
 * Deletes a report by ID
 * @param id - Report ID
 */
const deleteReport = async (id: string): Promise<void> => {
  await db.delete(reports).where(eq(reports.id, id));
};

/**
 * Updates an existing report and returns the updated report
 * @param id - Report ID
 * @param report - Report data to update
 * @returns Updated report object or null if not found
 */
const updateReport = async (id: string, report) => {
  const response = await db
    .update(reports)
    .set(report)
    .where(eq(reports.id, id))
    .returning();
  return response.length > 0 ? response[0] : null;
};

/**
 * Retrieves all reports with their associated incidents
 * @returns List of reports with their incidents
 */
const getReportsWithIncidents = async () => {
  const res = await db
    .select({
      reportId: reports.id,
      userId: reports.userId,
      incidentId: incidents.id,
      incidentDescription: incidents.description,
    })
    .from(reports)
    .leftJoin(incidents, eq(incidents.reportId, reports.id));

  const reportsMap = new Map<string, any>();

  res.forEach((row) => {
    if (!reportsMap.has(row.reportId)) {
      reportsMap.set(row.reportId, {
        id: row.reportId,
        userId: row.userId,
        incidents: [],
      });
    }

    if (row.incidentId) {
      reportsMap.get(row.reportId).incidents.push({
        id: row.incidentId,
        description: row.incidentDescription,
      });
    }
  });

  return Array.from(reportsMap.values());
};

export default {
  create,
  getOne,
  getAll,
  deleteReport,
  updateReport,
  getReportsWithIncidents,
};
