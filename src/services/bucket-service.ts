import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { BucketItem } from '../models/bucketItem.model';

@Injectable()
export class BucketService {
    constructor(private angularFire: AngularFire, private loadingCtrl: LoadingController, private toastCtrl: ToastController) { }

    addToItemToBucket(bucketItem: BucketItem) {
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
}