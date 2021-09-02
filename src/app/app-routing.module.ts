import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginEndComponent } from './pages/login-end/login-end.component';
import { LoginStartComponent } from './pages/login-start/login-start.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login-start',
    component: LoginStartComponent,
  },
  {
    path: 'login-end',
    component: LoginEndComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
