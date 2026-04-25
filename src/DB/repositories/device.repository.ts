import { Model } from 'mongoose';
import { DbRepository } from './DB.repository';
import { IDevice } from '../../model/device.model';

export class DeviceRepository extends DbRepository<IDevice> {
  constructor(protected readonly model: Model<IDevice>) {
    super(model);
  }
}
