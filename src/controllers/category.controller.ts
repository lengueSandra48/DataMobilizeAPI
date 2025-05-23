import { Request, Response } from "express";
import { STATUS_CODE } from "../utils/error_code";
import categoryService from "../services/category.service";
import { CategoryInput } from "../types/category.type";

/**
 * Creates a new category
 * @param req - Request
 * @param res - Response
 * @returns Created category object or error message
 */
const create = async (req: Request, res: Response) => {
  const { name }: CategoryInput = req.body;
  try {
    const category = await categoryService.create({ name });
    return res.status(STATUS_CODE.SUCCESS).json(category);
  } catch (error) {
    console.log("Failed to create category with error: " + error);
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

/**
 * Retrieves all categories
 * @param req - Request
 * @param res - Response
 * @returns List of all categories or error message
 */
const findAll = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAll();
    return res.json(categories);
  } catch (error) {
    console.log("Failed to get categories with error: " + error);
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

/**
 * Retrieves a single category by ID
 * @param req - Request
 * @param res - Response
 * @returns Category object or error message
 */
const findOne = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getOne(req.params.id);
    if (!category) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: "Category not found" });
    }
    return res.json(category);
  } catch (error) {
    console.log("Failed to get category with error: " + error);
    return res.status(STATUS_CODE.SERVER_ERROR).json(error);
  }
};

export default { create, findAll, findOne };
