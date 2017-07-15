import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FoodItem } from '../../models/food.model';
import { FoodPreference } from '../../models/preference.model';
import { BucketItem } from '../../models/bucketItem.model';
import { BucketService } from '../../services/bucket-service';
import { Subscription } from 'rxjs';
import _ from 'lodash';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private bucketService: BucketService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodOrderPage');

    this.selectedFoodItem = this.navParams.get('foodItem');
    this.selectedKey = this.navParams.get('itemKey');
    this.selectedFoodItem.food_prefs.forEach((pref: FoodPreference, index) => {
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

      if (index == (this.selectedFoodItem.food_prefs.length - 1)) {
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
      }
    })
  }

  clickConfirm() {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();
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
      if (this.selectedKey !== undefined) {
        console.log('bucket item updated');
        this.bucketService.updateBucketItem(bucketItem, this.selectedKey).then(() => {
          console.log('edit fired');
          loading.dismiss();
          this.navCtrl.pop();
        }).catch(() => { loading.dismiss(); });
      }
      else {
        this.productExist(bucketItem).then((data: any) => {
          console.log(data)
          if (data == false) {
            console.log('new item added');
            this.bucketService.addItemToBucket(bucketItem).then(() => {
              console.log('add fired');
              loading.dismiss();
              this.navCtrl.pop();
            }).catch(() => { loading.dismiss(); });
          }
          else {
            // console.log('existing item updated');
            // this.bucketService.updateBucketItem(bucketItem, data).then(() => {
            //   console.log('edit fired');
            //   loading.dismiss();
            //   this.navCtrl.pop();
            // }).catch(() => { loading.dismiss(); });
            loading.dismiss();
            this.alertCtrl.create({
              title: 'Confirm',
              message: 'Item already exist in bucket. Do you want to replace?',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel'
                },
                {
                  text: 'Replace',
                  handler: () => {
                    let lading = this.loadingCtrl.create({
                      content: 'Replaceing item...'
                    });
                    lading.present();
                    this.bucketService.updateBucketItem(bucketItem, data).then(() => {
                      console.log('edit fired');
                      lading.dismiss();
                      this.navCtrl.pop();
                    }).catch(() => {
                      lading.dismiss();
                    });
                    // console.log('ok')
                  }
                }]
            }).present();
          }
        })
      }
    }, 200);

    // console.log(bucketItem);
    // this.productExist(bucketItem).then((data) => {
    //   console.log(data)
    //   setTimeout(() => {
    //     console.log('this.selectedKey ' + this.selectedKey);
    //     if (this.selectedKey !== undefined) {
    //       this.bucketService.updateBucketItem(bucketItem, this.selectedKey).then(() => {
    //         console.log('edit fired');
    //         this.navCtrl.pop();
    //       }).catch(() => { });
    //     }
    //     else {
    //       this.bucketService.addItemToBucket(bucketItem).then(() => {
    //         console.log('add fired');
    //         this.navCtrl.pop();
    //       }).catch(() => { });
    //     }
    //   }, 300)
    // }).catch((error) => {
    //   console.log(error);
    // })

    // setTimeout(() => {
    //   // console.log(this.selectedKey);
    //   if (this.selectedKey !== undefined) {
    //     this.bucketService.updateBucketItem(bucketItem, this.selectedKey).then(() => {
    //       console.log('edit fired');
    //       this.navCtrl.pop();
    //     }).catch(() => { });
    //   }
    //   else {
    //     this.bucketService.addItemToBucket(bucketItem).then(() => {
    //       console.log('add fired');
    //       this.navCtrl.pop();
    //     }).catch(() => { });
    //   }
    // }, 300)
  }




  // addItemToBucket(bucketItem) {
  //   return new Promise((res, rej) => {
  //     this.bucketService.addItemToBucket(bucketItem).then(() => {
  //       console.log('add fired');
  //       this.navCtrl.pop();
  //     }).catch(() => { });
  //   })
  // }

  // updateBucketItem(bucketItem, itemKey) {
  //   this.bucketService.updateBucketItem(bucketItem, itemKey).then(() => {
  //     console.log('edit fired');
  //     this.navCtrl.pop();
  //   }).catch(() => { });
  // }

  productExist(bucketItem) {
    console.log('bucketItem')
    return new Promise((res, rej) => {

      let bucketData: Subscription = this.bucketService.fetchBucket().subscribe((data: Array<BucketItem>) => {
        bucketData.unsubscribe();
        // console.log('ko')
        //  let result  =data.map((element, index) => {
        //  let match =  _.isEqual(_.omit(element, ['$key', '$exists', 'amount', 'quantity']), _.omit(bucketItem, ['amount', 'quantity']))
        //  if(match){
        //    return element.$key;
        //  }
        //  });
        //  res(result);
        let match: any = false
        data.forEach(element => {
          match = _.isEqual(_.omit(element, ['$key', '$exists', 'amount', 'quantity']), _.omit(bucketItem, ['amount', 'quantity']))
          if (match) {
            res(element.$key);
          }
        });
        res(match);
      })
    })
  }
}
