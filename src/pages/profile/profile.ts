import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, App } from 'ionic-angular';
import { Camera } from 'ionic-native'
import { AccountService } from '../../services/account-service'
import { HomePage } from '../../pages/home/home'

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  userName: string;
  userEmail: string;
  userImage: string;
  authObject: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private actionCtrl: ActionSheetController, private alertCtrl: AlertController, private accountService: AccountService, private appCtrl: App) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.accountService.getUserData().then((data: any) => {
      this.userName = data.name;
      this.userEmail = data.email;
      this.userImage = data.photoUrl;
    })
  }

  clickImage() {
    this.actionCtrl.create({
      title: 'Select source',
      buttons: [
        {
          text: 'Gallery',
          icon: 'image',
          handler: () => {
            Camera.getPicture({
              targetWidth: 300,
              targetHeight: 300,
              quality: 100,
              allowEdit: true,
              correctOrientation: false,
              // saveToPhotoAlbum: true,
              encodingType: Camera.EncodingType.JPEG,
              mediaType: Camera.MediaType.PICTURE,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            }).then((selectedImage) => {
              this.accountService.uploadImage(selectedImage).then((downloadUrl: string) => {
                this.accountService.updateInfo(this.userName, downloadUrl).then(() => {
                  this.userImage = downloadUrl;
                  this.alertCtrl.create({
                    subTitle: 'Your image has been successfully updated.',
                    buttons: [
                      {
                        text: 'OK',
                        role: 'cancel'
                      }
                    ]
                  }).present();
                }).catch(() => { })
              }).catch(() => {
                this.alertCtrl.create({
                  subTitle: 'Failed to upload image. Please try again.',
                  buttons: [
                    {
                      text: 'OK',
                      role: 'cancel'
                    }
                  ]
                }).present()
              })
            }).catch((error) => {
              this.alertCtrl.create({
                message: error,
                buttons: [
                  {
                    text: 'OK',
                    role: 'cancel'
                  }
                ]
              }).present();
            })
          }
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            Camera.getPicture({
              targetWidth: 300,
              targetHeight: 300,
              quality: 100,
              allowEdit: true,
              correctOrientation: false,
              // saveToPhotoAlbum: true,
              encodingType: Camera.EncodingType.JPEG,
              mediaType: Camera.MediaType.PICTURE,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA
            }).then((selectedImage) => {
              this.accountService.uploadImage(selectedImage).then((downloadUrl: string) => {
                this.accountService.updateInfo(this.userName, downloadUrl).then(() => {
                  this.userImage = downloadUrl;
                  this.alertCtrl.create({
                    subTitle: 'Your image has been successfully updated.',
                    buttons: [
                      {
                        text: 'OK',
                        role: 'cancel'
                      }
                    ]
                  }).present();
                }).catch(() => { })
              }).catch(() => {
                this.alertCtrl.create({
                  subTitle: 'Failed to upload image. Please try again.',
                  buttons: [
                    {
                      text: 'OK',
                      role: 'cancel'
                    }
                  ]
                }).present()
              })
            }).catch((error) => {
              this.alertCtrl.create({
                message: error,
                buttons: [
                  {
                    text: 'OK',
                    role: 'cancel'
                  }
                ]
              }).present();
            })
          }
        },
        {
          text: 'Cancel',
          icon: 'close'
        }
      ]
    }).present();
  }

  clickName() {
    this.alertCtrl.create({
      subTitle: 'Enter new name',
      inputs: [
        {
          name: 'txtNewName',
          value: this.userName
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            this.accountService.updateInfo(data.txtNewName, this.userImage).then(() => this.userName = data.txtNewName);
          }
        }
      ]
    }).present();
  }

  clickEmail() {
    this.alertCtrl.create({
      subTitle: 'Enter new email',
      inputs: [
        {
          name: 'txtNewEmail',
          type: 'email',
          value: this.userEmail
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            this.accountService.updateEmail(data.txtNewEmail).then(() => this.userEmail = data.txtNewEmail).catch(() => { });
          }
        }
      ]
    }).present();
  }

  clickPassword() {
    this.alertCtrl.create({
      subTitle: 'Enter new password',
      inputs: [
        {
          name: 'txtNewPassword',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            this.accountService.updatePassword(data.txtNewPassword).catch(() => { });
          }
        }
      ]
    }).present();
  }

  clickDelete() {
    this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to delete your account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.accountService.removeAccount().then(() => {
            this.appCtrl.getActiveNav().setRoot({ title: 'Canteen Automation System', component: HomePage }.component);
            }).catch(() => {})
          }
        }
      ]
    }).present();
  }
}
