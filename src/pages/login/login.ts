import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { AccountService } from '../../services/account-service'
import { FoodPage } from '../food/food'

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private accountService: AccountService, private menuCtrl: MenuController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  clickLogin(email: string, password: string) {
    this.accountService.loginUser(email, password).then((user) => {
      this.navCtrl.setRoot({title: 'Food', component: FoodPage}.component);
      this.menuCtrl.enable(true);
    }).catch((error) => console.log(error));
  }
}
