import { Document, Schema, Types, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface CustomerHoldingDoc extends Document {
  supplierId: Types.ObjectId;
  mngr: string;
  srName: string;
  tradeShopName: string;
  tradeShopId: string;
  customerId: string;
  outletName: string;
  companyName: string;
  ownerName: string;
  regNo: string;
  phone: string;
  address: string;
  merchantId?: Types.ObjectId;
}

const customerHoldingSchema = new Schema<CustomerHoldingDoc>(
  {
    supplierId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    mngr: {
      type: String,
      required: true,
    },
    srName: {
      type: String,
      required: true,
    },
    tradeShopName: {
      type: String,
      required: true,
    },
    tradeShopId: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    outletName: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    regNo: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Customer",
    },
  },
  {
    discriminatorKey: "type",
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

customerHoldingSchema.set("versionKey", "version");
customerHoldingSchema.plugin(updateIfCurrentPlugin);

const CustomerHolding = model<CustomerHoldingDoc>(
  "CustomerHolding",
  customerHoldingSchema
);

export { CustomerHoldingDoc, CustomerHolding };
