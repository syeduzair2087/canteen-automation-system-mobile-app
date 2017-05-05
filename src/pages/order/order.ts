import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order-service';
import { OrderDetailsPage } from '../order-details/order-details';
import { ReversePipe } from '../../pipes/reverse.pipe';

/*
  Generated class for the Order page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order',
  templateUrl: 'order.html'
})
export class OrderPage {
  // orderList: Array<Order> = [];
  orderList: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private orderService: OrderService, private altrCtrl: AlertController) { }

  viewOrderDetail($key) {
    this.navCtrl.push(OrderDetailsPage, { orderKey: $key });
  }

  CancelOrder($key) {
    let conformAlert = this.altrCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to cancel the order?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: data => {
            console.log($key);
            this.orderService.cancelOrder($key).then(() => { }).catch(() => { })
          }
        }
      ]
    });
    conformAlert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
    // this.orderService.fetchOrders().subscribe((data) => {
    //   this.orderList = data
    // })
    this.orderList = this.orderService.fetchOrders()
    // .then((data: Array<Order>) => {
    //   this.orderList = data;
    // })
    // this.orderService.getOrderCount().then(() => {});
  }
}
