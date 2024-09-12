import express, { Request, Response } from "express";
import { currentUser, requireAuth, validateRequest } from "@ebazdev/core";
import { Customer } from "../shared/models/customer";
import { query } from "express-validator";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get(
  "/get",
  [query("id").notEmpty().isString().withMessage("ID is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const customer = await Customer.findById(req.query.id);

    res.status(StatusCodes.OK).send(customer);
  }
);

export { router as getRouter };
