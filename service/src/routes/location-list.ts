import express, { Request, Response } from "express";
import { validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { Location } from "../shared/models/location";

const router = express.Router();

router.get("/location/list", validateRequest, async (req: Request, res: Response) => {
    const criteria: any = {};
    const data = await Location.find(criteria);
    const cities: any = data.filter(location => { return location.parentId === 0 }).map((city: any) => {
        const districts: any = data.filter(district => { return Number(district.parentId) === Number(city.id) }).map((district: any) => {
            const subDistricts = data.filter(subDistrict => { return Number(subDistrict.parentId) === Number(district.id) })
            return { id: district.id, parentId: district.parentId, name: district.name, subDistricts }
        })
        return { id: city.id, parentId: city.parentId, name: city.name, districts }
    });
    res.status(StatusCodes.OK).send({ data: cities });
})


export { router as locationListRouter };
