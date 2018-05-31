import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';
import { tokenKey } from '@angular/core/src/view';
import { AuthService} from './profile/auth.service';
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
    private authService: AuthService,
    private cookies: CookieService
  ) {
    this.authService.init();    
  }

  ngOnInit(): void {
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

        appInsights.trackEvent("WhatsNewDismissed", {Version: version});
      });
  }
}
