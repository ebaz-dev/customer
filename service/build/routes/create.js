"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = void 0;
const express_1 = __importDefault(require("express"));
const core_1 = require("@ebazdev/core");
const customer_1 = require("../shared/models/customer");
const express_validator_1 = require("express-validator");
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const nats_wrapper_1 = require("../nats-wrapper");
const customer_created_publisher_1 = require("../events/publisher/customer-created-publisher");
const supplier_1 = require("../shared/models/supplier");
const merchant_1 = require("../shared/models/merchant");
const router = express_1.default.Router();
exports.createRouter = router;
router.post("/create", [
    (0, express_validator_1.body)("type")
        .notEmpty()
        .matches(/\b(?:supplier|merchant)\b/)
        .isString()
        .withMessage("Name is required"),
    (0, express_validator_1.body)("name").notEmpty().isString().withMessage("Type is required"),
    (0, express_validator_1.body)("regNo").notEmpty().isString().withMessage("Register is required"),
    (0, express_validator_1.body)("address").notEmpty().isString().withMessage("Address is required"),
    (0, express_validator_1.body)("phone").notEmpty().isString().withMessage("Phone is required"),
], core_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let customer;
        const data = req.body;
        if (data.type === "supplier") {
            data.type = customer_1.CustomerType.Supplier;
            customer = yield supplier_1.Supplier.create(data);
        }
        else {
            data.type = customer_1.CustomerType.Merchant;
            customer = yield merchant_1.Merchant.create(data);
        }
        yield new customer_created_publisher_1.CustomerCreatedPublisher(nats_wrapper_1.natsWrapper.client).publish(customer);
        yield session.commitTransaction();
        res.status(http_status_codes_1.StatusCodes.CREATED).send(customer);
    }
    catch (error) {
        yield session.abortTransaction();
        console.error("Customer create operation failed", error);
        throw new core_1.BadRequestError("Customer create operation failed");
    }
    finally {
        session.endSession();
    }
}));
