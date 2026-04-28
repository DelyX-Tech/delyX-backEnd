import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/classError";
import { GeneratOTP } from "../../service/sendEmail";
import { Hash, Compare } from "../../utils/hash";
import { eventEmitter } from "../../utils/event";
import { DeviceStatus, OrderStatus } from "../../utils/enums";
import { OrdereRepository } from "../../DB/repositories/order.repository";
import orderModel from "../../model/orders.model";
import { DeviceRepository } from "../../DB/repositories/device.repository";
import deviceModel from "../../model/device.model";
import { Types } from "mongoose";
import { UserRepository } from "../../DB/repositories/user.repository";
import userModdel from "../../model/user.model";

class OrderService {
    private _orderModel = new OrdereRepository(orderModel);
    private _deviceModel = new DeviceRepository(deviceModel);
    private _userModel = new UserRepository(userModdel);


    constructor() {}

    // =======================================================
    createOrder = async (req: Request, res: Response) => {
        if (!req.user?._id) throw new AppError("Unauthorized", 401);

        const { items, totalPrice } = req.body;

        const otp = await GeneratOTP();
        const hashedOtp = await Hash(String(otp));

        const order = await this._orderModel.create({
            userId: req.user._id,
            items,
            totalPrice,
            status: OrderStatus.PENDING,
            otp: hashedOtp,
            otpUsed: false,
            isCancelled: false
        });

        eventEmitter.emit("orderCreated", {
            email: req.user.email,
            otp
        });

        return res.status(201).json({ message: "Order created", order });
    };

    // =======================================================
    confirmOrder = async (req: Request, res: Response) => {
        const { orderId } = req.params;

        const order = await this._orderModel.findOneAndUpdate(
            { _id: orderId, status: OrderStatus.PENDING },
            { status: OrderStatus.CONFIRMED },
            { new: true }
        );

        if (!order) throw new AppError("Order not found", 404);

        return res.status(200).json({ message: "Order confirmed", order });
    };

    // =======================================================
    dispatchOrder = async (req: Request, res: Response) => {
    const { orderId, deviceId } = req.body;

    const order = await this._orderModel.findOne({ _id: orderId });

    if (!order) throw new AppError("Order not found", 404);

    const device = await this._deviceModel.findOne({ _id: deviceId });
    if (!device) throw new AppError("Device not found", 404);
    
    await this._orderModel.updateOne(
        { _id: order._id },
        {
            deviceId: device._id,
            status: OrderStatus.OUT_FOR_DELIVERY
        }
    );

    await this._deviceModel.updateOne(
        { _id: device._id },
        {
            status: DeviceStatus.DELIVERING,
            currentOrder: order._id
        }
    );

    return res.status(200).json({ message: "Order dispatched" });
};
    // =======================================================
    markDelivered = async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await this._orderModel.findOne({ 
        _id: orderId, 
        status: OrderStatus.OUT_FOR_DELIVERY 
    });

    if (!order) throw new AppError("Order not found or not out for delivery", 404);
    
    const user = await this._userModel.findOne({ _id: order.userId });
    
    if (!user) throw new AppError("User not found", 404);

    // ولد OTP جديد
    const otp = await GeneratOTP();
    const hashedOTP = await Hash(String(otp));

    // حدث الـ order بالـ OTP الجديد
    await this._orderModel.updateOne(
        { _id: order._id },
        { otp: hashedOTP, otpUsed: false }
    );

    eventEmitter.emit("deliveryOtp", { 
        email: user.email, 
        otp 
    });

    return res.status(200).json({ message: "OTP sent to user" });
};

// =======================================================
verifyOtp = async (req: Request, res: Response) => {
    const { orderId, otp } = req.body;

    const order = await this._orderModel.findOne({ _id: orderId });

    if (!order) throw new AppError("Order not found", 404);

    if (order.otpUsed) throw new AppError("OTP already used", 400);

    const isValid = await Compare(otp, order.otp);
    if (!isValid) throw new AppError("Invalid OTP", 400);

    await this._orderModel.updateOne(
        { _id: order._id },
        {
            otpUsed: true,
            status: OrderStatus.DELIVERED
        }
    );

    // تحرير الـ device
    if (order.deviceId) {
        await this._deviceModel.updateOne(
            { _id: order.deviceId },
            {
                status: DeviceStatus.IDLE,
                currentOrder: null
            }
        );
    }

    return res.status(200).json({ message: "Order completed" });
};
    

// =======================================================
cancelOrder = async (req: Request, res: Response) => {
const { orderId } = req.params;
    const order = await this._orderModel.findOne({ _id: orderId });
    

    if (!order) throw new AppError("Order not found", 404);

    if (order.status === OrderStatus.DELIVERED) {
        throw new AppError("Cannot cancel delivered order", 400);
    }

    await this._orderModel.updateOne(
        { _id: order._id },
        {
            status: OrderStatus.CANCELLED,
            isCancelled: true
        }
    );

    // تحرير الـ device لو كان متربط
    if (order.deviceId) {
        await this._deviceModel.updateOne(
            { _id: order.deviceId },
            {
                status: DeviceStatus.IDLE,
                currentOrder: null
            }
        );
    }

    return res.status(200).json({ message: "Order cancelled" });
};

// =======================================================
    getOrders = async (req: Request, res: Response) => {
        const orders = await this._orderModel.find({ 
            filter: { userId: req.user?._id as Types.ObjectId }
        });
        return res.status(200).json({ orders });
    };
        

// =======================================================
    getOrderById = async (req: Request, res: Response) => {
        const { orderId } = req.params;
        const order = await this._orderModel.findOne({ _id: orderId });
        if (!order) throw new AppError("Order not found", 404);
        return res.status(200).json({ order });
    };
}

export default new OrderService();