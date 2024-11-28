import express, { Request, Response } from "express";
import {
  currentUser,
  listAndCount,
  QueryOptions,
  requireAuth,
  validateRequest,
} from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { Employee } from "../../shared/models/employee";
import { User } from "@ebazdev/auth";

const router = express.Router();

router.get(
  "/employee/:id",
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const employee = await Employee.findById(req.params.id)
      .populate("user")
      .populate("customer");

    res.status(StatusCodes.OK).send({ data: employee });
  }
);

export { router as employeeGetRouter };
