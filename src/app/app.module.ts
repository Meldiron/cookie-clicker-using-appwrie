import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginStartComponent } from './pages/login-start/login-start.component';
import { LoginEndComponent } from './pages/login-end/login-end.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginStartComponent,
    LoginEndComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
