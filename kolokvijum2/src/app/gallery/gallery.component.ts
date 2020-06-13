import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';

import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  images:any = [];
  korpa:any = [];
  // numericData = [];

  constructor(private http: HttpClient, public loginService: LoginService) { }

  ngOnInit(): void {
    this.http.get("http://localhost:8080/api/gallery").subscribe(r=>{
      this.images = r;
    });
  }

  delete(id) {
    this.http.delete(`http://localhost:8080/api/gallery/${id}`).subscribe(r=> {
      this.http.get("http://localhost:8080/api/gallery").subscribe(r=>{
        this.images = r;
      });
    });
  }

  getScores() {
    let numericData = [
      {y:0},
      {y:0},
      {y:0},
      {y:0},
      {y:0},
      {y:0},
      {y:0},
      {y:0},
      {y:0},
      {y:0},
    ];
    for(let i = 0; i < this.images.length; i++) {
      numericData[this.images[i]["ocena"]-1]["y"] += 1;
    }
    return numericData;
  }

  drop(event) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
}
