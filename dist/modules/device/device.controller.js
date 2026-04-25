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
const deviceRouter = (0, express_1.Router)();
const device_service_1 = __importDefault(require("./device.service"));
const validation_1 = require("../../middleware/validation");
const DV = __importStar(require("./device.validation"));
const authentication_1 = require("../../middleware/authentication");
const user_model_1 = require("../../model/user.model");
const authorization_1 = require("../../middleware/authorization");
deviceRouter.post("/register", (0, authentication_1.Authentication)(), (0, authorization_1.Authorization)({ accessRoles: [user_model_1.RoleType.admin] }), (0, validation_1.validation)(DV.registerDeviceSchema), device_service_1.default.registerDevice);
deviceRouter.get("/", (0, authentication_1.Authentication)(), (0, authorization_1.Authorization)({ accessRoles: [user_model_1.RoleType.admin, user_model_1.RoleType.user] }), device_service_1.default.getAllDevices);
deviceRouter.get("/:deviceId", (0, authentication_1.Authentication)(), (0, authorization_1.Authorization)({ accessRoles: [user_model_1.RoleType.admin, user_model_1.RoleType.user] }), device_service_1.default.getSingleDevice);
deviceRouter.patch("/:deviceId/status", (0, authentication_1.Authentication)(), (0, authorization_1.Authorization)({ accessRoles: [user_model_1.RoleType.admin] }), (0, validation_1.validation)(DV.updateStatusSchema), device_service_1.default.updateStatus);
deviceRouter.patch("/:deviceId/heartbeat", (0, authentication_1.Authentication)(), (0, authorization_1.Authorization)({ accessRoles: [user_model_1.RoleType.admin, user_model_1.RoleType.user] }), device_service_1.default.heartbeat);
deviceRouter.patch("/:deviceId/deactivate", (0, authentication_1.Authentication)(), (0, authorization_1.Authorization)({ accessRoles: [user_model_1.RoleType.admin] }), device_service_1.default.deactivateDevice);
exports.default = deviceRouter;
