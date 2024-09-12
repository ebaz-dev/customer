import { Document, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface CustomerDoc extends Document {
  parentId: string;
  type: string;
  name: string;
  regNo: string;
  categoryId: string;
  address: string;
  phone: string;
  email: string;
}

const customerSchema = new Schema<CustomerDoc>(
  {
    parentId: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
      enum: ["supplier", "merchant"],
    },
    name: {
      type: String,
      required: true,
    },
    regNo: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
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

customerSchema.set("versionKey", "version");
customerSchema.plugin(updateIfCurrentPlugin);

const Customer = model<CustomerDoc>("Customer", customerSchema);

export { Customer };
