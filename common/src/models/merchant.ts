import { Schema } from "mongoose";
import { Customer, CustomerDoc } from "./customer";

interface MerchantDoc extends CustomerDoc {}

const Merchant = Customer.discriminator<MerchantDoc>(
  "merchant",
  new Schema({})
);

export { MerchantDoc, Merchant };
