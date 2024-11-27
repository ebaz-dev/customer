import express, { Request, Response } from "express";
import { currentUser, requireAuth, validateRequest } from "@ebazdev/core";
import { StatusCodes } from "http-status-codes";
import { Employee } from "../../shared/models/employee";
import { Customer, Merchant } from "../../shared";
import _ from "lodash";
import { EmployeeRoles } from "../../shared/types/employee-roles";
import { Cart, Order } from "@ebazdev/order";
import { Types } from "mongoose";

const router = express.Router();

router.get(
  "/employee/migrate",
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const merchants: any = await Merchant.aggregate([
      {
        $match: {
          type: "merchant",
          tradeShops: {
            $size: 1,
          },
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "merchantId",
          as: "orders",
        },
      },
      {
        $unwind: "$tradeShops",
      },
      {
        $group: {
          _id: {
            tsId: "$tradeShops.tsId",
            holdingKey: "$tradeShops.holdingKey",
          },
          customers: {
            $push: "$$ROOT",
          },
        },
      },
    ]);
    const data: any = {
      merchants,
      employees: [],
      orderRes: [],
      cartRes: [],
      customerRes: [],
    };
    merchants.map(async (merchant: any) => {
      const mainCustomer = merchant.customers[0];
      merchant.customers.map(async (customer: any) => {
        if (customer) {
          const userId = customer.userId;
          if (userId) {
            const employeeExist = await Employee.find({
              userId,
              customerId: mainCustomer._id,
            });
            if (employeeExist.length < 1) {
              const employee = await Employee.create({
                userId: userId,
                customerId: mainCustomer._id,
                role: EmployeeRoles.Admin,
              });
              console.log("employee", employee);
            }
          }
          if ((customer._id as string) !== (mainCustomer._id as string)) {
            const orderRes = await Order.updateMany(
              {
                merchantId: new Types.ObjectId(customer._id as string),
              },
              {
                $set: {
                  merchantId: new Types.ObjectId(mainCustomer._id as string),
                },
              }
            );

            const cartRes = await Cart.updateMany(
              {
                merchantId: new Types.ObjectId(customer._id as string),
              },
              {
                $set: {
                  merchantId: new Types.ObjectId(mainCustomer._id as string),
                },
              }
            );

            const customerRes = await Customer.updateOne(
              { _id: customer._id },
              { $set: { inactive: true } }
            );

            console.log("orderRes", orderRes);
            console.log("cartRes", cartRes);
            console.log("customerRes", customerRes);
          }
        }
      });
    });
    // const promises = _.map(merchants, async (merchant) => {
    //   const userId = merchant.userId;
    //   const customerId = merchant.id;
    //   if (userId && customerId) {
    //     const employeeExist = await Employee.find({
    //       userId,
    //       customerId,
    //     });
    //     if (employeeExist.length < 1) {
    //       const newEmployee = await Employee.create({
    //         userId: userId,
    //         customerId: customerId,
    //         role: EmployeeRoles.Admin,
    //       });
    //       return newEmployee;
    //     }
    //     return { migrated: true };
    //   }
    //   return { userNotfound: true };
    // });
    // const employees = await Promise.all(promises);

    res.status(StatusCodes.OK).send({ data });
  }
);

export { router as employeeMigrateRouter };
