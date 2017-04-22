import { Injectable, Inject } from '@angular/core';
import { LoadingController, ToastController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Order } from '../models/order.model';
import * as firebase from 'firebase';

@Injectable()
export class OrderService {

    public constructor(private angularFire: AngularFire, private toastCtrl: ToastController, private LoadingCtrl: LoadingController) {
        // this.firebaseApp = firebaseApp;
    }

    getServerTimestamp() {
        return firebase.database.ServerValue.TIMESTAMP
    }

    placeOrder(order: Order) {
        let loading = this.LoadingCtrl.create({
            content: 'Placing order...'
        });
        loading.present();
        return new Promise((res, rej) => {
            this.getOrderId().then((orderId: number) => {
                order.orderId = orderId;
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
            }).catch(() => {
                rej();
            })
        })
    }

    fetchOrders() {
        return this.angularFire.database.list('/orders/', {
            query: {
                orderByChild: 'userId',
                equalTo: localStorage.getItem('uid')
            }
        });
    }

    cancelOrder(orderKey: string) {
        let loading = this.LoadingCtrl.create({
            content: 'Cancelling order...'
        })
        loading.present();
        return new Promise((res, rej) => {
            this.angularFire.database.object('/orders/' + orderKey).update({ status: 'Cancelled' }).then((success) => {
                this.toastCtrl.create({
                    message: 'Order cancelled.',
                    duration: 4500
                }).present();
                loading.dismiss();
                res();
            }).catch((error) => {
                this.toastCtrl.create({
                    message: 'Failed to cancel order.',
                    duration: 4500
                }).present();
                loading.dismiss();
                rej();
            });
        });
    }

    fetchOrderDetails(key) {
        let loading = this.LoadingCtrl.create({
            content: 'Loading order items...'
        });
        loading.present();
        return new Promise((res, rej) => {
            this.angularFire.database.object('/orders/' + key).subscribe((data: Order) => {
                loading.dismiss();
                res(data);
            });
        });
    }

    getOrderId() {
        // return new Promise((res, rej) => {
        //     firebase.database().ref('order_count').transaction((data) => {
        //         if (data === null) {
        //             return 1;
        //         }
        //         else {
        //             return data + 1;
        //         }
        //     }, (error, committed, snapshot) => {
        //         if (error) {
        //             rej(error);
        //         }

        //         else if (!committed) {
        //             rej('The value change did not take place.')
        //         }

        //         else {
        //             res(snapshot.val());
        //         }
        //     })
        // })

        // return new Promise((res, rej) => {
        //     let countSubscription = this.angularFire.database.object('/order_count').subscribe((data) => {
        //         console.log(data.$value);
        //         if (data.$value == null) {
        //             res(1);
        //             this.angularFire.database.object('/order_count').set(2);
        //         }

        //         else {
        //             res(data.$value);
        //             this.angularFire.database.object('/order_count').set(<number>data.$value + 1);
        //         }

        //         countSubscription.unsubscribe();
        //     })
        // })
        return new Promise((res, rej) => {
            this.angularFire.database.object('order_count').$ref.ref.transaction((data) => {
                if (data === null) {
                    return 1
                }
                else {
                    return data + 1;
                }
            }, (error, committed, snapshot) => {
                if (error) {
                    rej(error);
                }

                else if (!committed) {
                    rej('The value change did not take place.')
                }

                else {
                    res(snapshot.val());
                }
            })
        })
    }
}