import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReportComponent } from './report.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [ReportComponent],
  declarations: [ReportComponent],
  bootstrap: [ReportComponent]
})
export class ReportModule { }
