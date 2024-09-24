import express, { Request, Response } from "express";
import { validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { CustomerCategory } from "../shared";
import { query } from "express-validator";

const router = express.Router();

router.get("/category/list", [query("type").notEmpty().isString().withMessage("Type is required")], validateRequest, async (req: Request, res: Response) => {
  const criteria: any = { type: req.query.type, parentId: { $exists: false } };

  const customers = await CustomerCategory.aggregate([{ $match: criteria },
  {
    $lookup: {
      from: "customercategories",
      localField: "_id",
      foreignField: "parentId",
      as: "subCategories"
    }
  }]);

  res.status(StatusCodes.OK).send({ data: customers, total: customers.length });
})

export { router as categoryListRouter };
