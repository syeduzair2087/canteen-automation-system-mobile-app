import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2';
import { FoodItem } from '../../models/food.model';
import { FoodService } from '../../services/food-service';
import { FoodDetailsPage } from '../food-details/food-details'

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private foodService: FoodService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodPage');
    this.foodService.getFoodItems().then((data: FoodItem[]) => {
      this.foodList = data;
    })
  }

  clickFoodItem(selectedFoodItem: FoodItem){
    this.navCtrl.push(FoodDetailsPage, { foodItem : selectedFoodItem});
  }

  doRefresh(refresher) {
    this.foodService.getFoodItems().then((data: FoodItem[]) => {
      this.foodList = data;
      refresher.complete();
    })
  }
}
