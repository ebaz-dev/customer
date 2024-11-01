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
import {
  CustomerCode,
  CustomerType,
  Merchant,
  MerchantDoc,
  Supplier,
  SupplierDoc,
} from "@app/shared";
import { getCustomerNumber } from "@app/utils/customer-number-generate";
import { CustomerCreatedPublisher } from "@app/events/publisher/customer-created-publisher";
import { natsWrapper } from "@app/nats-wrapper";

const router = express.Router();

router.post(
  "/supplier",
  [body("name").notEmpty().isString().withMessage("Name is required")],
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const data = req.body;
      data.type = CustomerType.Supplier;
      data.customerNo = await getCustomerNumber(CustomerCode.Supplier);
      const customer = await Supplier.create(<SupplierDoc>data);
      await new CustomerCreatedPublisher(natsWrapper.client).publish(customer);
      await session.commitTransaction();
      res.status(StatusCodes.CREATED).send({ data: customer });
    } catch (error: any) {
      await session.abortTransaction();
      console.error("Customer create operation failed", error);
      throw new BadRequestError("Customer create operation failed");
    } finally {
      session.endSession();
    }
  }
);

export { router as boSupplierCreateRouter };
