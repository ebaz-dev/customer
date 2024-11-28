import express, { Request, Response } from "express";
import { BadRequestError, validateRequest } from "@ebazdev/core";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import {
  CustomerCode,
  CustomerType,
  Employee,
  Merchant,
  MerchantDoc,
} from "../../../shared";
import { getCustomerNumber } from "../../../utils/customer-number-generate";
import { CustomerCreatedPublisher } from "../../../events/publisher/customer-created-publisher";
import { natsWrapper } from "../../../nats-wrapper";
import { EmployeeRoles } from "../../../shared/types/employee-roles";

const router = express.Router();

router.post(
  "/merchant",
  [body("name").notEmpty().isString().withMessage("Name is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const data = req.body;
      data.type = CustomerType.Merchant;
      data.customerNo = await getCustomerNumber(CustomerCode.Merchant);
      const customer = new Merchant(<MerchantDoc>data);
      await customer.save({ session });
      const employee = new Employee({
        userId: req.currentUser?.id,
        customerId: customer.id,
        role: EmployeeRoles.Admin,
      });
      await employee.save({ session });
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

export { router as boMerchantCreateRouter };
