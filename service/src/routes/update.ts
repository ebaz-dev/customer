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
import mongoose, { Types } from "mongoose";
import { natsWrapper } from "../nats-wrapper";
import { CustomerUpdatedPublisher } from "../events/publisher/customer-updated-publisher";
import { Supplier, supplierRepo } from "../shared/models/supplier";
import { Merchant, merchantRepo } from "../shared/models/merchant";

const router = express.Router();

router.post(
  "/update",
  [
    body("id").notEmpty().isString().withMessage("ID is required"),
    body("name").notEmpty().isString().withMessage("Type is required"),
    body("regNo").notEmpty().isString().withMessage("Register is required")
  ],
  currentUser, requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const customer = await Customer.findOne({ _id: req.body.id });
      if (customer?.type === "supplier") {
        await supplierRepo.updateOne({ condition: { _id: req.body.id }, data: req.body });
      } else {
        await merchantRepo.updateOne({ condition: { _id: req.body.id }, data: req.body });
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
