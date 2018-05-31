import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Gravatar } from 'ng2-gravatar-directive';

import { AuthService } from './auth.service';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [
    BrowserModule
  ],
  exports: [
    ProfileComponent
  ],
  declarations: [
    Gravatar,
    ProfileComponent
  ],
  providers: [
    AuthService
  ],
  bootstrap: [ProfileComponent]
})
export class ProfileModule { }
