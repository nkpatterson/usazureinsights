import { Component, OnInit } from '@angular/core';
import { AdalService } from 'ng2-adal/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public userName: string;
  public isAuthenticated: boolean;

  constructor(
    private adalService: AdalService
  ) { }

  ngOnInit(): void {
    this.adalService.init({
        "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db47",
        "clientId": "bed4cebd-57b0-46d0-a093-5b7c22150e27",
        "resource": "https://analysis.windows.net/powerbi/api",
        "redirectUri": environment.adalRedirectUri,
        "postLogoutRedirectUri": environment.adalRedirectUri
    });

    this.adalService.handleWindowCallback();
    this.isAuthenticated = this.adalService.userInfo.isAuthenticated;
    if (this.adalService.userInfo.isAuthenticated) {
      this.adalService.getUser()
        .subscribe(user => this.userName = user.userName,
                   error => console.error(error.message, error));
    }
    else {
      this.adalService.login();
    }
  }
}
