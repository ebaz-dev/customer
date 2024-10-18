import express, { Request, Response } from "express";
import {
  BadRequestError,
  currentUser,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@ebazdev/core";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { CustomerHolding, Merchant, Supplier } from "../shared";

const router = express.Router();

router.post(
  "/holding/login",
  [
    body("merchantId")
      .notEmpty()
      .isString()
      .withMessage("Merchant ID is required"),
    body("supplierId")
      .notEmpty()
      .isString()
      .withMessage("Holding key is required"),
    body("tsId").notEmpty().isString().withMessage("Tradeshop ID is required"),
    body("regNo").notEmpty().isString().withMessage("Register is required"),
  ],
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const data = req.body;

    try {
      const supplier = await Supplier.findById(data.supplierId);
      if (!supplier) {
        throw new Error("Supplier Not Found");
      }
      if (!supplier.holdingKey) {
        throw new Error("Supplier Holding key not applied");
      }
      const merchant = await Merchant.findById(data.merchantId);
      if (!merchant) {
        throw new Error("Merchant not found");
      }

      if (!merchant.parentId) {
        throw new Error("Merchant does not have parent");
      }

      const parent = await Merchant.findById(merchant.parentId);

      if (!parent) {
        throw new Error("Merchant does not have parent");
      }

      if (parent.regNo != data.regNo) {
        throw new Error("Register does not match");
      }

      const customerHolding = await CustomerHolding.findOne({
        supplierId: data.supplierId,
        tradeShopId: data.tsId,
        regNo: data.regNo,
      });

      if (!customerHolding) {
        throw new Error("Holding customer not found");
      }
      if (customerHolding.merchantId) {
        throw new Error("Holding customer synced with another merchant");
      }

      if (merchant.tradeShops) {
        const foundTradeShop = merchant.tradeShops.find(
          (tradesShop) => tradesShop.holdingKey === supplier.holdingKey
        );
        if (foundTradeShop) {
          throw new Error("Holding tradeshop already synced");
        }

        merchant.tradeShops?.push({
          tsId: data.tsId,
          holdingKey: supplier.holdingKey,
        });
      } else {
        merchant.tradeShops = [
          {
            tsId: data.tsId,
            holdingKey: supplier.holdingKey,
          },
        ];
      }

      await merchant.save();
      customerHolding.merchantId = merchant.id;
      await customerHolding.save();
      await session.commitTransaction();
      res.status(StatusCodes.OK).send({ data: merchant });
    } catch (error: any) {
      await session.abortTransaction();
      console.error("Update holding code operation failed", error);
      throw new BadRequestError(error.message);
    } finally {
      session.endSession();
    }
  }
);

export { router as holdingLoginRouter };
