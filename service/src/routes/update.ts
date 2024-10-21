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
import { Supplier, SupplierDoc } from "../shared/models/supplier";
import { Merchant, MerchantDoc } from "../shared/models/merchant";

const router = express.Router();

router.post(
  "/update",
  [body("id").notEmpty().isString().withMessage("ID is required")],
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const customer = await Customer.findOne({ _id: req.body.id }).session(
        session
      );

      if (customer?.type === "supplier") {
        await Supplier.updateOne(
          { _id: req.body.id },
          <SupplierDoc>req.body
        ).session(session);
      } else {
        await Merchant.updateOne(
          { _id: req.body.id },
          <MerchantDoc>req.body
        ).session(session);
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
