import { Schema } from "mongoose";
import { Customer, CustomerDoc } from "./customer";
import { HoldingSupplierCodes } from "../types/holding-supplier-codes";

interface tradeShop {
  tsId: string;
  holdingKey: HoldingSupplierCodes;
}
interface MerchantDoc extends CustomerDoc {
  tradeShops?: tradeShop[];
}

const Merchant = Customer.discriminator<MerchantDoc>(
  "merchant",
  new Schema({
    tradeShops: [
      {
        tsId: String,
        holdingKey: {
          type: String,
          enum: Object.values(HoldingSupplierCodes),
          unique: true,
        },
      },
    ],
  })
);

export { MerchantDoc, Merchant };
