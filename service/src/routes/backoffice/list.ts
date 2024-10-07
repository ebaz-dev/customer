import express, { Request, Response } from "express";
import { currentUser, listAndCount, QueryOptions, requireAuth, validateRequest } from "@ebazdev/core";
import { Customer } from "../../shared/models/customer";
import { StatusCodes } from "http-status-codes";
const router = express.Router();

router.get("/bo/list", currentUser, requireAuth, validateRequest, async (req: Request, res: Response) => {
  console.log("customer/list", req.query);
  const criteria: any = {};
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

  const options: QueryOptions = <QueryOptions>req.query;
  options.sortBy = "updatedAt";
  options.sortDir = -1;
  const data = await listAndCount(criteria, Customer, options);

  res.status(StatusCodes.OK).send(data);
})

export { router as boListRouter };
