"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heartbeatSchema = exports.deactivateDeviceSchema = exports.updateStatusSchema = exports.registerDeviceSchema = void 0;
const zod_1 = require("zod");
exports.registerDeviceSchema = {
    body: zod_1.z.strictObject({
        deviceName: zod_1.z.string().trim(),
        type: zod_1.z.string().trim(),
        status: zod_1.z.enum(["idle", "delivering", "offline"]).optional(),
        batteryLevel: zod_1.z.number().min(0).max(100).optional(),
        lastLocation: zod_1.z
            .object({
            lat: zod_1.z.number(),
            lng: zod_1.z.number(),
        })
            .optional(),
    }).required(),
};
exports.updateStatusSchema = {
    body: zod_1.z.strictObject({
        status: zod_1.z.enum(["idle", "delivering", "offline"]),
        batteryLevel: zod_1.z.number().min(0).max(100).optional(),
        lastLocation: zod_1.z
            .object({
            lat: zod_1.z.number(),
            lng: zod_1.z.number(),
        })
            .optional(),
    }),
};
exports.deactivateDeviceSchema = {
    params: zod_1.z.strictObject({
        deviceId: zod_1.z.string().min(1),
    }).required(),
};
exports.heartbeatSchema = {
    params: zod_1.z.strictObject({
        deviceId: zod_1.z.string().min(1),
    }).required(),
    body: zod_1.z.strictObject({
        batteryLevel: zod_1.z.number().min(0).max(100).optional(),
        lastLocation: zod_1.z
            .object({
            lat: zod_1.z.number(),
            lng: zod_1.z.number(),
        })
            .optional(),
    }).required(),
};
