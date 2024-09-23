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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
const nats_wrapper_1 = require("../../nats-wrapper");
it("fails when a name that does not exist is supplied", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.app)
        .post(`${global.apiPrefix}/create`)
        .send({
        type: "supplier",
        regNo: "690608",
        address: "Ulaanbaatar, Mongolia",
        phone: "80995566",
    })
        .expect(400);
}));
it("how to be call publish after an successful create customer", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(app_1.app)
        .post(`${global.apiPrefix}/create`)
        .send({
        name: "New Supplier",
        type: "supplier",
        regNo: "690608",
        address: "Ulaanbaatar, Mongolia",
        phone: "80995566",
    })
        .expect(201);
    expect(nats_wrapper_1.natsWrapper.client.publish).toHaveBeenCalled();
}));
