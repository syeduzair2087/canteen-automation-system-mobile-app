import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2';
import { FoodItem } from '../../models/food.model';
import { FoodService } from '../../services/food-service';
import { FoodOrderPage } from '../food-order/food-order';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

/*
  Generated class for the Food page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-food',
  templateUrl: 'food.html'
})
export class FoodPage {
  foodList: Array<FoodItem>;

  // options: PushOptions = {
  //   android: {
  //     senderID: '490551661425'
  //   },
  //   ios: {
  //     alert: 'true',
  //     badge: true,
  //     sound: 'false'
  //   },
  //   windows: {}
  // };
  // pushObject: PushObject;

  constructor(public navCtrl: NavController, public navParams: NavParams, private foodService: FoodService, public push: Push, private platform: Platform, private toastCtrl: ToastController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodPage');
    this.foodService.getFoodItems().then((data: FoodItem[]) => {
      this.foodList = data;
    });
    // this.platform.ready().then(() => {

    //   this.push.hasPermission().then((res: any) => {
    //     if (res.isEnabled) {

    //       this.toastCtrl.create({
    //         message: 'We have permission to send push notifications',
    //         duration: 4500
    //       }).present();
    //       console.log('We have permission to send push notifications');
    //     } else {
    //       console.log('We do not have permission to send push notifications');

    //       this.toastCtrl.create({
    //         message: 'We do not have permission to send push notifications',
    //         duration: 4500
    //       }).present();
    //     }


    //   })

    // })

   
  }

  clickFoodItem(selectedFoodItem: FoodItem) {
    // this.navCtrl.push(FoodDetailsPage, { foodItem : selectedFoodItem});
    this.navCtrl.push(FoodOrderPage, { foodItem: selectedFoodItem });
  }

  doRefresh(refresher) {
    this.foodService.getFoodItems().then((data: FoodItem[]) => {
      this.foodList = data;
      refresher.complete();
    })
  }
}
