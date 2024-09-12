import express, { Request, Response } from "express";
import { currentUser, requireAuth, validateRequest } from "@ebazdev/core";
import { Customer } from "../shared/models/customer";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.post(
  "/create",
  [
    body("type")
      .notEmpty()
      .matches(/\b(?:supplier|merchant)\b/)
      .isString()
      .withMessage("Name is required"),
    body("name").notEmpty().isString().withMessage("Type is required"),
    body("regNo").notEmpty().isString().withMessage("Register is required"),
    body("address").notEmpty().isString().withMessage("Address is required"),
    body("phone").notEmpty().isString().withMessage("Phone is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const customer = await Customer.create(req.body);

    res.status(StatusCodes.CREATED).send(customer);
  }
);

export { router as createRouter };
