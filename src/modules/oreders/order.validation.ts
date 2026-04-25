import z from "zod";
import { Types } from "mongoose";


// =======================================================
// CREATE ORDER
export const createOrderSchema = {
    body: z.strictObject({
        items: z.array(
            z.strictObject({
                name: z.string(),
                quantity: z.number().min(1),
                price: z.number().min(0)
            })
        ).min(1),

        totalPrice: z.number().min(0)
    }).required()
};


// =======================================================
// CONFIRM ORDER
export const confirmOrderSchema = {
    params: z.strictObject({
        orderId: z.string()
    }).refine((val) => Types.ObjectId.isValid(val.orderId), {
        message: "Invalid orderId",
        path: ["orderId"]
    })
};


// =======================================================
// DISPATCH ORDER
export const dispatchOrderSchema = {
    body: z.strictObject({
        orderId: z.string(),
        deviceId: z.string()
    }).refine((val) => Types.ObjectId.isValid(val.orderId), {
        message: "Invalid orderId",
        path: ["orderId"]
    }).refine((val) => Types.ObjectId.isValid(val.deviceId), {
        message: "Invalid deviceId",
        path: ["deviceId"]
    })
};


// =======================================================
// MARK DELIVERED
export const markDeliveredSchema = {
    params: z.strictObject({
        orderId: z.string()
    }).refine((val) => Types.ObjectId.isValid(val.orderId), {
        message: "Invalid orderId",
        path: ["orderId"]
    })
};


// =======================================================
// VERIFY OTP
export const verifyOtpSchema = {
    body: z.strictObject({
        orderId: z.string(),
        otp: z.string().regex(/^\d{6}$/)
    }).refine((val) => Types.ObjectId.isValid(val.orderId), {
        message: "Invalid orderId",
        path: ["orderId"]
    })
};


// =======================================================
// CANCEL ORDER
export const cancelOrderSchema = {
    params: z.strictObject({
        orderId: z.string()
    }).refine((val) => Types.ObjectId.isValid(val.orderId), {
        message: "Invalid orderId",
        path: ["orderId"]
    })
};


// =======================================================
// GET SINGLE ORDER
export const getOrderSchema = {
    params: z.strictObject({
        orderId: z.string()
    }).refine((val) => Types.ObjectId.isValid(val.orderId), {
        message: "Invalid orderId",
        path: ["orderId"]
    })
};


// =======================================================
// TYPES
export type createOrderSchemaType = z.infer<typeof createOrderSchema.body>;
export type dispatchOrderSchemaType = z.infer<typeof dispatchOrderSchema.body>;
export type verifyOtpSchemaType = z.infer<typeof verifyOtpSchema.body>;