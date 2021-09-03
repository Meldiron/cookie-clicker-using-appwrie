import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileDocument } from 'src/app/app.component';
import { AppwriteService } from 'src/app/appwrite.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  cookieAnimationClasses: string[] = [];
  userId: string | undefined;

  isAnonymous = true;
  averageClicks: number | undefined;

  profileDocument: ProfileDocument | undefined;
  topProfilesArray: ProfileDocument[] = [];

  // Key: userId
  // Value: unsibscribe method
  externalProfilesSubscriptons: { [key: string]: any } = {};

  isIncrementingOnServer = false;

  constructor(private aw: AppwriteService, private router: Router) {}

  async ngOnInit() {
    let account: any;

    try {
      account = await this.aw.sdk.account.get();
      if (!account) {
        throw Error('Not logged in');
      }

      this.userId = account.$id;
    } catch (err) {
      account = await this.aw.sdk.account.createAnonymousSession();
      this.userId = account.userId;
    }

    if (!account.email) {
      this.isAnonymous = true;
    } else {
      this.isAnonymous = false;
    }

    console.log(account);

    await this.getSelfProfile();
    await this.subscribeToSelfProfile();
    await this.subscribeToAverages();

    await this.syncTopList();
  }

  async subscribeToAverages() {
    const averagesQuery: any = await this.aw.sdk.database.listDocuments(
      environment.appwriteCollections.averagesId,
      [],
      1,
      0,
      'timeAt',
      'DESC'
    );
    if (averagesQuery.documents.length > 0) {
      this.averageClicks = averagesQuery.documents[0].averageClicks;
    }

    console.log('SUB1');
    this.aw.sdk.subscribe(
      `collections.${environment.appwriteCollections.averagesId}.documents`,
      (event: any) => {
        if (event.event === 'database.documents.create') {
          this.averageClicks = event.payload.averageClicks;
        }
      }
    );
  }

  async subscribeToSelfProfile() {
    if (!this.profileDocument) {
      return;
    }

    console.log('SUB2');
    this.aw.sdk.subscribe(
      `documents.${this.profileDocument.$id}`,
      (event: any) => {
        if (!this.profileDocument) {
          return;
        }

        const payload = <ProfileDocument>event.payload;

        this.profileDocument.clicks = payload.clicks;
        this.profileDocument.username = payload.username;
      }
    );
  }

  async getSelfProfile() {
    console.log('Getting self profile');
    const userProfileQuery: any = await this.aw.sdk.database.listDocuments(
      environment.appwriteCollections.profileId,
      [`userId=${this.userId}`],
      1
    );
    console.log(userProfileQuery);

    if (userProfileQuery.documents.length <= 0) {
      console.log('Creating profile');
      const userProfile: any = await this.aw.sdk.database.createDocument(
        environment.appwriteCollections.profileId,
        {
          userId: this.userId,
          clicks: 0,
          username: 'Anonymous user',
        },
        ['*'],
        [`user:${this.userId}`]
      );

      console.log(userProfile);
      this.profileDocument = userProfile;
      return;
    }

    this.profileDocument = userProfileQuery.documents[0];
  }

  async syncTopList() {
    const topProfilesQuery: any = await this.aw.sdk.database.listDocuments(
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
        console.log('SUB3');
        this.externalProfilesSubscriptons[topProfile.$id] =
          this.aw.sdk.subscribe(`documents.${topProfile.$id}`, (event) => {
            const payload = <ProfileDocument>event.payload;

            this.topProfilesArray = this.topProfilesArray.map((profile) => {
              if (profile.$id === payload.$id) {
                profile.clicks = payload.clicks;
                profile.username = payload.username;
              }

              return profile;
            });
          });
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
        console.log('UNSUBBING');
        this.externalProfilesSubscriptons[profileId]();
      }
    });

    setTimeout(() => {
      this.syncTopList();
    }, 1000);
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

      await this.aw.sdk.database.updateDocument(
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

  async onLogin(e: Event) {
    e.preventDefault();

    const email: string | null = prompt('Please enter your email');

    if (!email) {
      return;
    }

    try {
      await this.aw.sdk.account.createMagicURLSession(
        email,
        'http://localhost:4200/login-end'
      );

      this.router.navigateByUrl('/login-start');
    } catch (err) {
      alert('Could not login. Please try again later');
    }
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

    await this.aw.sdk.database.updateDocument(
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

  async onLogout(e: Event) {
    e.preventDefault();

    await this.aw.sdk.account.deleteSession('current');
    this.isAnonymous = true;
    this.userId = undefined;
    this.profileDocument = undefined;
    this.ngOnInit();
  }
}
