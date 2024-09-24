import express, { Request, Response } from "express";
import { currentUser, requireAuth, validateRequest } from "@ebazdev/core";
import { Customer } from "../shared/models/customer";
import { query } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { CustomerCategory } from "../shared";

const router = express.Router();

router.get(
    "/category/get",
    [query("id").notEmpty().isString().withMessage("ID is required")],
    validateRequest,
    async (req: Request, res: Response) => {
        let data: any = {}
        data = await CustomerCategory.findOne({ _id: req.query.id });
        if (data.category?.parentId) {
            data.parentCategory = await CustomerCategory.findOne({ _id: data.category.parentId })
        } else {
            data.subCategories = await CustomerCategory.find({ parentId: data.category?.id })
        }

        res.status(StatusCodes.OK).send({ data });
    }
);

export { router as categoryGetRouter };
