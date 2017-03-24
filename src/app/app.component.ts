import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AccountService } from '../services/account-service'
import { Page1 } from '../pages/page1/page1';
import { HomePage } from '../pages/home/home';
import { FoodPage } from '../pages/food/food';
import { BucketPage } from '../pages/bucket/bucket';
import { OrderPage } from '../pages/order/order';
import { ProfilePage } from '../pages/profile/profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, private accountService: AccountService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      // { title: 'Page One', component: Page1 },
      // { title: 'Page Two', component: Page2 },
      { title: 'Foods', component: FoodPage },
      { title: 'Bucket', component: BucketPage },
      { title: 'View Order', component: OrderPage },
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
      if (this.accountService.checkUserIsLoggedIn()) {
        this.rootPage = FoodPage;
      }

      else
        this.rootPage = HomePage;
    });
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
}
