import express, { Request, Response } from "express";
import { currentUser, requireAuth, validateRequest } from "@ebazdev/core";
import { Customer } from "../shared/models/customer";
import { query } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { CustomerCategory, customerCategoryRepo } from "../shared";
import { Types } from "mongoose";

const router = express.Router();

router.get(
    "/category/get",
    [query("id").notEmpty().isString().withMessage("ID is required")],
    validateRequest,
    async (req: Request, res: Response) => {
        let data: any = {}
        data = await customerCategoryRepo.selectOne({ _id: req.query.id });

        res.status(StatusCodes.OK).send({ data });
    }
);

export { router as categoryGetRouter };
