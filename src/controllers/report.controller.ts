import { Request, Response } from "express";
import { STATUS_CODE } from "../utils/error_code";
import { ReportInput } from "../types/report.type";
import reportService from "../services/report.service";
import userService from "../services/user.service";

/**
 * Creates a new report
 * @param req - Request
 * @param res - Response
 * @returns Created report object or error message
 */
const create = async (req: Request, res: Response) => {
  const { userId, data }: ReportInput = req.body;
  try {
    const user = await userService.getOne(userId);
    if (!user) {
      return res
        .status(STATUS_CODE.USER_NOT_FOUND)
        .json({ message: "User Not found" });
    }
    const report = await reportService.create({
      data,
      userId: user.id,
    });
    return res.json({ report });
  } catch (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

/**
 * Retrieves all reports
 * @param req - Request
 * @param res - Response
 * @returns List of all reports or error message
 */
const findAll = async (req: Request, res: Response) => {
  try {
    const reports = await reportService.getAll();
    return res.json({ reports });
  } catch (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

/**
 * Retrieves a single report by ID
 * @param req - Request
 * @param res - Response
 * @returns Report object or error message
 */
const findOne = async (req: Request, res: Response) => {
  try {
    const report = await reportService.getOne(req.params.id);
    return res.json({ report });
  } catch (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

/**
 * Deletes a report by ID
 * @param req - Request
 * @param res - Response
 * @returns Success message or error message
 */
const deleteOne = async (req: Request, res: Response) => {
  try {
    await reportService.deleteReport(req.params.id);
    return res.json({ message: "The report has been deleted successfuly !" });
  } catch (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

/**
 * Updates an existing report and returns the updated report
 * @param req - Request
 * @param res - Response
 * @returns Updated report object or error message
 */
const updateOne = async (req: Request, res: Response) => {
  const { data }: ReportInput = req.body;
  try {
    const report = await reportService.updateReport(req.params.id, {
      data,
      userId: req.params.userId,
    });
    return res.json(report);
  } catch (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

const findAllWithIncident = async (req: Request, res: Response) => {
  try {
    const reports = await reportService.getReportsWithIncidents();
    return res.json({ reports });
  } catch (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).json({ message: "failed" });
  }
};

export default {
  create,
  findOne,
  findAll,
  deleteOne,
  updateOne,
  findAllWithIncident,
};
