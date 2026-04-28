import { z } from "zod";

// =======================================================
// Register Device (Admin)
export const registerDeviceSchema = {
  body: z.strictObject({
    deviceName: z.string().trim(),
    type: z.string().trim(),
    status: z.enum(["idle", "delivering", "offline"]).optional(), // ممكن يكون اختياري
    batteryLevel: z.number().min(0).max(100).optional(),
    lastLocation: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }).required(),
};

// =======================================================
// Update Device Status
export const updateStatusSchema = {
  body: z.strictObject({
    status: z.enum(["idle", "delivering", "offline"]),
    batteryLevel: z.number().min(0).max(100).optional(),
    lastLocation: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
};

// =======================================================
// Freeze/Deactivate Device
export const deactivateDeviceSchema = {
  params: z.strictObject({
    deviceId: z.string().min(1),
  }).required(),
};

// =======================================================
// Heartbeat
export const heartbeatSchema = {
  params: z.strictObject({
    deviceId: z.string().min(1),
  }).required(),
  body: z.strictObject({
    batteryLevel: z.number().min(0).max(100).optional(),
    lastLocation: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }).required(),
};

// =======================================================
// TypeScript Types
export type registerDeviceSchemaType = z.infer<typeof registerDeviceSchema.body>;
export type updateStatusSchemaType = z.infer<typeof updateStatusSchema.body>;
export type deactivateDeviceSchemaType = z.infer<typeof deactivateDeviceSchema.params>;
export type heartbeatSchemaType = z.infer<typeof heartbeatSchema.body>;