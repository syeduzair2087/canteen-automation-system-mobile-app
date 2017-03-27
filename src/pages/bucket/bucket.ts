import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { BucketService } from '../../services/bucket-service';
import { FoodService } from '../../services/food-service'
import { BucketItem } from '../../models/bucketItem.model';
import { FirebaseListObservable } from 'angularfire2';
import { OrderPage } from '../order/order';

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
  bucketList: FirebaseListObservable<Array<BucketItem>>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private bucketService: BucketService, private foodService: FoodService) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BucketPage');
    this.bucketList = this.bucketService.fetchBucket();
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
      // console.log(data);
      this.navCtrl.push(OrderPage, {
        foodItem: data,
        bucketItem: bucketItem,
        itemKey: bucketItem.$key
      })
    });
    // this.navCtrl.push(OrderPage);
  }

}
