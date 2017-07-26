import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AdalService } from 'ng2-adal/core';

import { ProfileModule } from './profile/profile.module';
import { ReportModule } from './report/report.module';
import { AppComponent } from './app.component';

import { AccountsService } from './accounts.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ProfileModule,
    ReportModule
  ],
  providers: [
    AdalService,
    AccountsService
  ],
  exports: [
    ProfileModule,
    ReportModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
