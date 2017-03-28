import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order-service';

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
  orderList: Array<Order> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private orderService: OrderService) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
    this.orderService.fetchOrders().then((data: Array<Order>) => {
      this.orderList = data;
    })
  }
}
