import express, { Request, Response } from "express";
import {
    BadRequestError,
    validateRequest,
} from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { Location } from "../shared/models/location";

const router = express.Router();

router.post(
    "/location/create",
    validateRequest,
    async (req: Request, res: Response) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const data = req.body.locations;
            const locations = await Location.insertMany(data);
            await session.commitTransaction();
            res.status(StatusCodes.CREATED).send(locations);
        } catch (error: any) {
            await session.abortTransaction();
            console.error("Location create operation failed", error);
            throw new BadRequestError("Location create operation failed");
        } finally {
            session.endSession();
        }
    }
);

export { router as locCreateRouter };
