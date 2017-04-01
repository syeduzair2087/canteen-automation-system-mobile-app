import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

//////////PAGES//////////
import { FoodPage } from '../pages/food/food';
import { FoodDetailsPage } from '../pages/food-details/food-details';
import { FoodOrderPage } from '../pages/food-order/food-order';
import { BucketPage } from '../pages/bucket/bucket';
import { OrderPage } from '../pages/order/order';
import { OrderDetailsPage } from '../pages/order-details/order-details';
import { ProfilePage } from '../pages/profile/profile';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';


//////////SERVICES//////////
import { AccountService } from '../services/account-service';
import { FoodService } from '../services/food-service';
import { BucketService } from '../services/bucket-service';
import { OrderService } from '../services/order-service';
import { DatePipe } from '@angular/common';

//////////MODULES//////////
import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';

export const firebaseConfig = {
  apiKey: "AIzaSyCL9zQkpCE5Hfv15Lb_O6Ih98KFchCG0Ok",
  authDomain: "canteenautomationsystem.firebaseapp.com",
  databaseURL: "https://canteenautomationsystem.firebaseio.com",
  storageBucket: "canteenautomationsystem.appspot.com",
  messagingSenderId: "490551661425"
};

export const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password,
};

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    FoodPage,
    FoodDetailsPage,
    FoodOrderPage,
    BucketPage,
    OrderPage,
    ProfilePage,
    RegisterPage,
    LoginPage,
    HomePage,
    OrderDetailsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false
    }),
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    FoodPage,
    FoodDetailsPage,
    FoodOrderPage,
    BucketPage,
    OrderPage,
    ProfilePage,
    RegisterPage,
    LoginPage,
    HomePage,
    OrderDetailsPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AccountService,
    FoodService,
    BucketService,
    OrderService,
    DatePipe
    ]
})
export class AppModule { }
