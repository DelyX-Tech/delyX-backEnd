import { Model } from 'mongoose';
import { DbRepository } from './DB.repository';
import { IOrder } from '../../model/orders.model';

export class OrdereRepository extends DbRepository<IOrder> {
  constructor(protected readonly model: Model<IOrder>) {
    super(model);
  }
}
