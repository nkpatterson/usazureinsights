import { Component, OnInit } from '@angular/core';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import * as pbi from 'powerbi-client';
import * as models from 'powerbi-models';
import * as qs from 'qs';
import { AdalService } from 'ng2-adal/core';

import { ReportService } from './report.service';
import { Report } from './report';

declare var jQuery: any;

@Component({
  selector: 'my-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  private token: string;
  private accountList: string;
  private report: pbi.Report;
  private container: any;
  private defaultFilters: models.IFilter[];
  private cookieKey: string = "sweouinsights.accountList";
  private pbiResource: string = "https://analysis.windows.net/powerbi/api";
  private reportsList: Report[];
  private selectedReport: Report;

  constructor(
    private adalService: AdalService,
    private cookies: CookieService,
    private reportSvc: ReportService
  ) { 
    let savedAccounts = this.cookies.get(this.cookieKey);
    if (savedAccounts) {
      this.accountList = savedAccounts;
    }

    let q = qs.parse(window.location.search.replace("?", ""));
    this.reportsList = reportSvc.getReports();
    this.selectedReport = q.reportId ? reportSvc.getReport(q.reportId) : this.reportsList[0];
  }

  ngOnInit() {
    this.adalService.acquireToken(this.pbiResource)
      .subscribe(token => {
        this.token = token;
        this.embedReport();
      });
  }

  embedReport() {
    let config = {
      type: 'report',
      tokenType: pbi.models.TokenType.Aad,
      accessToken: this.token,
      embedUrl: this.selectedReport.getEmbedUrl(),
      id: this.selectedReport.id,
      permissions: pbi.models.Permissions.Read,
      settings: {
          filterPaneEnabled: true,
          navContentPaneEnabled: true
      }
    };

    this.container = jQuery("#report-container")[0];
    this.report = window.powerbi.embed(this.container, config) as pbi.Report;

    let me = this;
    this.report.off("loaded");
    this.report.on("loaded", function() {
      me.report.getFilters().then(filters => {
        me.defaultFilters = filters;
      });

      if (me.accountList) {
        me.setAccounts();
      }

      if (me.selectedReport.callback)
        me.selectedReport.callback(me.report);
    });
    this.report.on("error", function(evt) {
      console.error(evt);
      let err = evt.detail as models.IError;
      if (err && err.errorCode == "TokenExpired") {
        me.adalService.acquireToken(me.pbiResource)
          .subscribe(token => {
            me.token = token;
            me.embedReport();
          })
      }
    });
  }

  getReport(): pbi.Report {
    return window.powerbi.get(this.container) as pbi.Report;
  }

  getTopParentFilter(values): models.IBasicFilter {
    return this.getFilter("Account Information", "Top Parent", values);
  }

  getFyFilter(): models.IBasicFilter {
    return this.getFilter("Calendar", "Fiscal Year", ["FY17", "FY18"]);
  }

  getFilter(table: string, column: string, values): models.IBasicFilter {
    const filter: models.IBasicFilter = {
      $schema: "http://powerbi.com/product/schema#basic",
      target: {
        table: table,
        column: column
      },
      operator: "In",
      values: values
    };

    return filter;
  }

  setAccounts() {
    let accounts = [];

    if (this.accountList != null && this.accountList != "") {
      accounts = this.accountList.split('\n').filter(n => n != "").map(val => val.trim());
      let today = new Date();
      let expires = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
      this.cookies.put(this.cookieKey, this.accountList, {
        expires: expires
      });
    }

    let fyFilter = this.getFyFilter();
    let tpFilter = this.getTopParentFilter(accounts);

    this.getReport().setFilters([tpFilter, fyFilter])
      .then(() => {
        jQuery("#accountsModal").modal('hide');
      });
  }

  clearAccounts() {
    this.accountList = null;
    this.cookies.remove(this.cookieKey);
    this.getReport().setFilters(this.defaultFilters);
  }

  fullscreen() {
    this.getReport().fullscreen();
  }

  saveReportAs() {
    let report = this.getReport();
    report.saveAs({
      name: "Test save as"
    }).then(() => {
      // todo: show notification that report was saved with link to PBI
    });
  }

  changeReport(id: string) {
    let q = qs.stringify({reportId: id});
    let url = `/?${q}`;
    window.location.href = url;
  }
}
