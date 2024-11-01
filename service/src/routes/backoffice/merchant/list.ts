import express, { Request, Response } from "express";
import { listAndCount, QueryOptions, validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { Merchant } from "@app/shared";
const router = express.Router();

router.get(
  "/merchant",
  validateRequest,
  async (req: Request, res: Response) => {
    const filter: any = req.query.filter || {};
    const criteria: any = {};
    if (filter.name) {
      criteria.name = {
        $regex: filter.name,
        $options: "i",
      };
    }
    if (filter.regNo) {
      criteria.regNo = {
        $regex: filter.regNo,
        $options: "i",
      };
    }
    if (filter.phone) {
      criteria.phone = {
        $regex: filter.phone,
        $options: "i",
      };
    }

    if (filter.parentId) {
      criteria.parentId = filter.parentId;
    }

    if (filter.userId) {
      criteria.userId = filter.userId;
    }

    const options: QueryOptions = <QueryOptions>req.query;
    options.sortBy = "updatedAt";
    options.sortDir = -1;
    const data = await listAndCount(criteria, Merchant, options);

    res.status(StatusCodes.OK).send(data);
  }
);

export { router as boMerchantListRouter };
