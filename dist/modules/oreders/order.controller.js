"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_service_1 = __importDefault(require("./order.service"));
const validation_1 = require("../../middleware/validation");
const OV = __importStar(require("./order.validation"));
const authentication_1 = require("../../middleware/authentication");
const authorization_1 = require("../../middleware/authorization");
const user_model_1 = require("../../model/user.model");
const orderRouter = (0, express_1.Router)();
orderRouter.post("/", (0, authentication_1.Authentication)(), (0, validation_1.validation)(OV.createOrderSchema), order_service_1.default.createOrder);
orderRouter.get("/", (0, authentication_1.Authentication)(), order_service_1.default.getOrders);
orderRouter.get("/:orderId", (0, authentication_1.Authentication)(), (0, validation_1.validation)(OV.getOrderSchema), order_service_1.default.getOrderById);
orderRouter.patch("/:orderId/confirm", (0, authentication_1.Authentication)(), (0, authorization_1.Authorization)({ accessRoles: [user_model_1.RoleType.admin] }), (0, validation_1.validation)(OV.confirmOrderSchema), order_service_1.default.confirmOrder);
orderRouter.patch("/dispatch", (0, authentication_1.Authentication)(), (0, authorization_1.Authorization)({ accessRoles: [user_model_1.RoleType.admin] }), (0, validation_1.validation)(OV.dispatchOrderSchema), order_service_1.default.dispatchOrder);
orderRouter.patch("/:orderId/delivered", (0, authentication_1.Authentication)(), (0, validation_1.validation)(OV.markDeliveredSchema), order_service_1.default.markDelivered);
orderRouter.post("/verify-otp", (0, authentication_1.Authentication)(), (0, validation_1.validation)(OV.verifyOtpSchema), order_service_1.default.verifyOtp);
orderRouter.patch("/:orderId/cancel", (0, authentication_1.Authentication)(), (0, validation_1.validation)(OV.cancelOrderSchema), order_service_1.default.cancelOrder);
exports.default = orderRouter;
