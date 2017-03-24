import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AccountService } from '../../services/account-service'

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private accountService: AccountService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  clickRegister(displayName: string, email: string, password: string) {
    this.accountService.registerUser(displayName, email, password);
  }
}
