import { Component, OnInit } from '@angular/core';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { AdalService } from 'ng2-adal/dist/core';
import * as pbi from 'powerbi-client';
import * as models from 'powerbi-models';
import * as qs from 'qs';

import { ReportService } from './report.service';
import { Report } from './report';

declare var appInsights: any;
declare var jQuery: any;

const CANNOT_USE_TPIDS_AND_ACCOUNT_NAMES = "You cannot use both TPIDs and Account Names. Please choose one format or the other.";

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
  private accountsModalErrorMsg: string;
  private showNoAccessHelper: boolean;
  private cookieExpiry: Date;

  constructor(
    private adalService: AdalService,
    private cookies: CookieService,
    private reportSvc: ReportService
  ) { 
    let savedAccounts = this.cookies.get(this.cookieKey);
    if (savedAccounts) {
      this.accountList = savedAccounts;
    }

    let today = new Date();
    this.cookieExpiry = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

    let q = qs.parse(window.location.search.replace("?", ""));
    this.reportsList = reportSvc.getReports();
    this.selectedReport = q.reportId ? reportSvc.getReport(q.reportId) : this.reportsList[0];

    this.initNoAccessHelper();
}

  ngOnInit() {
    this.adalService.acquireToken(this.pbiResource)
      .subscribe(token => {
        this.token = token;
        this.embedReport();
      });
  }

  initNoAccessHelper() {
    let dismissed = this.cookies.get(`sweouinsights.noaccess.${this.selectedReport.id}`);
    this.showNoAccessHelper = this.selectedReport.noAccessActionLink != null && dismissed == null;
  }

  embedReport() {
    this.initNoAccessHelper();

    let startEmbed = new Date();
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
    this.report = window.powerbi.embed(this.container, <any>config) as pbi.Report;

    let me = this;

    this.report.off("loaded");
    this.report.on("loaded", function() {
      let endEmbed = new Date();
      appInsights.trackEvent("ReportLoaded", 
        {ReportName: me.selectedReport.name},
        {ReportLoadTime: (endEmbed.getTime() - startEmbed.getTime()) / 1000});

      me.report.getFilters().then(filters => {
        me.defaultFilters = filters;
      });

      if (me.accountList) {
        me.setAccounts();
      }

      if (me.selectedReport.callback)
        me.selectedReport.callback(me.report);
    });

    this.report.off("pageChanged");
    this.report.on("pageChanged", function(event: any){
      let page = event.detail.newPage;
      appInsights.trackEvent("PageChanged", 
        {NewPage: page.displayName});
    });

    this.report.on("error", function(evt) {
      let err = evt.detail as models.IError;
      appInsights.trackException(new Error(err.message), "Report.OnError", 
        {DetailedMessage: err.detailedMessage, ErrorCode: err.errorCode});

      if (err && err.errorCode == "TokenExpired") {
        appInsights.trackEvent("TokenExpired");
        me.adalService.acquireToken(me.pbiResource)
          .subscribe(token => {
            me.token = token;
            me.embedReport();
          });
      }
    });
  }

  getReport(): pbi.Report {
    return window.powerbi.get(this.container) as pbi.Report;
  }

  getTopParentFilter(values: string[]): models.IBasicFilter {
    let filterConfig = this.selectedReport.accountFilterConfig;
    return this.getFilter(filterConfig.nameTable, filterConfig.nameColumn, values);
  }

  getTpidFilter(values: number[]): models.IBasicFilter {
    let filterConfig = this.selectedReport.accountFilterConfig;
    let arr = filterConfig.isTpidString ? values.map(String) : values;

    return this.getFilter(filterConfig.tpidTable, filterConfig.tpidColumn, arr);
  }

  getFilter(table: string, column: string, values): models.IBasicFilter {
    const filter: models.IBasicFilter = {
      $schema: "http://powerbi.com/product/schema#basic",
      filterType: models.FilterType.Basic,
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
    let accountNames = [];
    let tpids = [];

    if (this.accountList != null && this.accountList != "") {
      accounts = this.accountList.split('\n').filter(n => n != "").map(val => val.trim());
      this.cookies.put(this.cookieKey, this.accountList, {
        expires: this.cookieExpiry
      });
      appInsights.trackEvent("SetAccounts", 
        null,
        {NumberOfAccounts: accounts.length});
    }

    accounts.forEach(s => {
      if (/^\d+$/g.test(s)) {
        tpids.push(parseInt(s));
      } else {
        accountNames.push(s);
      }
    });

    if (accountNames.length > 0 && tpids.length > 0) {
      this.accountsModalErrorMsg = CANNOT_USE_TPIDS_AND_ACCOUNT_NAMES;
      return;
    } else {
      this.accountsModalErrorMsg = null;
    }

    let tpFilter = this.getTopParentFilter(accountNames);
    let tpidFilter = this.getTpidFilter(tpids);
    let filters = [];

    if (accountNames.length > 0)
      filters.push(tpFilter);
    else if (tpids.length > 0)
      filters.push(tpidFilter);

    this.getReport().setFilters(filters)
      .then(() => {
        jQuery("#accountsModal").modal('hide');
      });
  }

  dismissNoAccessHelper() {
    this.cookies.put(`sweouinsights.noaccess.${this.selectedReport.id}`, 'dismissed', { expires: this.cookieExpiry });
    appInsights.trackEvent("NoAccessHelperDismissed", {ReportName: this.selectedReport.name});
  }

  clearAccounts() {
    this.accountList = null;
    this.cookies.remove(this.cookieKey);
    this.getReport().setFilters(this.defaultFilters);
    appInsights.trackEvent("ClearAccounts");
  }

  fullscreen() {
    this.getReport().fullscreen();
    appInsights.trackEvent("FullScreen");
  }

  saveReportAs() {
    let report = this.getReport();
    let reportName = `${this.selectedReport.name} - Copy`;
    report.saveAs({
      name: reportName
    }).then(() => {
      // todo: show notification that report was saved with link to PBI
      console.log("Done saving!");
    });
  }

  changeReport(id: string) {
    let q = qs.stringify({reportId: id});
    let url = `/?${q}`;
    appInsights.trackEvent("ChangeReport", {ReportId: id});
    window.location.href = url;
  }
}
