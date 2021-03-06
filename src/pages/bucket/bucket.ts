import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { BucketService } from '../../services/bucket-service';
import { FoodService } from '../../services/food-service';
import { OrderService } from '../../services/order-service'
import { AccountService } from '../../services/account-service'
import { BucketItem } from '../../models/bucketItem.model';
import { Order } from '../../models/order.model'
import { FirebaseListObservable } from 'angularfire2';
import { FoodOrderPage } from '../food-order/food-order';
import { FoodPage } from '../food/food';
import { TotalComponent } from '../../component/total.component/total.compoment';
import { Subscription } from 'rxjs';

/*
  Generated class for the Bucket page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bucket',
  templateUrl: 'bucket.html'
})
export class BucketPage {
  bucketList: Array<BucketItem>;
  bucketSubscription: Subscription;
  amount: number = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private bucketService: BucketService, private foodService: FoodService, private datePipe: DatePipe, private orderService: OrderService, private accountService: AccountService) { }

  // ionViewCanEnter() {
  //   console.log('ionViewCanEnter ');
  // }

  ionViewDidEnter() {
    console.log('ionViewDidLoad BucketPage');
    this.bucketSubscription = this.bucketService.fetchBucket().subscribe((data: Array<BucketItem>) => {
      this.bucketList = data;
    })
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
    this.bucketSubscription.unsubscribe();
  }

  clickRemove(itemIndex: string) {
    this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to remove the selected item from bucket?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: () => {
            this.bucketService.removeItemfromBucket(itemIndex);
          }
        }
      ]
    }).present();
  }

  clickEdit(bucketItem: BucketItem) {
    this.foodService.getFoodItemById(bucketItem.foodId).then((data) => {
      // console.log(bucketItem.$key);
      this.navCtrl.push(FoodOrderPage, {
        foodItem: data,
        bucketItem: bucketItem,
        itemKey: bucketItem.$key
      })
    });
    // this.navCtrl.push(OrderPage);
  }

  clickCheckout(event) {
    this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to place the order?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: () => {
            let items: Array<BucketItem> = [];
            this.accountService.getCabinNumber().then((cabinNumber: number) => {

              // this.bucketList.subscribe((data) => {
              //   items = data;
              // }).unsubscribe();

              let totalAmount: number = 0;

              this.bucketList.forEach((item: BucketItem, index: number) => {
                totalAmount += item.amount;
                if (index == (this.bucketList.length - 1)) {
                  let order: Order = {
                    userId: localStorage.getItem('uid'),
                    cabin: cabinNumber,
                    // orderTime: new Date().toString(),
                    orderTime: this.orderService.getServerTimestamp(),
                    status: {
                      state: 'Pending'
                    },
                    amount: totalAmount,
                    items: this.bucketList
                  };
                  console.log(order);
                  this.orderService.placeOrder(order)
                    .then(() => {
                      this.bucketService.emptyBucket().then(() => {
                        this.navCtrl.setRoot({ title: 'Foods', component: FoodPage }.component);
                      }).catch(() => { })
                    }).catch(() => { });
                }
              })
            });
          }
        }
      ]
    }).present();
  }

  getTotalAmount() {
    // let amount: number = 0;
    // this.amount = 0;
    let amount = 0;
    if (this.bucketList && this.bucketList.length) {
      this.bucketList.forEach((item: BucketItem, index: number) => {
        amount += item.amount;
        // if (index == this.bucketList.length - 1) {
        // }
      });
      // console.log('found: ' + amount);
      return amount;
    } else {
      // console.log('not found: ' + amount);
      return amount;
    }

    // return 66;
  }
}
