import { Injectable } from '@angular/core';
import { Report, AccountFilterConfig } from './report';

import { AuthService } from '../profile/auth.service';

@Injectable()
export class ReportService {

  reportsList: Report[] = [
    new Report("U.S. Azure Insights Dashboard - FY19", "87733f5b-ba27-4e64-a74a-2f31f922d621", "93dacd31-caed-458a-8c63-6fe12375911f", null, "mailto:nipatter@microsoft.com?subject=U.S. Azure Insights Dashboard Access&body=Please add me :)", rpt => {
      rpt.getPages().then(pages => {
        pages.forEach(page => {
          if (page.displayName == "My Engagements") {
            page.getFilters().then(filters => {
              filters.forEach(filter => {
                var anyFilter = filter as any;
                if (anyFilter.target.column == "Engagement Team Alias") {
                  anyFilter.operator = "In";
                  anyFilter.values = [this.getAlias()];
                }
              });
              page.setFilters(filters);
            });
          }
        });
      });
    }),
    new Report("U.S. Azure Insights Dashboard - FY18", "934c259c-235f-48b9-abd2-be79ea1ba5b3", "93dacd31-caed-458a-8c63-6fe12375911f", null, "mailto:nipatter@microsoft.com?subject=U.S. Azure Insights Dashboard Access&body=Please add me :)"),
    // new Report("Azure Monthly MSDN Benefits Usage", "b5d62a77-965f-4839-996d-95f9e0379b91", "93dacd31-caed-458a-8c63-6fe12375911f", new AccountFilterConfig("DimAccounts", "AccountName", "DimAccounts", "TPID")),
    new Report("ISV Co-Sell Dashboard", "c7d1b088-c2e2-4b2b-b163-cfe0a682ec21", "be4af5f0-770e-4e90-b7f0-9e04c864d7a8", new AccountFilterConfig("Opportunity", "TP Account Name", "Opportunity", "TPID", true), 'http://aka.ms/ocpinsights', rpt => {
      rpt.getPages().then(pages => {
        pages.forEach(page => {
          if (page.displayName == "Partner IP Co-Sell Summary") {
            rpt.setPage(page.name);
          }
        });
      });
    }),
    new Report("Azure DevOps Customers", "fd96f234-94ac-402d-81e7-0a8f13a13c0d", "cd2504a9-b748-4087-b3f9-60c46b6f1782", new AccountFilterConfig("Company", "CompanyName", "TPID", "TPID", false), 'https://aka.ms/AZPipelines2ACR')
  ];

  constructor(private authSvc: AuthService) { }

  getReports(): Report[] {
    return this.reportsList;
  }

  getReport(id: string): Report {
    return this.reportsList.find(rpt => rpt.id == id);
  }

  getAlias(): string {
    return this.authSvc.getUser().displayableId.split("@")[0].toUpperCase();
  }
}