import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../users/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = {
    id: null,
    username: null,
    password: null,
    roles: []
  }

  role: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  register() {
    this.user.roles.push(this.role);
    this.userService.add(this.user).subscribe();
    this.user = {
      id: null,
      username: null,
      password: null,
      roles: []
    }
    this.role = undefined;
  }

}
