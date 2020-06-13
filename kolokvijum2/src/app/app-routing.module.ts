import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { AuthGuard } from './auth.guard';
import { GalleryComponent } from './gallery/gallery.component';
import { RegisterComponent } from './register/register.component';
import { ItemsComponent } from './items/items.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';


const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "users",
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ["ROLE_ADMIN", "ROLE_USER"]
    }
  },
  {
    path: "gallery",
    component:GalleryComponent
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ["ROLE_ADMIN"]
    }
  },
  {
    path: "items",
    component: ItemsComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ["ROLE_USER"]
    }
  },
  {
    path: "pie",
    component: PieChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
