import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './users/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = "http://localhost:8080/api/users";

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<User[]>(this.userUrl);
  }

  getOne(id: String) {
    return this.http.get<User>(this.userUrl + `/${id}`);
  }

  delete(id: String) {
    return this.http.delete(this.userUrl + `/${id}`);
  }

  add(user: User) {
    return this.http.post(this.userUrl, user);
  }

  update(id: string, user: User) {
    return this.http.put(this.userUrl + `/${id}`, user);
  }


}
