import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FoodItem } from '../../models/food.model';
import { FoodPreference } from '../../models/preference.model';
import { BucketItem } from '../../models/bucketItem.model';
import { BucketService } from '../../services/bucket-service';

/*
  Generated class for the FoodOrder page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-food-order',
  templateUrl: 'food-order.html'
})
export class FoodOrderPage {
  selectedFoodItem: FoodItem;
  selectedKey: string = '';
  itemQuantity: number = 1;

  binaryPrefs: Array<FoodPreference> = [];
  singlePrefs: Array<FoodPreference> = [];
  multiPrefs: Array<FoodPreference> = [];

  binaryPrefSelect: Array<any> = [];
  singlePrefSelect: Array<any> = [];
  multiPrefSelect: Array<any> = [];

  orderPrefs: Array<any> = []

  constructor(public navCtrl: NavController, public navParams: NavParams, private bucketService: BucketService) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodOrderPage');

    let selectedBucketItem: BucketItem = this.navParams.get('bucketItem');
    if (selectedBucketItem) {
      if (selectedBucketItem.binaryPrefs) {
        this.binaryPrefSelect = selectedBucketItem.binaryPrefs;
      }

      if (selectedBucketItem.singlePrefs) {
        this.singlePrefSelect = selectedBucketItem.singlePrefs;
      }

      if (selectedBucketItem.multiPrefs) {
        this.multiPrefSelect = selectedBucketItem.multiPrefs;
      }

      this.itemQuantity = selectedBucketItem.quantity;
      this.selectedKey = this.navParams.get('itemKey');
    }

    this.selectedFoodItem = this.navParams.get('foodItem');
    this.selectedFoodItem.food_prefs.forEach((pref: FoodPreference) => {
      if (pref.pref_type === 'Single Value') {
        this.singlePrefs.push(pref);
        this.singlePrefSelect.push({ title: pref.pref_title, value: '' });
      }
      else if (pref.pref_type === 'Multi Value') {
        this.multiPrefs.push(pref);
        this.multiPrefSelect.push({ title: pref.pref_title, values: [] });
        pref.pref_values.forEach((value => {
          this.multiPrefSelect[this.multiPrefSelect.length - 1].values.push({ title: value, value: false });
        }))

      }
      else if (pref.pref_type === 'Binary') {
        this.binaryPrefs.push(pref);
        this.binaryPrefSelect.push({ title: pref.pref_title, value: false });
      }
    })


  }

  clickConfirm() {
    let bucketItem: BucketItem = {
      foodId: this.selectedFoodItem.$key,
      title: this.selectedFoodItem.food_title,
      quantity: this.itemQuantity,
      amount: this.itemQuantity * this.selectedFoodItem.food_price
    }

    if (this.binaryPrefSelect.length > 0) {
      bucketItem.binaryPrefs = this.binaryPrefSelect;
    }

    if (this.singlePrefSelect.length > 0) {
      bucketItem.singlePrefs = this.singlePrefSelect;
    }

    if (this.multiPrefSelect.length > 0) {
      bucketItem.multiPrefs = this.multiPrefSelect;
    }

    setTimeout(() => {
      console.log(bucketItem);
      if (this.selectedKey != '') {
        this.bucketService.updateBucketItem(bucketItem, this.selectedKey).then(() => { }).catch(() => { });
      }

      else {
        this.bucketService.addItemToBucket(bucketItem).then(() => { }).catch(() => { });
      }
    }, 300)
  }
}
