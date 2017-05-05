import { BucketItem } from './bucketItem.model';
import { User } from './user.model';
import { OrderStatus } from './status.model';

export interface Order {
    orderId?: number,
    userId: string,
    orderTime: Object,
    status: OrderStatus,
    amount: number,
    cabin: number,   
    items: Array<BucketItem>,
    user?: User
}