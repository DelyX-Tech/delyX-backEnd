import mongoose, { Types } from "mongoose";
import { DeviceStatus } from "../utils/enums";

export interface IDevice {
    deviceId: Types.ObjectId;

    deviceName: string;
    type: string;

    status: DeviceStatus;

    lastLocation?: {
        lat: number;
        lng: number;
    };

    currentOrder?: Types.ObjectId;

    isActive: boolean;

    lastSeen?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const deviceSchema = new mongoose.Schema<IDevice>(
    {
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
            enum: Object.values(DeviceStatus),
            default: DeviceStatus.IDLE
        },


        lastLocation: {
            lat: { type: Number },
            lng: { type: Number }
        },

        currentOrder: {
            type: mongoose.Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const deviceModel =
    mongoose.models.Device || mongoose.model<IDevice>("Device", deviceSchema);

export default deviceModel;