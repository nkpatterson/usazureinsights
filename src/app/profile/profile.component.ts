import { Component, OnInit } from '@angular/core';
import { AdalService } from 'ng2-adal/core';

@Component({
  selector: '[profile]',
  moduleId: "__moduleName",
  templateUrl: 'profile.component.html',
  styles: ['.gravatarLink { padding: 7px 0; } .gravatarLink img { border-radius: 50%; width: 36px; height: 36px; }']
})
export class ProfileComponent implements OnInit {
  public userName: string;
  public isAuthenticated: boolean;

  constructor(
    private adalService: AdalService
  ) { }

  public ngOnInit(): void {
    this.isAuthenticated = this.adalService.userInfo.isAuthenticated;
    this.adalService.getUser()
      .subscribe(user => this.userName = user.userName,
                  error => console.error(error.message, error));
  }

  public login(): void {
    this.adalService.login();
  }

  public logOut(): void {
    this.adalService.logOut();
  }
}
