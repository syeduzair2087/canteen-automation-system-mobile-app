import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FoodItem } from '../../models/food.model';
import { FoodPreference } from '../../models/preference.model';
import { OrderPage } from '../order/order';

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
  binaryPrefs: Array<FoodPreference> = [];
  singlePrefs: Array<FoodPreference> = [];
  multiPrefs: Array<FoodPreference> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodDetailsPage');
    this.selectedFoodItem = this.navParams.get('foodItem');

    this.selectedFoodItem.food_prefs.forEach((pref: FoodPreference) => {
      if (pref.pref_type === 'Single Value') {
        this.singlePrefs.push(pref);
      }
      else if (pref.pref_type === 'Multi Value') {
        this.multiPrefs.push(pref)
      }
      else if (pref.pref_type === 'Binary') {
        this.binaryPrefs.push(pref);
      }
    })

    setTimeout(() => {
      console.log(this.binaryPrefs);
      console.log(this.singlePrefs);
      console.log(this.multiPrefs);
    }, 2000)
  }

  clickAddToBucket() {
    this.navCtrl.push(OrderPage, { foodItem: this.selectedFoodItem });
  }

}
