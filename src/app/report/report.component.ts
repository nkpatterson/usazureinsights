import { Component, OnInit } from '@angular/core';
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

  constructor(
    private adalService: AdalService,
    private accounts: AccountsService
  ) { }

  ngOnInit() {
    this.adalService.acquireToken("https://analysis.windows.net/powerbi/api")
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
      embedUrl: 'https://msit.powerbi.com/reportEmbed?reportId=944f602c-2788-439a-9df1-776a043dae68',
      id: '944f602c-2788-439a-9df1-776a043dae68',
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
      me.accounts.getMasterAccountsList()
        .subscribe(accounts => {
          me.defaultAccounts = accounts;
          me.getReport().setFilters(me.getDefaultFilters());
        });
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
      accounts = this.accountList.split('\n');
    }

    let fyFilter = this.getFyFilter();
    let tpFilter = this.getTopParentFilter(accounts);

    this.getReport().setFilters([tpFilter, fyFilter])
      .then(() => {
        jQuery("#accountsModal").modal('hide');
      });
  }

  clearFilter() {
    this.accountList = null;
    this.getReport().setFilters(this.getDefaultFilters());
  }

  fullscreen() {
    this.getReport().fullscreen();
  }
}
