import { Component, OnInit } from '@angular/core';
import { Appwrite } from 'appwrite-realtime-preview';
import { environment } from 'src/environments/environment';

type ProfileDocument = {
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
export class AppComponent implements OnInit {
  cookieAnimationClasses: string[] = [];
  userId: string | undefined;

  isAnonymous = true;
  averageClicks = '[COMING SOON]';

  profileDocument: ProfileDocument | undefined;
  topProfilesArray: ProfileDocument[] = [];

  // Key: userId
  // Value: unsibscribe method
  externalProfilesSubscriptons: { [key: string]: any } = {};

  isIncrementingOnServer = false;

  sdk = new Appwrite();

  constructor() {
    this.sdk
      .setEndpoint(environment.appwriteEndpoint)
      .setProject(environment.appwriteProjectId);
  }

  async ngOnInit() {
    let account: any;

    try {
      account = await this.sdk.account.get();
      if (!account) {
        throw Error('Not logged in');
      }

      this.userId = account.$id;
    } catch (err) {
      account = await this.sdk.account.createAnonymousSession();
      this.userId = account.$id;
    }

    if (!account.email) {
      this.isAnonymous = true;
    } else {
      this.isAnonymous = false;
    }

    console.log(account);

    await this.getSelfProfile();
    await this.subscribeToSelfProfile();

    await this.syncTopList();
  }

  async subscribeToSelfProfile() {
    if (!this.profileDocument) {
      return;
    }

    this.sdk.subscribe(`documents.${this.profileDocument.$id}`, (event) => {
      if (!this.profileDocument) {
        return;
      }

      const payload = <ProfileDocument>event.payload;

      this.profileDocument.clicks = payload.clicks;
      this.profileDocument.username = payload.username;
    });
  }

  async getSelfProfile() {
    const userProfileQuery: any = await this.sdk.database.listDocuments(
      environment.appwriteCollections.profileId,
      [`userId=${this.userId}`],
      1
    );

    if (userProfileQuery.documents.length <= 0) {
      const userProfile: any = await this.sdk.database.createDocument(
        environment.appwriteCollections.profileId,
        {
          userId: this.userId,
          clicks: 0,
          username: 'Anonymous user',
        },
        ['*'],
        [`user:${this.userId}`]
      );

      this.profileDocument = userProfile;
      return;
    }

    this.profileDocument = userProfileQuery.documents[0];
  }

  async syncTopList() {
    const topProfilesQuery: any = await this.sdk.database.listDocuments(
      environment.appwriteCollections.profileId,
      [],
      10,
      0,
      'clicks',
      'DESC',
      'int'
    );

    const topProfilesArray: ProfileDocument[] = topProfilesQuery.documents;
    const topProfileIdsArray = topProfilesArray.map((profile) => {
      return profile.$id;
    });

    for (const topProfile of topProfilesArray) {
      if (!this.externalProfilesSubscriptons[topProfile.$id]) {
        this.externalProfilesSubscriptons[topProfile.$id] = this.sdk.subscribe(
          `documents.${topProfile.$id}`,
          (event) => {
            const payload = <ProfileDocument>event.payload;

            this.topProfilesArray = this.topProfilesArray.map((profile) => {
              if (profile.$id === payload.$id) {
                profile.clicks = payload.clicks;
                profile.username = payload.username;
              }

              return profile;
            });
          }
        );
      }
    }

    while (topProfilesArray.length < 10) {
      topProfilesArray.push({
        $id: '',
        $collection: '',
        $permissions: {
          read: [],
          write: [],
        },

        userId: '',
        clicks: 0,
        username: 'Noone yet',
      });
    }

    this.topProfilesArray = topProfilesArray;

    Object.keys(this.externalProfilesSubscriptons).forEach((profileId) => {
      const topProfile = this.topProfilesArray.find(
        (profile) => profile.$id === profileId
      );

      if (!topProfile) {
        // Unsubscribe
        this.externalProfilesSubscriptons[profileId]();
      }
    });

    setTimeout(() => {
      this.syncTopList();
    }, 500);
  }

  mouseDown(e: Event) {
    e.preventDefault();

    this.cookieAnimationClasses = ['!scale-90', '!rotate-12'];
  }

  mouseUp(e: Event) {
    e.preventDefault();

    this.cookieAnimationClasses = ['!scale-115', '!rotate-6'];
  }

  async onCookieClick(e: Event) {
    e.preventDefault();

    this.displayAnimation();

    if (!this.profileDocument) {
      return;
    }

    if (!this.isIncrementingOnServer) {
      this.isIncrementingOnServer = true;

      await this.sdk.database.updateDocument(
        environment.appwriteCollections.profileId,
        this.profileDocument.$id,
        {
          ...this.profileDocument,
          $id: undefined,
          $collection: undefined,
          $permissions: undefined,

          clicks: this.profileDocument.clicks + 1,
        },
        this.profileDocument.$permissions.read,
        this.profileDocument.$permissions.write
      );

      this.isIncrementingOnServer = false;
    }
  }

  displayAnimation() {
    const animationsEl = document.querySelector('#cookies-animation-el');
    if (!animationsEl) {
      return;
    }

    const cookieEl = document.createElement('img');
    cookieEl.src = '/assets/cookie.png';
    cookieEl.classList.add('absolute', 'animate-fadeup', 'w-8', 'h-8', 'z-20');

    // Random from 20 to 80
    const randomLeft = Math.round(Math.random() * 60 + 20);
    const randomTop = Math.round(Math.random() * 60 + 20);

    cookieEl.style.left = randomLeft + '%';
    cookieEl.style.top = randomTop + '%';

    animationsEl.append(cookieEl);

    setTimeout(() => {
      cookieEl.remove();
    }, 1000);
  }

  getTop7Array(array: ProfileDocument[]) {
    return array.filter((profile, index) => {
      return index > 2 ? true : false;
    });
  }

  onLogin(e: Event) {
    e.preventDefault();

    alert('Magic URL support coming soon');
  }

  async onChangeUsername(e: Event) {
    e.preventDefault();

    if (!this.profileDocument) {
      return;
    }

    const newUsername = prompt(
      'Please enter new username',
      this.profileDocument.username
    );

    await this.sdk.database.updateDocument(
      environment.appwriteCollections.profileId,
      this.profileDocument.$id,
      {
        ...this.profileDocument,
        $id: undefined,
        $collection: undefined,
        $permissions: undefined,

        username: newUsername,
      },
      this.profileDocument.$permissions.read,
      this.profileDocument.$permissions.write
    );
  }
}
