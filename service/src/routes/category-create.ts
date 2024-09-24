import express, { Request, Response } from "express";
import {
  BadRequestError,
  currentUser,
  requireAuth,
  validateRequest,
} from "@ebazdev/core";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { CustomerCategory } from "../shared/models/customer-category";

const router = express.Router();

router.post(
  "/category/create",
  [
    body("type")
      .notEmpty()
      .matches(/\b(?:supplier|merchant)\b/)
      .isString()
      .withMessage("Type is required"),
    body("name").notEmpty().isString().withMessage("Name is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const data = req.body;
      const category = await CustomerCategory.create(data);
      await session.commitTransaction();
      res.status(StatusCodes.CREATED).send(category);
    } catch (error: any) {
      await session.abortTransaction();
      console.error("Customer category create operation failed", error);
      throw new BadRequestError("Customer category create operation failed");
    } finally {
      session.endSession();
    }
  }
);

export { router as categoryCreateRouter };
