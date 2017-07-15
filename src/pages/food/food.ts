import { Component, ElementRef, Directive, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, ToastController, LoadingController, Content } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2';
import { FoodItem } from '../../models/food.model';
import { FoodService } from '../../services/food-service';
import { FoodOrderPage } from '../food-order/food-order';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { FilterFoodByNamePipe } from '../../pipes/food.pipe';
import { Subscription } from 'rxjs';
import { Gesture  } from 'ionic-angular'

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
  @ViewChild('content') content: Content;
  foodList: Array<FoodItem>;
  foodSubscription: Subscription;
  filterFoodName: string = '';
  swipDownGesture: Gesture;
  el: HTMLElement;
  searchBar: boolean = false;


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

  constructor(public navCtrl: NavController, public navParams: NavParams, private foodService: FoodService, public push: Push, private platform: Platform, private toastCtrl: ToastController, el: ElementRef, private loadingCtrl: LoadingController) { 
    this.el = el.nativeElement;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodPage');
    let loading = this.loadingCtrl.create({
            content: 'Fetching menu...'
        });
        loading.present()

    this.foodSubscription = this.foodService.getFoodItems().subscribe((data : Array<FoodItem>) => {
      loading.dismiss();
      this.content.scrollToBottom();
      this.foodList = data;
    });
    // this.foodService.getFoodItems().then((data: FoodItem[]) => {
    //   this.foodList = data;
    // }); 
    this.swipDownGesture = new Gesture(this.el);
    this.swipDownGesture.listen();
    this.swipDownGesture.on('pandown', e => {
      console.log(typeof  e.type)
      if(e.type == 'pandown'){
        this.swipeEvent();
      }
    
    })
     
  }

  
  ionViewWillLeave() {
    this.foodSubscription.unsubscribe();
  }

  clickFoodItem(selectedFoodItem: FoodItem) {
    this.navCtrl.push(FoodOrderPage, { foodItem: selectedFoodItem });
  }

  // doRefresh(refresher) {
  //   this.foodService.getFoodItems().then((data: FoodItem[]) => {
  //     this.foodList = data;
  //     refresher.complete();
  //   })
  // }

  //   getItems(ev: any) {
  //   let val = ev.target.value;
  //   this.filterFoodName = val;
  // }

  swipeEvent(){
    console.log(" swipedown ");
    if(!this.searchBar){
      this.searchBar = true;
    }
  }
}
