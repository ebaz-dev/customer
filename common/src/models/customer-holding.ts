import { Document, Schema, Types, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface CustomerHoldingDoc extends Document {
  supplierId: Types.ObjectId;
  ownerId: string;
  ownerName: string;
  tradeShopName: string;
  tradeShopId: string;
  team: string;
  salesman: string;
  mngr: string;
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
    ownerId: {
      type: String,
      required: true,
    },
    ownerName: {
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
    team: {
      type: String,
      required: true,
    },
    salesman: {
      type: String,
      required: true,
    },
    mngr: {
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
