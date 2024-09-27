import express, { Request, Response } from "express";
import {
  BadRequestError,
  currentUser,
  requireAuth,
  validateRequest,
} from "@ebazdev/core";
import { CustomerType } from "../shared/models/customer";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { natsWrapper } from "../nats-wrapper";
import { CustomerCreatedPublisher } from "../events/publisher/customer-created-publisher";
import { Supplier, SupplierDoc } from "../shared/models/supplier";
import { Merchant, MerchantDoc } from "../shared/models/merchant";

const router = express.Router();

router.post(
  "/create",
  [
    body("type")
      .notEmpty()
      .matches(/\b(?:supplier|merchant)\b/)
      .isString()
      .withMessage("Type is required"),
    body("name").notEmpty().isString().withMessage("Name is required"),
    body("regNo").notEmpty().isString().withMessage("Register is required"),
  ],
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      let customer: any;
      const data = req.body;
      data.userId = req.currentUser?.id;
      if (data.type === "supplier") {
        data.type = CustomerType.Supplier;
        customer = await Supplier.create(<SupplierDoc>data);
      } else {
        data.type = CustomerType.Merchant;
        customer = await Merchant.create(<MerchantDoc>data);
      }
      await new CustomerCreatedPublisher(natsWrapper.client).publish(customer);
      await session.commitTransaction();
      res.status(StatusCodes.CREATED).send(customer);
    } catch (error: any) {
      await session.abortTransaction();
      console.error("Customer create operation failed", error);
      throw new BadRequestError("Customer create operation failed");
    } finally {
      session.endSession();
    }
  }
);

export { router as createRouter };
