import express, { Request, Response } from "express";
import {
  BadRequestError,
  currentUser,
  requireAuth,
  validateRequest,
} from "@ebazdev/core";
import { Customer, CustomerDoc } from "../shared/models/customer";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { natsWrapper } from "../nats-wrapper";
import { CustomerUpdatedPublisher } from "../events/publisher/customer-updated-publisher";
import { Supplier } from "../shared/models/supplier";
import { Merchant } from "../shared/models/merchant";

const router = express.Router();

router.post(
  "/update",
  [
    body("id").notEmpty().isString().withMessage("ID is required"),
    body("name").notEmpty().isString().withMessage("Type is required"),
    body("regNo").notEmpty().isString().withMessage("Register is required"),
    body("address").notEmpty().isString().withMessage("Address is required"),
    body("phone").notEmpty().isString().withMessage("Phone is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const customer = await Customer.findById(req.body.id);
      if (customer?.type === "supplier") {
        await Supplier.updateOne({ _id: req.body.id }, req.body);
      } else {
        await Merchant.updateOne({ _id: req.body.id }, req.body);
      }
      await new CustomerUpdatedPublisher(natsWrapper.client).publish(
        <CustomerDoc>req.body
      );
      await session.commitTransaction();
      res.status(StatusCodes.OK).send();
    } catch (error: any) {
      await session.abortTransaction();
      console.error("Customer update operation failed", error);
      throw new BadRequestError("Customer update operation failed");
    } finally {
      session.endSession();
    }
  }
);

export { router as updateRouter };
