import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FoodItem } from '../../models/food.model';
import { FoodOrderPage } from '../food-order/food-order';

/*
  Generated class for the FoodDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-food-details',
  templateUrl: 'food-details.html'
})
export class FoodDetailsPage {
  selectedFoodItem: FoodItem;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodDetailsPage');
    this.selectedFoodItem = this.navParams.get('foodItem');
  }

  clickAddToBucket() {
    this.navCtrl.push(FoodOrderPage, { foodItem : this.selectedFoodItem});
  }

}
