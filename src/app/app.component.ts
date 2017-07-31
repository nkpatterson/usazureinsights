import { Component, OnInit } from '@angular/core';
import { AdalService } from 'ng2-adal/core';

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
        "clientId": "89e85e24-f329-462a-adb7-5417f45b371a",
        "resource": "https://analysis.windows.net/powerbi/api"
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
