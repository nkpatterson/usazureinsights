import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { AdalService } from 'ng2-adal/core';
import { environment } from '../environments/environment';
declare var appInsights: any;
declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public userName: string;
  public isAuthenticated: boolean;
  private cookieKey: string = "sweouinsights.whatsnew";

  constructor(
    private adalService: AdalService,
    private cookies: CookieService
  ) { }

  ngOnInit(): void {
    this.adalService.init({
        "clientId": "89e85e24-f329-462a-adb7-5417f45b371a",
        "resource": "https://analysis.windows.net/powerbi/api",
        "redirectUri": environment.adalRedirectUri
    });

    this.adalService.handleWindowCallback();
    this.isAuthenticated = this.adalService.userInfo.isAuthenticated;
    if (this.adalService.userInfo.isAuthenticated) {
      this.adalService.getUser()
        .subscribe(user => {
          this.userName = user.userName
          appInsights.setAuthenticatedUserContext(this.userName, this.userName);
        },
          error => console.error(error.message, error));
    }
    else {
      this.adalService.login();
    }

    this.initWhatsNew();
  }

  initWhatsNew() {
    let whatsnew = jQuery("#whatsnew");
    let dismissedVersion = this.cookies.get(this.cookieKey);
    let currentVersion = whatsnew.data("version");

    if (dismissedVersion && dismissedVersion >= currentVersion) {
      whatsnew.alert("close");
    }

    let me = this;
    whatsnew.on("closed.bs.alert", function() {
        let version = whatsnew.data("version");
        let today = new Date();
        let expires = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        me.cookies.put(me.cookieKey, version, {
          expires: expires
        });
      });
  }
}
