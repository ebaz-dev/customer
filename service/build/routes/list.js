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
exports.listRouter = void 0;
const express_1 = __importDefault(require("express"));
const core_1 = require("@ebazdev/core");
const customer_1 = require("../shared/models/customer");
const http_status_codes_1 = require("http-status-codes");
const router = express_1.default.Router();
exports.listRouter = router;
router.get("/list", core_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const criteria = {};
    if (req.query.name) {
        criteria.name = {
            $regex: req.query.name,
            $options: "i",
        };
    }
    if (req.query.regNo) {
        criteria.regNo = {
            $regex: req.query.regNo,
            $options: "i",
        };
    }
    if (req.query.phone) {
        criteria.phone = {
            $regex: req.query.phone,
            $options: "i",
        };
    }
    if (req.query.parentId) {
        criteria.parentId = req.query.parentId;
    }
    if (req.query.type) {
        criteria.type = req.query.type;
    }
    const customers = yield customer_1.Customer.find(criteria);
    res.status(http_status_codes_1.StatusCodes.OK).send(customers);
}));
