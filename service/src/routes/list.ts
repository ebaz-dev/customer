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
const router = express.Router();

router.get(
  "/list",
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    console.log("customer/list", req.query);
    const criteria: any = {};
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
      criteria.parentId = req.query.parentId;
    }

    if (req.query.userId) {
      criteria.userId = req.query.userId;
    }

    if (req.query.type) {
      criteria.type = req.query.type;
    }
    aggregates.push({ $match: criteria });

    if (req.query.type && req.query.type === CustomerType.Supplier) {
      aggregates.push({
        $lookup: {
          from: "brands",
          localField: "_id",
          foreignField: "customerId",
          pipeline: [
            {
              $project: {
                id: "$_id",
                _id: 0,
                name: 1,
                slug: 1,
                image: 1,
              },
            },
          ],
          as: "brands",
        },
      });
    }
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
