import { Component, OnInit } from '@angular/core';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import * as pbi from 'powerbi-client';
import * as models from 'powerbi-models';
import { AdalService} from 'ng2-adal/core';
declare var jQuery: any;

import { AccountsService } from '../accounts.service';

@Component({
  selector: 'my-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  private token: string;
  private accountList: string;
  private defaultAccounts: string[];
  private report: pbi.Report;
  private container: any;
  private cookieKey: string = "sweouinsights.accountList";

  constructor(
    private adalService: AdalService,
    private accounts: AccountsService,
    private cookies: CookieService
  ) { 
    let savedAccounts = this.cookies.get(this.cookieKey);
    if (savedAccounts) {
      console.log(savedAccounts);
      this.accountList = savedAccounts;
    }
  }

  ngOnInit() {
    this.accounts.getMasterAccountsList()
      .subscribe(accounts => {
        this.defaultAccounts = accounts;
        this.adalService.acquireToken("https://analysis.windows.net/powerbi/api")
          .subscribe(token => {
            this.token = token;
            this.embedReport();
          });
      });
  }

  embedReport() {
    let reportId = "51d6615c-911b-4b86-9db3-61e305ac7f70";
    let groupId = "93dacd31-caed-458a-8c63-6fe12375911f";
    let config = {
      type: 'report',
      tokenType: pbi.models.TokenType.Aad,
      accessToken: this.token,
      embedUrl: `https://msit.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}`,
      id: reportId,
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
      console.log("Report loaded");
      if (me.accountList) {
        me.setAccounts();
      }
      else {
        me.getReport().setFilters(me.getDefaultFilters());
      }
    });
    this.report.on("error", function(evt) {
      console.error(evt.detail);
    });
  }

  getReport(): pbi.Report {
    return window.powerbi.get(this.container) as pbi.Report;
  }

  getDefaultFilters() {
    let tpFilter = this.getTopParentFilter(this.defaultAccounts);
    let fyFilter = this.getFyFilter();

    return [tpFilter, fyFilter];
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
    let accounts = this.defaultAccounts;

    if (this.accountList != null && this.accountList != "") {
      accounts = this.accountList.split('\n').filter(n => n != "");
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
    this.getReport().setFilters(this.getDefaultFilters());
  }

  fullscreen() {
    this.getReport().fullscreen();
  }
}
