import { Router } from "express";
import OS from "./order.service";
import { validation } from "../../middleware/validation";
import * as OV from "./order.validation";
import { Authentication } from "../../middleware/authentication";
import { Authorization } from "../../middleware/authorization";
import { RoleType } from "../../model/user.model";

const orderRouter = Router();


// =======================================================
// CREATE ORDER (USER)
orderRouter.post(
    "/",
    Authentication(),
    validation(OV.createOrderSchema),
    OS.createOrder
);

// =======================================================
// GET ALL ORDERS (USER)
orderRouter.get(
    "/",
    Authentication(),
    OS.getOrders
);


// =======================================================
// GET SINGLE ORDER
orderRouter.get(
    "/:orderId",
    Authentication(),
    validation(OV.getOrderSchema),
    OS.getOrderById
);


// =======================================================
// CONFIRM ORDER (ADMIN)
orderRouter.patch(
    "/:orderId/confirm",
    Authentication(),
    Authorization({ accessRoles: [RoleType.admin] }),
    validation(OV.confirmOrderSchema),
    OS.confirmOrder
);


// =======================================================
// DISPATCH ORDER (ADMIN)
orderRouter.patch(
    "/dispatch",
    Authentication(),
    Authorization({ accessRoles: [RoleType.admin] }),
    validation(OV.dispatchOrderSchema),
    OS.dispatchOrder
);


// =======================================================
// MARK DELIVERED (DEVICE / ADMIN)
orderRouter.patch(
    "/:orderId/delivered",
    Authentication(),
    validation(OV.markDeliveredSchema),
    OS.markDelivered
);


// =======================================================
// VERIFY OTP (USER)
orderRouter.post(
    "/verify-otp",
    Authentication(),
    validation(OV.verifyOtpSchema),
    OS.verifyOtp
);


// =======================================================
// CANCEL ORDER (USER)
orderRouter.patch(
    "/:orderId/cancel",
    Authentication(),
    validation(OV.cancelOrderSchema),
    OS.cancelOrder
);

export default orderRouter;