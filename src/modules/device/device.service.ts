import { Request, Response, NextFunction } from "express";
import { DeviceRepository } from "../../DB/repositories/device.repository";
import deviceModel from "../../model/device.model";
import { AppError } from "../../utils/classError";
import { DeviceStatus } from "../../utils/enums";

class DeviceService {
    private _deviceModel = new DeviceRepository(deviceModel);

    // REGISTER
    registerDevice = async (req: Request, res: Response) => {
        const { deviceId } = req.body;

        if (!deviceId) throw new AppError("deviceId required", 400);

        const existing = await this._deviceModel.findOne({
            filter: { deviceId }
        });

        if (existing) {
            throw new AppError("Device already exists", 409);
        }

        const device = await this._deviceModel.create({
            deviceId,
            status: DeviceStatus.IDLE,
            isActive: true,
            batteryLevel: 100
        });

        return res.status(201).json({ device });
    };

    // GET ALL
    getAllDevices = async (req: Request, res: Response) => {
        const devices = await this._deviceModel.find({
            filter: {},
            options: { sort: { createdAt: -1 } }
        });

        return res.status(200).json({ devices });
    };

    // GET ONE
    getSingleDevice = async (req: Request, res: Response) => {
        const { deviceId } = req.params;

        const device = await this._deviceModel.findOne({
            filter: { deviceId }
        });

        if (!device) throw new AppError("Device not found", 404);

        return res.status(200).json({ device });
    };

    // UPDATE STATUS
    updateStatus = async (req: Request, res: Response) => {
        const { deviceId } = req.params;
        const { status } = req.body;

        if (!Object.values(DeviceStatus).includes(status)) {
            throw new AppError("Invalid status", 400);
        }

        const device = await this._deviceModel.findOneAndUpdate(
            { deviceId },
            { status },
            { new: true }
        );

        if (!device) throw new AppError("Device not found", 404);

        return res.status(200).json({ device });
    };

    // HEARTBEAT
    heartbeat = async (req: Request, res: Response) => {
        const { deviceId } = req.params;
        const { status, batteryLevel, lat, lng } = req.body;

        if (!deviceId) throw new AppError("deviceId required", 400);

        const updateData: any = {
            lastSeen: new Date()
        };

        if (status && Object.values(DeviceStatus).includes(status)) {
            updateData.status = status;
        }

        if (batteryLevel !== undefined) {
            if (batteryLevel < 0 || batteryLevel > 100) {
                throw new AppError("Invalid battery level", 400);
            }
            updateData.batteryLevel = batteryLevel;
        }

        if (lat !== undefined && lng !== undefined) {
            updateData.lastLocation = { lat, lng };
        }

        const device = await this._deviceModel.findOneAndUpdate(
            { deviceId },
            updateData,
            { new: true }
        );

        if (!device) throw new AppError("Device not found", 404);

        return res.status(200).json({ device });
    };

    // DEACTIVATE
    deactivateDevice = async (req: Request, res: Response) => {
        const { deviceId } = req.params;

        const device = await this._deviceModel.findOneAndUpdate(
            { deviceId },
            {
                isActive: false,
                status: DeviceStatus.OFFLINE
            },
            { new: true }
        );

        if (!device) throw new AppError("Device not found", 404);

        return res.status(200).json({ device });
    };
}

export default new DeviceService();