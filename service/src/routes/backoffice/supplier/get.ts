import express, { Request, Response } from "express";
import { validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { Supplier } from "../../../shared";

const router = express.Router();

router.get(
  "/supplier/:id",
  validateRequest,
  async (req: Request, res: Response) => {
    const supplier = await Supplier.findById(req.params.id as string);

    res.status(StatusCodes.OK).send({ data: supplier });
  }
);

export { router as boSupplierGetRouter };
