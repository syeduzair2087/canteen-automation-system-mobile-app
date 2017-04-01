import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {OrderService} from '../../services/order-service';
import {Order} from '../../models/order.model';

/*
  Generated class for the OrderDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html'
})
export class OrderDetailsPage {
key: any;
OrderDetail: Order = {
   userId: '',
    orderTime: '',
    status: '',
    amount: null,
    items: []
};
  constructor(public navCtrl: NavController, public navParams: NavParams, private orderService: OrderService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailsPage');
    this.key = this.navParams.get('orderKey');
    console.log(this.key);
    
    this.orderService.fetchOrderDetails(this.key).then( (data : Order) => {
      this.OrderDetail = data;
      // console.log(this.OrderDetail);
      console.log(this.OrderDetail.amount);
      
      
    })
  }

}
