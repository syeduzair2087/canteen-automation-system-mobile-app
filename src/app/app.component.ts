import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AccountService } from '../services/account-service'
import { Page1 } from '../pages/page1/page1';
import { HomePage } from '../pages/home/home';
import { FoodPage } from '../pages/food/food';
import { BucketPage } from '../pages/bucket/bucket';
import { OrderPage } from '../pages/order/order';
import { ProfilePage } from '../pages/profile/profile';
import { Push, PushOptions, PushObject } from '@ionic-native/push';
import { LocalNotifications } from '@ionic-native/local-notifications';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, private accountService: AccountService, private push: Push, private alertCtrl: AlertController, private localNotifications: LocalNotifications) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      // { title: 'Page One', component: Page1 },
      // { title: 'Page Two', component: Page2 },
      { title: 'Foods', component: FoodPage },
      { title: 'Bucket', component: BucketPage },
      { title: 'View Orders', component: OrderPage },
      { title: 'Profile', component: ProfilePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      StatusBar.backgroundColorByHexString('#bb0000');
      // this.initPushNotification();
      if (this.accountService.checkUserIsLoggedIn()) {
        this.initPushNotification();
        this.rootPage = FoodPage;
      }
      else
        this.rootPage = HomePage;
    });

    // this.localNotifications.schedule({
    //   text: 'new local notifications',
    //   sound: 'file://sound.mp3',
    //   at: new Date(new Date().getTime() + 6300),
    //   led: 'FF0000',

    // })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  clickLogout() {
    this.accountService.logoutUser().then(() => {
      this.nav.setRoot({ title: 'Canteen Automation System', component: HomePage }.component);
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


    // pushObject.on('registration').subscribe((data: any) => {
    //   console.log(data.registrationId);

    // })

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
          led:  'fff000'
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
