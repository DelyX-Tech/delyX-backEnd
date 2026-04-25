"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classError_1 = require("../../utils/classError");
const sendEmail_1 = require("../../service/sendEmail");
const hash_1 = require("../../utils/hash");
const event_1 = require("../../utils/event");
const enums_1 = require("../../utils/enums");
const order_repository_1 = require("../../DB/repositories/order.repository");
const orders_model_1 = __importDefault(require("../../model/orders.model"));
const device_repository_1 = require("../../DB/repositories/device.repository");
const device_model_1 = __importDefault(require("../../model/device.model"));
class OrderService {
    _orderModel = new order_repository_1.OrdereRepository(orders_model_1.default);
    _deviceModel = new device_repository_1.DeviceRepository(device_model_1.default);
    constructor() { }
    createOrder = async (req, res) => {
        if (!req.user?._id)
            throw new classError_1.AppError("Unauthorized", 401);
        const { items, totalPrice } = req.body;
        const otp = await (0, sendEmail_1.GeneratOTP)();
        const hashedOtp = await (0, hash_1.Hash)(String(otp));
        const order = await this._orderModel.create({
            userId: req.user._id,
            items,
            totalPrice,
            status: enums_1.OrderStatus.PENDING,
            otp: hashedOtp,
            otpUsed: false,
            isCancelled: false
        });
        event_1.eventEmitter.emit("orderCreated", {
            email: req.user.email,
            otp
        });
        return res.status(201).json({ message: "Order created", order });
    };
    confirmOrder = async (req, res) => {
        const { orderId } = req.params;
        const order = await this._orderModel.findOneAndUpdate({ _id: orderId, status: enums_1.OrderStatus.PENDING }, { status: enums_1.OrderStatus.CONFIRMED }, { new: true });
        if (!order)
            throw new classError_1.AppError("Order not found", 404);
        return res.status(200).json({ message: "Order confirmed", order });
    };
    dispatchOrder = async (req, res) => {
        const { orderId, deviceId } = req.body;
        const order = await this._orderModel.findOne({
            filter: { _id: orderId }
        });
        if (!order)
            throw new classError_1.AppError("Order not found", 404);
        const device = await this._deviceModel.findOne({
            filter: { deviceId }
        });
        if (!device)
            throw new classError_1.AppError("Device not found", 404);
        await this._orderModel.updateOne({ _id: order._id }, {
            deviceId: device._id,
            status: enums_1.OrderStatus.OUT_FOR_DELIVERY
        });
        await this._deviceModel.updateOne({ _id: device._id }, {
            status: enums_1.DeviceStatus.DELIVERING,
            currentOrder: order._id
        });
        return res.status(200).json({ message: "Order dispatched" });
    };
    markDelivered = async (req, res) => {
        const { orderId } = req.params;
        const order = await this._orderModel.findOne({
            filter: { _id: orderId }
        });
        if (!order)
            throw new classError_1.AppError("Order not found", 404);
        await this._orderModel.updateOne({ _id: order._id }, { status: enums_1.OrderStatus.DELIVERED });
        return res.status(200).json({ message: "Order delivered" });
    };
    verifyOtp = async (req, res) => {
        const { orderId, otp } = req.body;
        const order = await this._orderModel.findOne({
            filter: { _id: orderId }
        });
        if (!order)
            throw new classError_1.AppError("Order not found", 404);
        if (order.otpUsed)
            throw new classError_1.AppError("OTP already used", 400);
        const isValid = await (0, hash_1.Compare)(otp, order.otp);
        if (!isValid)
            throw new classError_1.AppError("Invalid OTP", 400);
        await this._orderModel.updateOne({ _id: order._id }, {
            otpUsed: true,
            status: enums_1.OrderStatus.DELIVERED
        });
        return res.status(200).json({ message: "Order completed" });
    };
    cancelOrder = async (req, res) => {
        const { orderId } = req.params;
        const order = await this._orderModel.findOne({
            filter: { _id: orderId }
        });
        if (!order)
            throw new classError_1.AppError("Order not found", 404);
        if (order.status === enums_1.OrderStatus.DELIVERED) {
            throw new classError_1.AppError("Cannot cancel delivered order", 400);
        }
        await this._orderModel.updateOne({ _id: order._id }, {
            status: enums_1.OrderStatus.CANCELLED,
            isCancelled: true
        });
        return res.status(200).json({ message: "Order cancelled" });
    };
    getOrders = async (req, res) => {
        const orders = await this._orderModel.find({
            filter: { userId: req.user?._id }
        });
        return res.status(200).json({ orders });
    };
    getOrderById = async (req, res) => {
        const { orderId } = req.params;
        const order = await this._orderModel.findOne({
            filter: { _id: orderId }
        });
        if (!order)
            throw new classError_1.AppError("Order not found", 404);
        return res.status(200).json({ order });
    };
}
exports.default = new OrderService();
