import { Router } from "express";
const deviceRouter = Router();

import DS from "./device.service";
import { validation } from "../../middleware/validation";
import * as DV from "./device.validation";
import { Authentication } from "../../middleware/authentication";
import { RoleType } from "../../model/user.model";
import { Authorization } from "../../middleware/authorization";
import { TokenType } from "../../utils/token";


// =======================================================
// Register device (Admin only)
deviceRouter.post(
    "/register",
    Authentication(TokenType.access),
    Authorization({ accessRoles: [RoleType.admin] }),
    validation(DV.registerDeviceSchema),
    DS.registerDevice
);

// =======================================================
// Get all devices (Admin / User)
deviceRouter.get(
    "/",
    Authentication(),
    Authorization({ accessRoles: [RoleType.admin, RoleType.user] }),
    DS.getAllDevices
);

// =======================================================
// Get single device (Admin / User)
deviceRouter.get(
    "/:deviceId",
    Authentication(),
    Authorization({ accessRoles: [RoleType.admin, RoleType.user] }),
    DS.getSingleDevice
);

// =======================================================
// Update device status (Admin only)
deviceRouter.patch(
    "/:deviceId/status",
    Authentication(),
    Authorization({ accessRoles: [RoleType.admin] }),
    validation(DV.updateStatusSchema),
    DS.updateStatus
);

// =======================================================
// Heartbeat (Device + Admin) 
deviceRouter.patch(
    "/:deviceId/heartbeat",
    Authentication(),
    Authorization({ accessRoles: [RoleType.admin, RoleType.user] }),
    DS.heartbeat
);

// =======================================================
// Deactivate device (Admin only)
deviceRouter.patch(
    "/:deviceId/deactivate",
    Authentication(),
    Authorization({ accessRoles: [RoleType.admin] }),
    DS.deactivateDevice
);

export default deviceRouter;