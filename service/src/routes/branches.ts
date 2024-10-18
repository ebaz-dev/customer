import express, { Request, Response } from "express";
import { currentUser, requireAuth, validateRequest } from "@ebazdev/core";
import { Customer } from "../shared/models/customer";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import _ from "lodash";

const router = express.Router();

router.get(
  "/branches",
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const criteria: any = {
      userId: new Types.ObjectId(req.currentUser?.id as string),
      parentId: { $exists: false },
    };
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
    const parents: any = await Customer.find(criteria);
    const promises = _.map(parents, async (parent) => {
      const branches = await Customer.find({ parentId: parent.id });
      return {
        id: parent.id,
        name: parent.businessName,
        regNo: parent.regNo,
        branches: branches.concat([parent]),
      };
    });
    const customers = await Promise.all(promises);

    res
      .status(StatusCodes.OK)
      .send({ data: customers, total: customers.length });
  }
);

export { router as branchesRouter };
