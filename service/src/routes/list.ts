import express, { Request, Response } from "express";
import {
  aggregateAndCount,
  currentUser,
  QueryOptions,
  requireAuth,
  validateRequest,
} from "@ebazdev/core";
import { Customer, CustomerType } from "../shared/models/customer";
import { StatusCodes } from "http-status-codes";
import { query } from "express-validator";
import mongoose, { Types } from "mongoose";
const router = express.Router();

router.get(
  "/list",
  [
    query("ids")
      .optional()
      .custom((value) => {
        const idsArray = value.split(",").map((id: string) => id.trim());
        return idsArray.every((id: string) =>
          mongoose.Types.ObjectId.isValid(id)
        );
      })
      .withMessage("IDs must be a comma-separated list of valid ObjectIds"),
  ],
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    console.log("customer/list", req.query);
    const criteria: any = { parentId: { $exists: false } };
    const aggregates: any = [];
    if (req.query.name) {
      criteria.name = {
        $regex: req.query.name,
        $options: "i",
      };
    }
    if (req.query.regNo) {
      criteria.regNo = {
        $regex: req.query.regNo,
        $options: "i",
      };
    }
    if (req.query.phone) {
      criteria.phone = {
        $regex: req.query.phone,
        $options: "i",
      };
    }

    if (req.query.parentId) {
      criteria["$or"] = [
        { _id: new Types.ObjectId(req.query.parentId as string) },
        { parentId: new Types.ObjectId(req.query.parentId as string) },
      ];
    }

    if (req.query.ids) {
      const idsArray = (req.query.ids as string)
        .split(",")
        .map((id) => new Types.ObjectId(id.trim()));
      criteria._id = { $in: idsArray };
    }

    if (req.query.userId) {
      criteria.userId = req.query.userId;
    }

    if (req.query.type) {
      criteria.type = req.query.type;
    }
    aggregates.push({ $match: criteria });

    aggregates.push({
      $addFields: {
        id: "$_id",
      },
    });
    aggregates.push({
      $unset: "_id",
    });
    const options: QueryOptions = <QueryOptions>req.query;
    options.sortBy = "updatedAt";
    options.sortDir = -1;
    const data = await aggregateAndCount(Customer, options, aggregates);

    res.status(StatusCodes.OK).send(data);
  }
);

export { router as listRouter };
