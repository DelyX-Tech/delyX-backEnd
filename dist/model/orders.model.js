"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../utils/enums");
const orderSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    deviceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Device"
    },
    status: {
        type: String,
        enum: Object.values(enums_1.OrderStatus),
        default: enums_1.OrderStatus.PENDING
    },
    otp: {
        type: String,
        required: true
    },
    otpUsed: {
        type: Boolean,
        default: false
    },
    items: [
        {
            name: String,
            quantity: Number,
            price: Number
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    isCancelled: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const orderModel = mongoose_1.default.models.Order || mongoose_1.default.model("Order", orderSchema);
exports.default = orderModel;
