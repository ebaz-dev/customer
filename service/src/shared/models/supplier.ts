import { Schema } from "mongoose";
import { Customer, CustomerDoc } from "./customer";
import { HoldingSupplierCodes } from "../types/holding-supplier-codes";

interface SupplierDoc extends CustomerDoc {
  orderMin: number;
  deliveryDays: number[];
  holdingKey?: HoldingSupplierCodes;
  code: string
}

const Supplier = Customer.discriminator<SupplierDoc>(
  "supplier",
  new Schema({
    orderMin: Number,
    deliveryDays: { type: [Number], enum: [1, 2, 3, 4, 5, 6, 7] },
    holdingKey: { type: String, enum: Object.values(HoldingSupplierCodes) },
    code: String
  })
);

export { SupplierDoc, Supplier };

