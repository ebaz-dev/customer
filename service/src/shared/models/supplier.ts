import { Schema } from "mongoose";
import { Customer, CustomerDoc } from "./customer";
import { HoldingSupplierCodes } from "../types/holding-supplier-codes";
import { VendorCodes } from "../types/vendor-codes";

interface BannerDoc extends Document {
  url: string;
  type: number;
}
const bannerSchema = new Schema<BannerDoc>(
  {
    url: {
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

interface BrandDoc extends Document {
  url: string;
}
const brandSchema = new Schema<BannerDoc>(
  {
    url: {
      type: String,
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
  brands: BrandDoc[];
  vendorKey?: VendorCodes;
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
    brands: [brandSchema],
    vendorKey: { type: String, enum: Object.values(VendorCodes) },
  })
);

export { SupplierDoc, Supplier };
