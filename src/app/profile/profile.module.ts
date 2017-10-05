import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AdalService } from 'ng2-adal/dist/core';
import { Gravatar } from 'ng2-gravatar-directive';

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
    AdalService
  ],
  bootstrap: [ProfileComponent]
})
export class ProfileModule { }
