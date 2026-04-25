"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const device_repository_1 = require("../../DB/repositories/device.repository");
const device_model_1 = __importDefault(require("../../model/device.model"));
const classError_1 = require("../../utils/classError");
const enums_1 = require("../../utils/enums");
class DeviceService {
    _deviceModel = new device_repository_1.DeviceRepository(device_model_1.default);
    registerDevice = async (req, res) => {
        const { deviceId } = req.body;
        if (!deviceId)
            throw new classError_1.AppError("deviceId required", 400);
        const existing = await this._deviceModel.findOne({
            filter: { deviceId }
        });
        if (existing) {
            throw new classError_1.AppError("Device already exists", 409);
        }
        const device = await this._deviceModel.create({
            deviceId,
            status: enums_1.DeviceStatus.IDLE,
            isActive: true,
            batteryLevel: 100
        });
        return res.status(201).json({ device });
    };
    getAllDevices = async (req, res) => {
        const devices = await this._deviceModel.find({
            filter: {},
            options: { sort: { createdAt: -1 } }
        });
        return res.status(200).json({ devices });
    };
    getSingleDevice = async (req, res) => {
        const { deviceId } = req.params;
        const device = await this._deviceModel.findOne({
            filter: { deviceId }
        });
        if (!device)
            throw new classError_1.AppError("Device not found", 404);
        return res.status(200).json({ device });
    };
    updateStatus = async (req, res) => {
        const { deviceId } = req.params;
        const { status } = req.body;
        if (!Object.values(enums_1.DeviceStatus).includes(status)) {
            throw new classError_1.AppError("Invalid status", 400);
        }
        const device = await this._deviceModel.findOneAndUpdate({ deviceId }, { status }, { new: true });
        if (!device)
            throw new classError_1.AppError("Device not found", 404);
        return res.status(200).json({ device });
    };
    heartbeat = async (req, res) => {
        const { deviceId } = req.params;
        const { status, batteryLevel, lat, lng } = req.body;
        if (!deviceId)
            throw new classError_1.AppError("deviceId required", 400);
        const updateData = {
            lastSeen: new Date()
        };
        if (status && Object.values(enums_1.DeviceStatus).includes(status)) {
            updateData.status = status;
        }
        if (batteryLevel !== undefined) {
            if (batteryLevel < 0 || batteryLevel > 100) {
                throw new classError_1.AppError("Invalid battery level", 400);
            }
            updateData.batteryLevel = batteryLevel;
        }
        if (lat !== undefined && lng !== undefined) {
            updateData.lastLocation = { lat, lng };
        }
        const device = await this._deviceModel.findOneAndUpdate({ deviceId }, updateData, { new: true });
        if (!device)
            throw new classError_1.AppError("Device not found", 404);
        return res.status(200).json({ device });
    };
    deactivateDevice = async (req, res) => {
        const { deviceId } = req.params;
        const device = await this._deviceModel.findOneAndUpdate({ deviceId }, {
            isActive: false,
            status: enums_1.DeviceStatus.OFFLINE
        }, { new: true });
        if (!device)
            throw new classError_1.AppError("Device not found", 404);
        return res.status(200).json({ device });
    };
}
exports.default = new DeviceService();
