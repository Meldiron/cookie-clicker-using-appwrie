import { Component, OnInit } from '@angular/core';
import { Appwrite } from 'appwrite';
import { environment } from 'src/environments/environment';
import { AppwriteService } from './appwrite.service';

export type ProfileDocument = {
  $id: string;
  $collection: string;
  $permissions: {
    read: string[];
    write: string[];
  };
  userId: string;
  username: string;
  clicks: number;
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private _appwrite: AppwriteService) {}
}
