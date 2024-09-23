import express, { Request, Response } from "express";
import { currentUser, requireAuth, validateRequest } from "@ebazdev/core";
import { Customer } from "../shared/models/customer";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get("/list", currentUser, requireAuth, validateRequest, async (req: Request, res: Response) => {
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
  let q = Customer.find(criteria);
  const total = await Customer.countDocuments(criteria);
  let totalPages = 1;
  let currentPage = 1;

  if (!req.query.limit || req.query.limit != "all") {
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const page = req.query.page ? Number(req.query.page) - 1 : 0;
    const skip = page * limit;
    q = q.limit(limit);
    q = q.skip(skip);
    totalPages = Math.ceil(total / limit);
    currentPage = page + 1;

  }
  const data = await q.lean().exec()

  res.status(StatusCodes.OK).send({
    data,
    total,
    totalPages,
    currentPage
  });
})

export { router as listRouter };
