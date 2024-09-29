import { Schema } from "mongoose";
import { Customer, CustomerDoc } from "./customer";
import { BaseRepository } from "@ebazdev/core";

interface SupplierDoc extends CustomerDoc {
  orderMin: number;
  deliveryDays: number[];
}

const Supplier = Customer.discriminator<SupplierDoc>(
  "supplier",
  new Schema({
    orderMin: Number,
    deliveryDays: { type: [Number], enum: [1, 2, 3, 4, 5, 6, 7] },
  })
);
class SupplierRepository extends BaseRepository<SupplierDoc> {
  constructor() {
    super();
    this.setModel(Supplier);
  }
}
const supplierRepo = new SupplierRepository();

export { SupplierDoc, Supplier, supplierRepo };

