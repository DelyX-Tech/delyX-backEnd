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
        const { deviceName, type, status, batteryLevel, lastLocation } = req.body;
        const device = await this._deviceModel.create({
            deviceName,
            type,
            status: status || "idle",
            lastLocation: lastLocation || null,
            isActive: true,
            lastSeen: new Date()
        });
        return res.status(201).json({
            message: "device registered",
            device: {
                ...device.toObject(),
                deviceId: device._id
            }
        });
    };
    getAllDevices = async (req, res) => {
        const devices = await this._deviceModel.find({
            filter: {},
            options: { sort: { createdAt: -1 } }
        });
        return res.status(200).json({
            devices: devices.map((d) => ({
                ...d.toObject(),
                deviceId: d._id
            }))
        });
    };
    getSingleDevice = async (req, res) => {
        const { deviceId } = req.params;
        const device = await this._deviceModel.findOne({ _id: deviceId });
        if (!device)
            throw new classError_1.AppError("Device not found", 404);
        const { _id, ...cleanDevice } = device.toObject();
        return res.status(200).json({
            device: {
                ...cleanDevice,
                deviceId: _id
            }
        });
    };
    updateStatus = async (req, res) => {
        const { deviceId } = req.params;
        const { status } = req.body;
        if (!Object.values(enums_1.DeviceStatus).includes(status)) {
            throw new classError_1.AppError("Invalid status", 400);
        }
        const device = await this._deviceModel.findOneAndUpdate({ _id: deviceId }, { status }, { new: true });
        if (!device)
            throw new classError_1.AppError("Device not found", 404);
        return res.status(200).json({
            device: {
                ...device.toObject(),
                deviceId: device._id
            }
        });
    };
    heartbeat = async (req, res) => {
        const { deviceId } = req.params;
        const { status, lat, lng } = req.body;
        if (!deviceId)
            throw new classError_1.AppError("deviceId required", 400);
        const updateData = {
            lastSeen: new Date()
        };
        if (status && Object.values(enums_1.DeviceStatus).includes(status)) {
            updateData.status = status;
        }
        if (lat !== undefined && lng !== undefined) {
            updateData.lastLocation = { lat, lng };
        }
        const device = await this._deviceModel.findOneAndUpdate({ _id: deviceId }, updateData, { new: true });
        if (!device)
            throw new classError_1.AppError("Device not found", 404);
        return res.status(200).json({
            device: {
                ...device.toObject(),
                deviceId: device._id
            }
        });
    };
    deactivateDevice = async (req, res) => {
        const { deviceId } = req.params;
        const device = await this._deviceModel.findOneAndUpdate({ _id: deviceId }, { isActive: false, status: enums_1.DeviceStatus.OFFLINE }, { new: true });
        if (!device)
            throw new classError_1.AppError("Device not found", 404);
        return res.status(200).json({
            device: {
                ...device.toObject(),
                deviceId: device._id
            }
        });
    };
}
exports.default = new DeviceService();
