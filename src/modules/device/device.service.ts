import { Request, Response } from "express";
import { DeviceRepository } from "../../DB/repositories/device.repository";
import deviceModel from "../../model/device.model";
import { AppError } from "../../utils/classError";
import { DeviceStatus } from "../../utils/enums";

class DeviceService {
    private _deviceModel = new DeviceRepository(deviceModel);

    // REGISTER
    registerDevice = async (req: Request, res: Response) => {
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

    // GET ALL
    getAllDevices = async (req: Request, res: Response) => {
        const devices = await this._deviceModel.find({
            filter: {},
            options: { sort: { createdAt: -1 } }
        });

        return res.status(200).json({
            devices: devices.map((d: any) => ({
                ...d.toObject(),
                deviceId: d._id
            }))
        });
    };

    // GET ONE
    getSingleDevice = async (req: Request, res: Response) => {
    const { deviceId } = req.params;

    const device = await this._deviceModel.findOne({ _id: deviceId });

    if (!device) throw new AppError("Device not found", 404);

    const { _id, ...cleanDevice } = device.toObject();

    return res.status(200).json({
        device: {
            ...cleanDevice,
            deviceId: _id
        }
    });
};
        
    // UPDATE STATUS
    updateStatus = async (req: Request, res: Response) => {
        const { deviceId } = req.params;
        const { status } = req.body;

        if (!Object.values(DeviceStatus).includes(status)) {
            throw new AppError("Invalid status", 400);
        }

        const device = await this._deviceModel.findOneAndUpdate(
            { _id: deviceId },
            { status },
            { new: true }
        );

        if (!device) throw new AppError("Device not found", 404);

        return res.status(200).json({
            device: {
                ...device.toObject(),
                deviceId: device._id
            }
        });
    };

    // HEARTBEAT
    heartbeat = async (req: Request, res: Response) => {
        const { deviceId } = req.params;
        const { status, lat, lng } = req.body;
        if (!deviceId) throw new AppError("deviceId required", 400);
        const updateData: any = {
            lastSeen: new Date()
        };
        if (status && Object.values(DeviceStatus).includes(status)) {
            updateData.status = status;
        }
        
        if (lat !== undefined && lng !== undefined) {
            
            updateData.lastLocation = { lat, lng };
        }

        const device = await this._deviceModel.findOneAndUpdate(
            { _id: deviceId },
            updateData,
            { new: true }
        );
        
        if (!device) throw new AppError("Device not found", 404);
        
        return res.status(200).json({
            device: {
                ...device.toObject(),
                
                deviceId: device._id
            }
        });
    };


    // DEACTIVATE
    deactivateDevice = async (req: Request, res: Response) => {
        const { deviceId } = req.params;

        const device = await this._deviceModel.findOneAndUpdate(
            { _id: deviceId },
            { isActive: false, status: DeviceStatus.OFFLINE },
            { new: true }
        );

        if (!device) throw new AppError("Device not found", 404);

        return res.status(200).json({
            device: {
                ...device.toObject(),
                deviceId: device._id
            }
        });
    };
}

export default new DeviceService();