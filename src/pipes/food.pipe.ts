import { Pipe } from '@angular/core';
import { FoodItem } from './../models/food.model';
@Pipe({
    name: 'filterFoodByName',
    pure: false
})
export class FilterFoodByNamePipe {
    transform(inputArray: Array<FoodItem>, filterString: string) {
        if (inputArray == null) {
            return null;
        }
        if (filterString == '' || filterString == null) {
            return inputArray;
        }
        return inputArray.filter((foodItem: FoodItem) => foodItem.food_title.toLocaleLowerCase().includes(filterString.toLocaleLowerCase()));
    }
}