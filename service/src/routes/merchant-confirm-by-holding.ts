import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { body } from "express-validator";
import { HoldingAPIClient } from "../utils/HoldingApiClient";
import { HoldingSupplierCodes } from "../shared";

const router = express.Router();

router.get(
  "/merchant/holding/confirm",
  [
    body("tradeShopId")
      .notEmpty()
      .isString()
      .withMessage(" register number must be defined"),
    body("register_number")
      .notEmpty()
      .isString()
      .withMessage(" register number must be defined"),
    body("holdingKey")
      .custom((value) => {
        if (!Object.values(HoldingSupplierCodes).includes(value)) {
          return false;
        }
        return true;
      })
      .withMessage(
        "Invalid holdingKey. Must be one of the predefined enum values."
      ),
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const { tradeShopId, register_number, holdingKey } = req.query as {
      tradeShopId: string;
      register_number: string;
      holdingKey: HoldingSupplierCodes;
    };

    const data = await HoldingAPIClient.getClient().getMerchantInfo(
      tradeShopId,
      register_number,
      holdingKey
    );

    res.status(StatusCodes.OK).send({ data });
  }
);

export { router as merchantConfirmByHolding };
