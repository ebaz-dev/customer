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
import { CustomerType, merchantRepo } from "../shared";

const router = express.Router();

router.post(
    "/supplier/code/save",
    [
        body("merchantId")
            .notEmpty()
            .isString()
            .withMessage("Merchant ID is required"),
        body("holdingKey")
            .notEmpty()
            .isString()
            .withMessage("Holding key is required"),
        body("tsId")
            .notEmpty()
            .isString()
            .withMessage("Tradeshop ID is required"),
    ], currentUser, requireAuth,
    validateRequest,
    async (req: Request, res: Response) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        const data = req.body;

        try {
            await merchantRepo.updateOne({
                condition: {
                    _id: data.merchantId,
                    type: CustomerType.Merchant
                }, data: {
                    $pull: { tradeShops: { holdingKey: data.holdingKey } }
                }
            });
            await merchantRepo.updateOne({
                condition: {
                    _id: data.merchantId,
                    type: CustomerType.Merchant
                }, data: {
                    $push: { tradeShops: { tsId: data.tsId, holdingKey: data.holdingKey } }
                }
            });
            await session.commitTransaction();
            res.status(StatusCodes.OK).send();
        } catch (error: any) {
            await session.abortTransaction();
            console.error("Product add operation failed", error);
            throw new BadRequestError("product add operation failed");
        } finally {
            session.endSession();
        }
    }
);

export { router as supplierCodeSaveRouter };
