import { Request, Response } from "express";
import roadService from "../services/roadType.service";
import { STATUS_CODE } from "../utils/error_code";
import { RoadInput } from "../types/roadType.type";

/**
 * Creates a new road
 * @param req - Request
 * @param res - Response
 * @returns Created road object or error message
 */
const create = async (req: Request, res: Response) => {
  const { name, roadType }: RoadInput = req.body;
  try {
    const road = await roadService.create({ name, roadType });
    return res.status(STATUS_CODE.SUCCESS).json(road);
  } catch (error) {
    console.log("Failed to create road with error: " + error);
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

/**
 * Retrieves a single road by ID
 * @param req - Request
 * @param res - Response
 * @returns Road object or error message
 */
const findOne = async (req: Request, res: Response) => {
  try {
    const road = await roadService.getOne(req.params.id);
    if (!road) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: "Road not found" });
    }
    return res.json(road);
  } catch (error) {
    console.log("Failed to get road with error: " + error);
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

/**
 * Retrieves all roads
 * @param req - Request
 * @param res - Response
 * @returns List of all roads or error message
 */
const findAll = async (req: Request, res: Response) => {
  try {
    const roads = await roadService.getAll();
    return res.json(roads);
  } catch (error) {
    console.log("Failed to get roads with error: " + error);
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

/**
 * Deletes a road by ID
 * @param req - Request
 * @param res - Response
 * @returns Success message or error message
 */
const deleteOne = async (req: Request, res: Response) => {
  try {
    await roadService.deleteOne(req.params.id);
    return res.status(STATUS_CODE.SUCCESS).send();
  } catch (error) {
    console.log("Failed to delete road with error: " + error);
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

/**
 * Updates an existing road and returns the updated road
 * @param req - Request
 * @param res - Response
 * @returns Updated road object or error message
 */
const updateOne = async (req: Request, res: Response) => {
  const { name, roadType }: RoadInput = req.body;
  try {
    const road = await roadService.updateOne(req.params.id, {
      name,
      roadType,
    });
    return res.status(STATUS_CODE.SUCCESS).json({ road });
  } catch (error) {
    console.log("Failed to update road with error: " + error);
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

export default { create, findOne, findAll, deleteOne, updateOne };
