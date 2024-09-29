import { Schema } from "mongoose";
import { Customer, CustomerDoc } from "./customer";
import { BaseRepository } from "@ebazdev/core";

interface MerchantDoc extends CustomerDoc { }

const Merchant = Customer.discriminator<MerchantDoc>(
  "merchant",
  new Schema({})
);
class MerchantRepository extends BaseRepository<MerchantDoc> {
  constructor() {
    super();
    this.setModel(Merchant);
  }
}

const merchantRepo = new MerchantRepository();

export { MerchantDoc, Merchant, merchantRepo };
