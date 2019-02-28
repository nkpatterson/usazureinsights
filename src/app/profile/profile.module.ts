import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GravatarModule } from  'ngx-gravatar';

import { AuthService } from './auth.service';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [
    BrowserModule,
    GravatarModule
  ],
  exports: [
    ProfileComponent
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [
    AuthService
  ],
  bootstrap: [ProfileComponent]
})
export class ProfileModule { }
