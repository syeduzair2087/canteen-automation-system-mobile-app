import { BucketItem } from './bucketItem.model'

export interface Order {
    userId: string,
    orderTime: string,
    status: string,
    amount: number,
    items: Array<BucketItem>
}