import { Injectable } from '@angular/core';
import { Appwrite } from 'appwrite';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppwriteService {
  public sdk = new Appwrite();

  constructor() {
    this.sdk
      .setEndpoint(environment.appwriteEndpoint)
      .setProject(environment.appwriteProjectId);
  }
}
