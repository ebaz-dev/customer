"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Merchant = void 0;
const mongoose_1 = require("mongoose");
const customer_1 = require("./customer");
const Merchant = customer_1.Customer.discriminator("merchant", new mongoose_1.Schema({}));
exports.Merchant = Merchant;
