import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user = {
    username: null,
    password: null
  }

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  login() {
    this.loginService.login(this.user).subscribe(r=>{

    }, r=> {
      console.log("failed");
    });
  }
}
