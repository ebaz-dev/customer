import { Document, Schema, Types, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export enum CustomerType {
  Supplier = "supplier",
  Merchant = "merchant",
}

interface BankAccountDoc extends Document {
  accountNumber: string;
  accountName: string;
  bankId: Types.ObjectId;
}
const bankAccountSchema = new Schema<BankAccountDoc>(
  {
    accountNumber: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    bankId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Bank",
    },
  },
  { _id: false }
);

interface CustomerDoc extends Document {
  parentId: Types.ObjectId;
  type: CustomerType;
  name: string;
  regNo: string;
  categoryId: Types.ObjectId;
  userId: Types.ObjectId;
  address: string;
  phone: string;
  email: string;
  logo: string;
  bankAccounts: BankAccountDoc[];
}

const customerSchema = new Schema<CustomerDoc>(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Customer",
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
      type: Schema.Types.ObjectId,
      required: false,
      ref: "CustomerCategory",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
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
    logo: String,
    bankAccounts: [bankAccountSchema],
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

customerSchema.set("versionKey", "version");
customerSchema.plugin(updateIfCurrentPlugin);

const Customer = model<CustomerDoc>("Customer", customerSchema);

export { CustomerDoc, Customer };
