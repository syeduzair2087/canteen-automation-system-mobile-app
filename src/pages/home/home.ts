import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { RegisterPage } from '../register/register'
import { LoginPage } from '../login/login'
import { FoodService } from '../../services/food-service'
import { AngularFire } from 'angularfire2'

/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController, private foodService: FoodService, private angularFire: AngularFire) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.menuCtrl.enable(false);
  }

  clickRegister() {
    this.navCtrl.push({ title: 'Register', component: RegisterPage}.component);
  }

  clickLogin() {
    // this.angularFire.auth.logout();
    // this.foodService.getFoodItems().forEach((item) => console.log(item));
    this.navCtrl.push({title: 'Login', component: LoginPage}.component);
  }
}
