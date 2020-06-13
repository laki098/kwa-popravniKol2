import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users:any = [];
  constructor(private http: HttpClient, public loginService: LoginService) { }

  ngOnInit(): void {
    this.http.get("http://localhost:8080/api/users").subscribe(r => {
      this.users = r;
    })
  }

}
