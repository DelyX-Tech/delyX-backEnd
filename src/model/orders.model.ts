import mongoose, { Types } from "mongoose";
import { OrderStatus } from "../utils/enums";

export interface IOrder {
    _id: Types.ObjectId;

    userId: Types.ObjectId;

    deviceId?: Types.ObjectId;

    status: OrderStatus;

    otp: string;

    otpUsed: boolean;

    items: {
        name: string;
        quantity: number;
        price: number;
    }[];

    totalPrice: number;

    isCancelled: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device"
        },

        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING
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
    },
    { timestamps: true }
);

const orderModel =
    mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default orderModel;