import { Schema } from "mongoose";
import { Customer, CustomerDoc } from "./customer";
import { HoldingSupplierCodes } from "../types/holding-supplier-codes";

interface BannerDoc extends Document {
  file: string;
  type: number;
}
const bannerSchema = new Schema<BannerDoc>(
  {
    file: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
interface ProductQueryDoc extends Document {
  limit?: number;
  page?: number;
  brands?: string;
}
const productQuerySchema = new Schema<ProductQueryDoc>(
  {
    limit: {
      type: Number,
      required: false,
    },
    page: {
      type: Number,
      required: false,
    },
    brands: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

interface SupplierDoc extends CustomerDoc {
  orderMin: number;
  deliveryDays: number[];
  holdingKey?: HoldingSupplierCodes;
  code: string;
  banners: BannerDoc[];
  productQuery?: ProductQueryDoc;
  productBanner?: string;
  infoBanner?: string;
}

const Supplier = Customer.discriminator<SupplierDoc>(
  "supplier",
  new Schema({
    orderMin: Number,
    deliveryDays: { type: [Number], enum: [1, 2, 3, 4, 5, 6, 7] },
    holdingKey: { type: String, enum: Object.values(HoldingSupplierCodes) },
    code: String,
    banners: [bannerSchema],
    productQuery: productQuerySchema,
    productBanner: { type: String, require: false },
    infoBanner: { type: String, require: false },
  })
);

export { SupplierDoc, Supplier };
