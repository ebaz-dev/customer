import express, { Request, Response } from "express";
import { currentUser, requireAuth, validateRequest } from "@ebazdev/core";
import { Customer } from "../shared/models/customer";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.post(
  "/update",
  [
    body("id").notEmpty().isString().withMessage("ID is required"),
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
    const customer = await Customer.updateOne(req.body, { _id: req.body.id });

    res.status(StatusCodes.OK).send(customer);
  }
);

export { router as updateRouter };
