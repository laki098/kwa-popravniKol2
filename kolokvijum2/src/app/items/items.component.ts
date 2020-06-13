import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ItemService } from './item.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  items = [];

  sale = [];

  saleInput: number;

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.itemService.getAll().subscribe(items => {
      this.items = items;
      console.log(this.items);
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  saleItems() {
    this.sale.forEach(item => {
      console.log(item.price)
      console.log(this.saleInput)
      item.price -= item.price * (this.saleInput / 100);
      console.log(item.price)
      this.itemService.update(item.id, item).subscribe(_ => {
        this.itemService.getAll().subscribe(items => {
          console.log(items);
        });
      });
    })

  }

}
