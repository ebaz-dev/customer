import express, { Request, Response } from "express";
import { listAndCount, QueryOptions, validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { Employee, Merchant } from "../../../shared";
import { Types } from "mongoose";
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
      criteria.parentId = new Types.ObjectId(filter.parentId as string);
    }

    if (filter.userId) {
      const userCustomers = await Employee.find({
        userId: new Types.ObjectId(filter.userId as string),
      });
      const ids = userCustomers.map((customer) => customer.customerId);
      criteria._id = { $in: ids };
    }

    const options: QueryOptions = <QueryOptions>req.query;
    options.sortBy = "updatedAt";
    options.sortDir = -1;

    options.populates = [
      { path: "category" },
      { path: "city" },
      { path: "district" },
      { path: "subDistrict" },
    ];
    const data = await listAndCount(criteria, Merchant, options);

    res.status(StatusCodes.OK).send(data);
  }
);

export { router as boMerchantListRouter };
