import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, Platform, AlertController } from 'ionic-angular';
import { AccountService } from '../../services/account-service'
import { FoodPage } from '../food/food'
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { LocalNotifications } from '@ionic-native/local-notifications';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private accountService: AccountService, private menuCtrl: MenuController, private alertCtrl: AlertController, private localNotifications: LocalNotifications, private platform: Platform, private push: Push) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  clickLogin(email: string, password: string) {
    this.accountService.loginUser(email, password).then((user) => {
      this.initPushNotification();
      this.navCtrl.setRoot({ title: 'Food', component: FoodPage }.component);
      this.menuCtrl.enable(true);
    }).catch((error) => console.log(error));
  }

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.log('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }

    const option: PushOptions = {
      android: {
        senderID: '490551661425',
      },
      ios: {
        alert: 'true',
        badge: 'false',
        sound: 'true'
      },
      windows: {}
    }

    const pushObject: PushObject = this.push.init(option);


    pushObject.on('registration').subscribe((data: any) => {
      console.log(data.registrationId);
      this.accountService.addNotificationToken(data.registrationId).then(() => { })
    })

    pushObject.on('notification').subscribe((data: any) => {
      if (data.additionalData.foreground) {
        this.alertCtrl.create({
          title: 'Canteen Automation',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          },
          {
            text: 'OK',
            handler: () => {

            }
          }]
        }).present();
      } else {
        this.localNotifications.schedule({
          id: 1,
          text: 'Single ILocalNotification',
          led: 'fff000'
        });
      }
      // setTimeout(function () {
      //   console.log("data.message");
      //   console.log(data.message);

      //   alert(data.message)
      // }, 1000);
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

  }
}
