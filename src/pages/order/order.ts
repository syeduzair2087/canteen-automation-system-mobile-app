import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {FirebaseListObservable} from 'angularfire2';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order-service';
import {OrderDetailsPage} from '../order-details/order-details';

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
  orderList: FirebaseListObservable<Array<Order>>;
  constructor(public navCtrl: NavController, public navParams: NavParams, private orderService: OrderService, private altrCtlr: AlertController) { }

viewOrderDetail($key){
  this.navCtrl.push(OrderDetailsPage , {orderKey:$key});
  
}

CancelOrder($key){
  
  let conformAlert = this.altrCtlr.create({
    title : 'Cancel order',
    message : 'Are you sure? you want to cancel this order!',
    buttons : [
      {
        text : 'Cancel \
         order',
        handler : data => {
          console.log($key);
          this.orderService.changeOrderStatus($key).then((success) => {

          }).catch( (error) =>{
            
          })
        }
      },
      {
        text : 'Leave',
        handler : data => {

        } 
      }
    ]
  });
  conformAlert.present();
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
    this.orderList =  this.orderService.fetchOrders()
    // .then((data: Array<Order>) => {
    //   this.orderList = data;
    // })
  }
}
