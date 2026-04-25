import mongoose, { Types } from "mongoose";
import { DeviceStatus } from "../utils/enums";

export interface IDevice {
    _id: Types.ObjectId;
    deviceId: string;
    status: DeviceStatus;
    batteryLevel: number;
    lastLocation?: {
        lat: number;
        lng: number;
    };
    currentOrder?: Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const deviceSchema = new mongoose.Schema<IDevice>(
    {
        deviceId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        status: {
            type: String,
            enum: Object.values(DeviceStatus),
            default: DeviceStatus.IDLE
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

const deviceModel =
    mongoose.models.Device || mongoose.model<IDevice>("Device", deviceSchema);

export default deviceModel;