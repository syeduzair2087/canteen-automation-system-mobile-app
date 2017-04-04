import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { AccountService } from '../../services/account-service';
import { FoodPage } from '../food/food';

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController, private accountService: AccountService) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  clickRegister(displayName: string, email: string, phoneNumber: number, cabinNumber: number, password: string) {
    this.accountService.registerUser(displayName, email, phoneNumber, cabinNumber, password).then(() => {
      // this.navCtrl.pop();
      this.accountService.loginUser(email, password).then(() => {
        this.navCtrl.setRoot({ title: 'Food', component: FoodPage }.component);
        this.menuCtrl.enable(true);
      }).catch(() => {});
    }).catch(() => {});
  }
}
