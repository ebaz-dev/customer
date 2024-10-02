import express, { Request, Response } from "express";
import { validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { Location } from "../shared/models/location";

const router = express.Router();

router.get("/location/list", validateRequest, async (req: Request, res: Response) => {
    const criteria: any = {};
    if (req.query.parentId) {
        criteria.parentId = req.query.parentId
    }
    const data = await Location.find(criteria);
    res.status(StatusCodes.OK).send({ data, total: (await data).length });
})


export { router as locationListRouter };
