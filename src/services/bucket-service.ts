import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { BucketItem } from '../models/bucketItem.model';

@Injectable()
export class BucketService {
    constructor(private angularFire: AngularFire, private loadingCtrl: LoadingController, private toastCtrl: ToastController) { }

    addItemToBucket(bucketItem: BucketItem) {
        let loading = this.loadingCtrl.create({
            content: 'Adding to bucket...'
        });
        loading.present();
        return new Promise((res, rej) => {
            this.angularFire.database.list('/buckets/' + localStorage.getItem('uid')).push(bucketItem).then(() => {
                loading.dismiss();
                this.toastCtrl.create({
                    message: 'Item added to bucket.',
                    duration: 4500
                }).present();
                res();
            }).catch((error) => {
                loading.dismiss();
                this.toastCtrl.create({
                    message: 'Failed to add item to bucket.',
                    duration: 4500
                }).present();
                console.log(error);
                rej();
            })
        })
    }

    fetchBucket() {
        // return new Promise((res, rej) => {
        //     this.angularFire.database.list('/buckets/' + localStorage.getItem('uid')).subscribe((data: Array<BucketItem>) => {
        //         res(data);
        //     }).unsubscribe();
        // })
        return this.angularFire.database.list('buckets/' + localStorage.getItem('uid'));
    }

    removeItemfromBucket(itemKey: string) {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Removing item...'
            });
            loading.present();
            this.angularFire.database.list('/buckets/' + localStorage.getItem('uid') + '/' + itemKey).remove().then(() => {
                this.toastCtrl.create({
                    message: 'Item deleted successfully!',
                    duration: 4500
                }).present();
                loading.dismiss();
                res();
            }).catch(() => {
                this.toastCtrl.create({
                    message: 'Failed to delete. Please try again.',
                    duration: 4500
                }).present();
                loading.dismiss();
                rej();
            })
        })
    }

    updateBucketItem(bucketItem: BucketItem, itemKey: string) {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Updating item...'
            });
            loading.present();
            this.angularFire.database.object('/buckets/' + localStorage.getItem('uid') + '/' + itemKey).update(bucketItem).then(() => {
                this.toastCtrl.create({
                    message: 'Item updated successfully',
                    duration: 4500
                }).present();
                loading.dismiss();
                res();
            }).catch((error) => {
                console.log(error);
                this.toastCtrl.create({
                    message: 'Failed to update item. Please try again.',
                    duration: 4500
                }).present();
                loading.dismiss();
                rej();
            })
        })
    }
}