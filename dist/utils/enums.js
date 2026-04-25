"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = exports.DeviceStatus = void 0;
var DeviceStatus;
(function (DeviceStatus) {
    DeviceStatus["IDLE"] = "idle";
    DeviceStatus["DELIVERING"] = "delivering";
    DeviceStatus["OFFLINE"] = "offline";
})(DeviceStatus || (exports.DeviceStatus = DeviceStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["CONFIRMED"] = "confirmed";
    OrderStatus["OUT_FOR_DELIVERY"] = "out_for_delivery";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
