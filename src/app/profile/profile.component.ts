import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

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
    private authService: AuthService
  ) { }

  public ngOnInit(): void {
    let user = this.authService.getUser();
    if (user) {
      this.userName = user.displayableId;
      this.isAuthenticated = true;
    }
  }

  public login(): void {
    this.authService.login();
  }

  public logOut(): void {
    this.authService.logout();
  }
}