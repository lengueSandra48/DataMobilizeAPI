import { Request, Response } from "express";
import { STATUS_CODE } from "../utils/error_code";
import reportService from "../services/report.service";
import incidentService from "../services/incident.service";
import { IncidentInput } from "../types/incident.type";

const create = async (req: Request, res: Response) => {
  const {
    description,
    incidentType,
    reportId,
    responderType,
    severity,
  }: IncidentInput = req.body;
  try {
    const report = await reportService.getOne(reportId);
    if (!report) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: "Report Not found" });
    }
    const incident = await incidentService.create({
      description,
      incidentType,
      reportId,
      responderType,
      severity,
    });
    return res.json({ incident });
  } catch (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

const findAll = async (req: Request, res: Response) => {
  try {
    const incidents = await incidentService.getAll();
    return res.json({ incidents });
  } catch (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const incident = await incidentService.getOne(req.params.id);
    return res.json({ incident });
  } catch (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

const deleteOne = async (req: Request, res: Response) => {
  try {
    await incidentService.deleteOne(req.params.id);
    return res.json({ message: "The incident has been deleted successfuly !" });
  } catch (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

const updateOne = async (req: Request, res: Response) => {
  const {
    description,
    incidentType,
    reportId,
    responderType,
    severity,
  }: IncidentInput = req.body;
  try {
    const incident = await incidentService.updateOne(req.params.id, {
      description,
      incidentType,
      reportId,
      responderType,
      severity,
    });
    return res.json({ incident });
  } catch (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

export default {
  create,
  findAll,
  findOne,
  deleteOne,
  updateOne,
};
