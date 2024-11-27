import express, { Request, Response } from "express";
import { currentUser, requireAuth, validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { Employee } from "../../shared/models/employee";
import { Merchant } from "../../shared";
import _ from "lodash";
import { EmployeeRoles } from "../../shared/types/employee-roles";

const router = express.Router();

router.get(
  "/employee/migrate",
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const merchants = await Merchant.find();
    const promises = _.map(merchants, async (merchant) => {
      const userId = merchant.userId;
      const customerId = merchant.id;
      if (userId && customerId) {
        const employeeExist = await Employee.find({
          userId,
          customerId,
        });
        if (employeeExist.length < 1) {
          const newEmployee = await Employee.create({
            userId: userId,
            customerId: customerId,
            role: EmployeeRoles.Admin,
          });
          return newEmployee;
        }
        return { migrated: true };
      }
      return { userNotfound: true };
    });
    const employees = await Promise.all(promises);

    res.status(StatusCodes.OK).send({ data: employees });
  }
);

export { router as employeeMigrateRouter };
