import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { Order } from '../models/order.model';

@Injectable()
export class OrderService {
    public constructor(private angularFire: AngularFire, private toastCtrl: ToastController, private LoadingCtrl: LoadingController) { }

    placeOrder(order: Order) {
        let loading = this.LoadingCtrl.create({
            content: 'Placing order...'
        });
        loading.present();
        return new Promise((res, rej) => {
            this.angularFire.database.list('/orders').push(order).then(() => {
                this.toastCtrl.create({
                    message: 'Order placed successfully.',
                    duration: 4500
                }).present();
                loading.dismiss();
                res();
            }).catch((error) => {
                console.log(error);
                this.toastCtrl.create({
                    message: 'Failed to place order. Please try again.',
                    duration: 4500
                }).present();
                loading.dismiss();
                rej();
            })
        })
    }

    fetchOrders() {
        let loading = this.LoadingCtrl.create({
            content: 'Fetching orders...'
        });
        loading.present();
        return new Promise((res, rej) => {
            this.angularFire.database.list('/orders', {
                query: {
                    orderByChild: 'userId',
                    equalTo: localStorage.getItem('uid')
                }
            }).subscribe((data: Array<Order>) => {
                loading.dismiss();
                res(data);
            });
        })
    }
}