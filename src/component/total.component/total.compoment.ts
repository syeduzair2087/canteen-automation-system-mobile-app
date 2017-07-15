import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BucketService } from '../../services/bucket-service';

@Component({
    selector: 'total-component',
    template: `
   <ion-footer  class="bar-assertive" style="-moz-box-shadow: 0 0 5px 5px #888;
-webkit-box-shadow: 0 0 5px 5px#888;
box-shadow: 0 0 50px 5px rgba(136, 136, 136, 0.5)" >
    <h2 class="title" style="padding-left: 10px;"> Total : Rs. <label class="text-right"> {{ totalAmount }}</label>/-</h2> 
    <button ion-button full color="secondary" style="height:55px; font-size: 25px; margin-bottom: -2px" (click)="checkOut()">  Check out </button>
  </ion-footer>
    `
})
export class TotalComponent {
    @Input() totalAmount = 0;

    @Output() checkOutEmit = new EventEmitter();
    constructor(private bucketService: BucketService) { }

    checkOut() {
        this.checkOutEmit.emit('');
    }
}