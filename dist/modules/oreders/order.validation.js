"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderSchema = exports.cancelOrderSchema = exports.verifyOtpSchema = exports.markDeliveredSchema = exports.dispatchOrderSchema = exports.confirmOrderSchema = exports.createOrderSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const mongoose_1 = require("mongoose");
exports.createOrderSchema = {
    body: zod_1.default.strictObject({
        items: zod_1.default.array(zod_1.default.strictObject({
            name: zod_1.default.string(),
            quantity: zod_1.default.number().min(1),
            price: zod_1.default.number().min(0)
        })).min(1),
        totalPrice: zod_1.default.number().min(0)
    }).required()
};
exports.confirmOrderSchema = {
    params: zod_1.default.strictObject({
        orderId: zod_1.default.string()
    }).refine((val) => mongoose_1.Types.ObjectId.isValid(val.orderId), {
        message: "Invalid orderId",
        path: ["orderId"]
    })
};
exports.dispatchOrderSchema = {
    body: zod_1.default.strictObject({
        orderId: zod_1.default.string(),
        deviceId: zod_1.default.string()
    }).refine((val) => mongoose_1.Types.ObjectId.isValid(val.orderId), {
        message: "Invalid orderId",
        path: ["orderId"]
    }).refine((val) => mongoose_1.Types.ObjectId.isValid(val.deviceId), {
        message: "Invalid deviceId",
        path: ["deviceId"]
    })
};
exports.markDeliveredSchema = {
    params: zod_1.default.strictObject({
        orderId: zod_1.default.string()
    }).refine((val) => mongoose_1.Types.ObjectId.isValid(val.orderId), {
        message: "Invalid orderId",
        path: ["orderId"]
    })
};
exports.verifyOtpSchema = {
    body: zod_1.default.strictObject({
        orderId: zod_1.default.string(),
        otp: zod_1.default.string().regex(/^\d{6}$/)
    }).refine((val) => mongoose_1.Types.ObjectId.isValid(val.orderId), {
        message: "Invalid orderId",
        path: ["orderId"]
    })
};
exports.cancelOrderSchema = {
    params: zod_1.default.strictObject({
        orderId: zod_1.default.string()
    }).refine((val) => mongoose_1.Types.ObjectId.isValid(val.orderId), {
        message: "Invalid orderId",
        path: ["orderId"]
    })
};
exports.getOrderSchema = {
    params: zod_1.default.strictObject({
        orderId: zod_1.default.string()
    }).refine((val) => mongoose_1.Types.ObjectId.isValid(val.orderId), {
        message: "Invalid orderId",
        path: ["orderId"]
    })
};
