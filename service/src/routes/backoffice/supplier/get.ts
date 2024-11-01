import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { Supplier } from "@app/shared";

const router = express.Router();

router.get(
  "/supplier/:id",
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const supplier = await Supplier.findById(req.params.id as string);

    res.status(StatusCodes.OK).send({ data: supplier });
  }
);

export { router as boSupplierGetRouter };
