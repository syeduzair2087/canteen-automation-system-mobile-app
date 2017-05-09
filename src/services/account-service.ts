import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseAuthState, FirebaseApp } from 'angularfire2';
import { AlertController, LoadingController, ToastController } from 'ionic-angular'
import * as firebase from 'firebase';
import { User } from '../models/user.model';

@Injectable()
export class AccountService {
    firebaseApp: firebase.app.App;

    constructor(private angularFire: AngularFire, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, @Inject(FirebaseApp) firebaseApp: firebase.app.App) {
        this.firebaseApp = firebaseApp;
    }

    registerUser(displayName: string, email: string, phoneNumber: number, cabinNumber: number, password: string) {
        let loading = this.loadingCtrl.create({
            content: 'Registering user...'
        });
        loading.present();
        return new Promise((res, rej) => {
            this.angularFire.auth.createUser({ email: email, password: password }).then((user: FirebaseAuthState) => {
                user.auth.updateProfile({
                    displayName: displayName,
                    photoURL: 'https://firebasestorage.googleapis.com/v0/b/canteenautomationsystem.appspot.com/o/assets%2Fno-image.jpg?alt=media&token=ee3b6fc2-8906-4dac-abea-43f728190f22'
                }).then(() => {
                    this.angularFire.database.object('roles/clients/' + user.uid).set({
                        name: displayName,
                        email: email,
                        contact: phoneNumber,
                        cabin: cabinNumber
                    });
                    loading.dismiss().then(() => {
                        this.toastCtrl.create({
                            message: 'Registered successfully!',
                            duration: 4500
                        }).present();
                        res();
                    });
                })
            }).catch((error) => {
                loading.dismiss().then(() => {
                    this.toastCtrl.create({
                        message: 'Failed to register!',
                        duration: 4500
                    }).present();
                    rej(error);
                });
            })
        })
    }

    loginUser(email: string, password: string) {
        let loading = this.loadingCtrl.create({
            content: 'Authenticating...'
        });
        loading.present();
        return new Promise((res, rej) => {

            let clientSubscription = this.angularFire.database.list('/roles/clients/', {
                query: {
                    orderByChild: 'email',
                    equalTo: email
                }
            }).subscribe((client) => {
                if (client.length == 1) {
                    this.angularFire.auth.login({ email: email, password: password }).then((user: FirebaseAuthState) => {
                        localStorage.setItem('uid', user.uid);
                        this.toastCtrl.create({
                            message: 'Login successful!',
                            duration: 4500
                        }).present();
                        loading.dismiss();
                        res(user);
                        clientSubscription.unsubscribe();
                    }).catch((error) => {
                        this.toastCtrl.create({
                            message: 'Failed to login. Please try again.',
                            duration: 4500
                        }).present();
                        loading.dismiss();
                        rej(error);
                        clientSubscription.unsubscribe();
                    })
                }
                else {
                    this.toastCtrl.create({
                        message: 'Failed to login. Check your credentials and try again.',
                        duration: 4500
                    }).present();
                    loading.dismiss();
                    rej('User not found. Please check your credentials and try again');
                    clientSubscription.unsubscribe();
                }
            });
        })
    }

    logoutUser() {
        let loading = this.loadingCtrl.create({
            content: 'Logging out...'
        });
        loading.present();
        return new Promise((res, rej) => {
            this.angularFire.auth.logout().then(() => {
                localStorage.removeItem('uid');
                this.toastCtrl.create({
                    message: 'Logged out successfully!',
                    duration: 4500
                }).present();
                loading.dismiss();
                res();
            }).catch((error) => {
                this.toastCtrl.create({
                    message: 'Failed to log out. Please try again later.',
                    duration: 4500
                }).present();
                loading.dismiss();
                rej(error);
            })
        })
    }

