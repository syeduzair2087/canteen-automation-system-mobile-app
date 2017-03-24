import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { FoodItem } from '../models/food.model'

@Injectable()
export class FoodService {
    constructor(private angularFire: AngularFire) { }

    getFoodItems() {
        return this.angularFire.database.list('/food');
    }

    addFoodItem(foodItem: FoodItem) {
        return new Promise((res, rej) => {
            this.angularFire.database.list('/food').push(foodItem).then((success) => {
                res(success);
            }).catch((error) => {
                rej(error);
            })
        })
    }

    editFoodItem(key: string, foodItem: FoodItem) {
        return new Promise((res, rej) => {
            this.angularFire.database.object('/food/' + key + '/').update(foodItem).then((success) => {
                res();
            }).catch((error) => {
                rej(error);
            })
        })
    }

    deleteFoodItem(key: string) {
        return new Promise((res, rej) => {
            this.angularFire.database.list('/food/' + key).remove().then((succss) => {
                res();
            }).catch((error) => {
                rej(error);
            })
        })
    }
}