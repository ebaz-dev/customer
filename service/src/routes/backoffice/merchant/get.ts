import express, { Request, Response } from "express";
import { validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { Merchant } from "../../../shared";

const router = express.Router();

router.get(
  "/merchant/:id",
  validateRequest,
  async (req: Request, res: Response) => {
    const merchant = await Merchant.findById(req.params.id as string)
      .populate({ path: "category" })
      .populate({ path: "city" })
      .populate({ path: "district" })
      .populate({ path: "subDistrict" });

    res.status(StatusCodes.OK).send({ data: merchant });
  }
);

export { router as boMerchantGetRouter };