    updatePassword(newPassword: string) {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Updating password...'
            });
            loading.present();
            this.angularFire.auth.subscribe((user: FirebaseAuthState) => {
                if (user) {
                    user.auth.updatePassword(newPassword).then((success) => {
                        this.toastCtrl.create({
                            message: 'Password updated successfully!',
                            duration: 3000
                        }).present();
                        loading.dismiss();
                        res();
                    }).catch((err: any) => {
                        this.toastCtrl.create({
                            message: 'Password update failed!',
                            duration: 3000
                        }).present();
                        if (err.code === 'auth/requires-recent-login') {
                            this.alertCtrl.create({
                                subTitle: err.message,
                                buttons: [
                                    {
                                        text: 'OK',
                                        role: 'cancel'
                                    }
                                ]
                            }).present();
                        }
                        loading.dismiss();
                        rej();
                    });
                }
            }).unsubscribe();
        })
    }

    updateEmail(emailValue: string) {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Updating information...'
            });
            loading.present();
            this.angularFire.auth.subscribe((user: FirebaseAuthState) => {
                user.auth.updateEmail(emailValue).then((success) => {
                    // this.loginServices.updateLoginState();
                    this.angularFire.database.object('/roles/clients/' + localStorage.getItem('uid')).update({
                        email: emailValue
                    }).then(() => {
                        this.toastCtrl.create({
                            message: 'Information updated successfully!',
                            duration: 3000
                        }).present();
                        loading.dismiss();
                        res();
                    })
                }).catch((err: any) => {
                    this.toastCtrl.create({
                        message: 'Information update failed!',
                        duration: 3000
                    }).present();
                    if (err.code === 'auth/requires-recent-login') {
                        this.alertCtrl.create({
                            subTitle: err.message,
                            buttons: [
                                {
                                    text: 'OK',
                                    role: 'cancel'
                                }
                            ]
                        }).present();
                    }
                    loading.dismiss();
                    console.log(err);
                    rej();
                })
            })
        })
    }

    updateContact(phoneNumber: number) {
        let loading = this.loadingCtrl.create({
            content: 'Updating phone number...'
        });
        loading.present();
        return new Promise((res, rej) => {
            this.angularFire.database.object('/roles/clients/' + localStorage.getItem('uid')).update({
                contact: phoneNumber
            }).then(() => {
                this.toastCtrl.create({
                    message: 'Phone number updated.',
                    duration: 4500
                }).present();
                loading.dismiss();
                res();
            }).catch(() => {
                this.toastCtrl.create({
                    message: 'Failed to update phone number.',
                    duration: 4500
                }).present();
                loading.dismiss();
                rej();
            })
        })
    }

    updateCabin(cabinNumber: number) {
        let loading = this.loadingCtrl.create({
            content: 'Updating cabin number...'
        });
        loading.present();
        return new Promise((res, rej) => {
            this.angularFire.database.object('/roles/clients/' + localStorage.getItem('uid')).update({
                cabin: cabinNumber
            }).then(() => {
                this.toastCtrl.create({
                    message: 'Cabin number updated.',
                    duration: 4500
                }).present();
                loading.dismiss();
                res();
            }).catch(() => {
                this.toastCtrl.create({
                    message: 'Failed to update cabin number.',
                    duration: 4500
                }).present();
                loading.dismiss();
                rej();
            })
        })
    }

    updateInfo(displayNameValue, imageUrl) {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Updating information...'
            });
            loading.present();
            this.angularFire.auth.subscribe((user: FirebaseAuthState) => {
                if (user) {
                    user.auth.updateProfile({
                        displayName: displayNameValue,
                        photoURL: imageUrl,
                    }).then(() => {
                        this.angularFire.database.object('/roles/clients/' + localStorage.getItem('uid')).update({
                            name: displayNameValue
                        }).then(() => {
                            this.toastCtrl.create({
                                message: 'Information updated successfully!',
                                duration: 3000
                            }).present();
                            loading.dismiss();
                            res();
                        })
                    }).catch((err) => {
                        this.toastCtrl.create({
                            message: 'Information update failed!',
                            duration: 3000
                        }).present();
                        console.log(err);
                        rej();
                    });
                }
            })
        })
    }

    getUserData() {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Loading information...'
            });
            loading.present();
            let currentAuth = this.angularFire.auth;
            currentAuth.subscribe((data: FirebaseAuthState) => {
                if (data) {
                    this.angularFire.database.object('/roles/clients/' + localStorage.getItem('uid')).subscribe((clientData: any) => {
                        let userData: User = {
                            email: data.auth.email,
                            name: data.auth.displayName,
                            imageURL: data.auth.photoURL,
                            contact: clientData.contact,
                            cabin: clientData.cabin
                        }
                        console.log(userData);
                        loading.dismiss();
                        res(userData);
                    })
                }
                else {
                    loading.dismiss();
                    rej();
                }
            });
        })
    }

    checkUserIsLoggedIn() {
        if (localStorage.getItem('uid')) {
            return true;
        }

        else return false;
    }

    uploadImage(data) {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Uploading Image...'
            });
            loading.present();
            let uploadTask = this.firebaseApp.storage().ref('/profile_images/' + localStorage.getItem('uid')).putString(data, 'base64', { contentType: 'image/jpg' });
            uploadTask.on('state_changed', snapshot => {
            }, function (error) {
                loading.dismiss();
                rej(error);
            }, function () {
                var downloadURL = uploadTask.snapshot.downloadURL;
                loading.dismiss();
                res(downloadURL);
            });
        });
    }

    removeAccount() {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Deleting account...'
            });
            loading.present();
            this.angularFire.auth.subscribe((user: FirebaseAuthState) => {
                if (user) {
                    var userId = localStorage.getItem('uid');
                    this.deleteImage(userId, user.auth.photoURL).then(() => {
                        this.angularFire.database.list('roles/clients/' + userId).remove().then(() => {
                            localStorage.removeItem('uid');
                            user.auth.delete().then((success) => {
                                this.toastCtrl.create({
                                    message: 'Account successfully deleted!',
                                    duration: 3000
                                }).present();
                                loading.dismiss();
                                res();
                            }).catch((error) => {
                                this.toastCtrl.create({
                                    message: 'Failed to delete account. Please try again later.',
                                    duration: 3000
                                }).present();
                                loading.dismiss();
                                rej();
                            });
                        })
                    })
                }
            }).unsubscribe();
        })
    }

    // deleteImage(userId: string, imageURL: string) {
    //     return new Promise((res, rej) => {
    //         if (imageURL != 'https://firebasestorage.googleapis.com/v0/b/canteenautomationsystem.appspot.com/o/assets%2Fno-image.jpg?alt=media&token=ee3b6fc2-8906-4dac-abea-43f728190f22') {
    //             let image = this.firebaseApp.storage().ref('/profile_images/' + userId);
    //             image.getDownloadURL().then(() => {
    //                 image.delete().then(() => res())
    //             }).catch((err) => rej());
    //         }

    //         else res();
    //     })
    // }

    deleteImage(userId: string, imageURL: string) {
        return new Promise((res, rej) => {
            if (imageURL != 'https://firebasestorage.googleapis.com/v0/b/canteenautomationsystem.appspot.com/o/assets%2Fno-image.jpg?alt=media&token=ee3b6fc2-8906-4dac-abea-43f728190f22') {
                firebase.app().storage().ref('/profile_images/' + userId).delete().then(() => {
                    res();
                }).catch(() => {
                    rej();
                })
            }

            else res();
        })
    }

    getCabinNumber() {
        return new Promise((res, rej) => {
            let clientSubcription = this.angularFire.database.object('/roles/clients/' + localStorage.getItem('uid')).subscribe((clientData: any) => {
                clientSubcription.unsubscribe();
                res(clientData.cabin);
            })
        })
    }

    addNotificationToken(token: string) {
        return new Promise((res, rej) => {
                this.angularFire.database.list('notificationTokens/' + localStorage.getItem('uid')).push(token).then(() => {
                    console.log('Token added sucessfully!');
                    res('')
                })
            })
    }

}


