import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'angular2-cookie/core';

import { ReportComponent } from './report.component';
import { ReportService } from './report.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [ReportComponent],
  declarations: [ReportComponent],
  providers: [CookieService, ReportService],
  bootstrap: [ReportComponent]
})
export class ReportModule { }
