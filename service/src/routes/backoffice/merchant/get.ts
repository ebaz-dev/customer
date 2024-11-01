import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { Merchant } from "@app/shared";

const router = express.Router();

router.get(
  "/merchant/:id",
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const merchant = await Merchant.findById(req.params.id as string);

    res.status(StatusCodes.OK).send({ data: merchant });
  }
);

export { router as boMerchantGetRouter };
