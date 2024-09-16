import express, { Request, Response } from "express";
import { currentUser, requireAuth, validateRequest } from "@ebazdev/core";
import { Customer } from "../shared/models/customer";
import { query } from "express-validator";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get(
  "/getBranches",
  [query("parentId").notEmpty().isString().withMessage("ID is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const branches = await Customer.find({ parentId: req.query.parentId });

    res.status(StatusCodes.OK).send(branches);
  }
);

export { router as getBranchesRouter };
