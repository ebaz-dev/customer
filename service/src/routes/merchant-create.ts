import express, { Request, Response } from "express";
import {
  BadRequestError,
  currentUser,
  requireAuth,
  validateRequest,
} from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { Merchant, MerchantDoc } from "../shared/models/merchant";

const router = express.Router();

router.post(
  "/merchant/create",
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const { business: businessData, branch: branchData } = req.body;
      businessData.userId = req.currentUser?.id;
      branchData.userId = req.currentUser?.id;
      const insertData = <MerchantDoc>branchData;
      insertData.businessName = businessData.name;
      insertData.regNo = businessData.regNo;
      const merchant = await Merchant.create(insertData);
      await session.commitTransaction();
      res.status(StatusCodes.CREATED).send({
        data: {
          id: merchant.id,
          name: merchant.businessName,
          regNo: merchant.regNo,
          branches: [merchant],
        },
      });
    } catch (error: any) {
      await session.abortTransaction();
      console.error("Merchant create operation failed", error);
      throw new BadRequestError("Mercchant create operation failed");
    } finally {
      session.endSession();
    }
  }
);

export { router as merchantCreateRouter };
