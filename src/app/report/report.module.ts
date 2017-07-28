import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReportComponent } from './report.component';
import { CookieService } from 'angular2-cookie/core';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [ReportComponent],
  declarations: [ReportComponent],
  providers: [CookieService],
  bootstrap: [ReportComponent]
})
export class ReportModule { }
