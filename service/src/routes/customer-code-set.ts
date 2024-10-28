import express, { Request, Response } from "express";
import {
  BadRequestError,
  currentUser,
  requireAuth,
  validateRequest,
} from "@ebazdev/core";
import {
  Customer,
  CustomerCode,
  CustomerDoc,
  CustomerType,
} from "../shared/models/customer";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { natsWrapper } from "../nats-wrapper";
import { CustomerUpdatedPublisher } from "../events/publisher/customer-updated-publisher";
import { Supplier, SupplierDoc } from "../shared/models/supplier";
import { Merchant, MerchantDoc } from "../shared/models/merchant";
import _ from "lodash";
import { getCustomerNumber } from "../utils/customer-number-generate";

const router = express.Router();

router.post(
  "/code/update",
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const customers = await Customer.find({ customerNo: { $exists: false } });

      const promises = _.map(customers, async (customer) => {
        let customerNo = "";
        if (customer.type === CustomerType.Supplier) {
          customerNo = await getCustomerNumber(CustomerCode.Supplier);
        } else {
          customerNo = await getCustomerNumber(CustomerCode.Merchant);
        }
        await Customer.updateOne(
          { _id: customer.id },
          { $set: { customerNo } }
        );
        return customer;
      });
      const result = await Promise.all(promises);

      await session.commitTransaction();
      res.status(StatusCodes.OK).send({ customers, result });
    } catch (error: any) {
      await session.abortTransaction();
      console.error("Customer update operation failed", error);
      throw new BadRequestError("Customer update operation failed");
    } finally {
      session.endSession();
    }
  }
);

export { router as codeUpdateRouter };
