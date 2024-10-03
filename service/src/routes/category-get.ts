import express, { Request, Response } from "express";
import { validateRequest } from "@ebazdev/core";
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
        data = await CustomerCategory.findById(req.query.id);

        res.status(StatusCodes.OK).send({ data });
    }
);

export { router as categoryGetRouter };
