"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = exports.CustomerType = void 0;
const mongoose_1 = require("mongoose");
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
var CustomerType;
(function (CustomerType) {
    CustomerType["Supplier"] = "supplier";
    CustomerType["Merchant"] = "merchant";
})(CustomerType || (exports.CustomerType = CustomerType = {}));
const customerSchema = new mongoose_1.Schema({
    parentId: {
        type: String,
        required: false,
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
    logo: String,
}, {
    discriminatorKey: "type",
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
customerSchema.set("versionKey", "version");
customerSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
const Customer = (0, mongoose_1.model)("Customer", customerSchema);
exports.Customer = Customer;
