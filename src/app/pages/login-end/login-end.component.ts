import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppwriteService } from 'src/app/appwrite.service';

@Component({
  selector: 'app-login-end',
  templateUrl: './login-end.component.html',
  styleUrls: ['./login-end.component.scss'],
})
export class LoginEndComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private aw: AppwriteService
  ) {}

  async ngOnInit() {
    try {
      const { userId, secret } = this.route.snapshot.queryParams;

      await this.aw.sdk.account.updateMagicURLSession(userId, secret);

      this.router.navigateByUrl('/');
    } catch (err) {
      alert('URL is invalid');
    }
  }
}
