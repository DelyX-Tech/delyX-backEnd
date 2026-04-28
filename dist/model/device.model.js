"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../utils/enums");
const deviceSchema = new mongoose_1.default.Schema({
    deviceName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: Object.values(enums_1.DeviceStatus),
        default: enums_1.DeviceStatus.IDLE
    },
    lastLocation: {
        lat: { type: Number },
        lng: { type: Number }
    },
    currentOrder: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Order",
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastSeen: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const deviceModel = mongoose_1.default.models.Device || mongoose_1.default.model("Device", deviceSchema);
exports.default = deviceModel;
