import express, { Request, Response } from "express";
import { currentUser, requireAuth, validateRequest } from "@ebazdev/core";
import { Customer } from "../shared/models/customer";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get("/list", validateRequest, async (req: Request, res: Response) => {
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

  if (req.query.type) {
    criteria.type = req.query.type;
  }
  const customers = await Customer.find(criteria);

  res.status(StatusCodes.OK).send(customers);
});

export { router as listRouter };
