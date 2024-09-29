import express, { Request, Response } from "express";
import { QueryOptions, validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { CustomerCategory, customerCategoryRepo } from "../shared";
import { query } from "express-validator";
import _ from "lodash";

const router = express.Router();

router.get("/category/list", [query("type").notEmpty().isString().withMessage("Type is required")], validateRequest, async (req: Request, res: Response) => {
  const criteria: any = { type: req.query.type, parentId: { $exists: false } };

  const options: QueryOptions = <QueryOptions>req.query;
  options.sortBy = "name";
  options.sortDir = -1;

  const result = await customerCategoryRepo.selectAndCountAll(criteria, options);
  const promises = _.map(result.data, async (parent: any, i) => {
    const subCategories = await customerCategoryRepo.select({ parentId: parent.id });
    return { ...parent.toJSON(), subCategories }
  });
  const categories = await Promise.all(promises);

  res.status(StatusCodes.OK).send({ data: categories, total: result.total, totalPages: result.totalPages, currentPage: result.currentPage });
})

export { router as categoryListRouter };
