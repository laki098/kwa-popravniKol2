import { Injectable } from '@angular/core';
import { Item } from './item.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private itemUrl = "http://localhost:8080/api/items";

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<Item[]>(this.itemUrl);
  }

  getOne(id: String) {
    return this.http.get<Item>(this.itemUrl + `/${id}`);
  }

  delete(id: String) {
    return this.http.delete(this.itemUrl + `/${id}`);
  }

  add(item: Item) {
    return this.http.post(this.itemUrl, item);
  }

  update(id: string, item: Item) {
    return this.http.put(this.itemUrl + `/${id}`, item);
  }

}
