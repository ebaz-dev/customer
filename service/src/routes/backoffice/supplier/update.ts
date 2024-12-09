import express, { Request, Response } from "express";
import { BadRequestError, validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { CustomerDoc, Supplier, SupplierDoc } from "../../../shared";
import { CustomerUpdatedPublisher } from "../../../events/publisher/customer-updated-publisher";
import { natsWrapper } from "../../../nats-wrapper";
const router = express.Router();

router.put(
  "supplier/:id",
  validateRequest,
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      await Supplier.updateOne(
        { _id: req.params.id },
        <SupplierDoc>req.body
      ).session(session);

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

export { router as boSupplierUpdateRouter };
