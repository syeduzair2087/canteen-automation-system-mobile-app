import { BucketItem } from './bucketItem.model'

export interface Order {
    userId: string,
    orderTime: Object,
    status: string,
    amount: number,
    items: Array<BucketItem>
}