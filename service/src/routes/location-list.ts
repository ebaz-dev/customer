import express, { Request, Response } from "express";
import { validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { Location } from "../shared/models/location";

const router = express.Router();

router.get(
  "/location/list",
  validateRequest,
  async (req: Request, res: Response) => {
    const criteria: any = {};
    const data = await Location.find(criteria);
    const cities: any = data
      .filter((location) => {
        return !location.parentId;
      })
      .map((city: any) => {
        const districts: any = data
          .filter((district) => {
            return `${district.parentId}` === `${city._id}`;
          })
          .map((district: any) => {
            const subDistricts = data.filter((subDistrict) => {
              return `${subDistrict.parentId}` === `${district._id}`;
            });
            return {
              id: district._id,
              parentId: district.parentId,
              name: district.name,
              lat: district.lat,
              long: district.long,
              subDistricts,
            };
          });
        return {
          id: city._id,
          parentId: city.parentId,
          name: city.name,
          lat: city.lat,
          long: city.long,
          districts,
        };
      });
    res.status(StatusCodes.OK).send({ data: cities });
  }
);

export { router as locationListRouter };
