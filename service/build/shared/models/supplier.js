"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Supplier = void 0;
const mongoose_1 = require("mongoose");
const customer_1 = require("./customer");
const Supplier = customer_1.Customer.discriminator("supplier", new mongoose_1.Schema({
    orderMin: Number,
    deliveryDays: { type: [Number], enum: [1, 2, 3, 4, 5, 6, 7] },
}));
exports.Supplier = Supplier;
