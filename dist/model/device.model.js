"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../utils/enums");
const deviceSchema = new mongoose_1.default.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status: {
        type: String,
        enum: Object.values(enums_1.DeviceStatus),
        default: enums_1.DeviceStatus.IDLE
    },
    batteryLevel: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
    },
    lastLocation: {
        lat: Number,
        lng: Number
    },
    currentOrder: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Order"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
const deviceModel = mongoose_1.default.models.Device || mongoose_1.default.model("Device", deviceSchema);
exports.default = deviceModel;
