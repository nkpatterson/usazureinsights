import { Injectable } from '@angular/core';
import { Report, AccountFilterConfig } from './report';
import * as pbi from 'powerbi-client';
import * as models from 'powerbi-models';

const reportsList: Report[] = [
  new Report("U.S. Azure Insights Dashboard", "934c259c-235f-48b9-abd2-be79ea1ba5b3", "93dacd31-caed-458a-8c63-6fe12375911f", null, "mailto:nipatter@microsoft.com?subject=U.S. Azure Insights Dashboard Access&body=Please add me :)"),
  new Report("Azure Monthly MSDN Benefits Usage", "b5d62a77-965f-4839-996d-95f9e0379b91", "93dacd31-caed-458a-8c63-6fe12375911f", new AccountFilterConfig("DimAccounts", "AccountName", "DimAccounts", "TPID")),
  new Report("ISV Co-Sell Dashboard", "c7d1b088-c2e2-4b2b-b163-cfe0a682ec21", "be4af5f0-770e-4e90-b7f0-9e04c864d7a8", new AccountFilterConfig("Opportunity", "TP Account Name", "Opportunity", "TPID", true), 'http://aka.ms/ocpinsights', rpt => {
    rpt.getPages().then(pages => {
      pages.forEach(page => {
        if (page.displayName == "Partner IP Co-Sell Summary") {
          rpt.setPage(page.name);
        }
      });
    });
  })
];

@Injectable()
export class ReportService {
  constructor() { }

  getReports(): Report[] {
    return reportsList;
  }

  getReport(id: string): Report {
    return reportsList.find(rpt => rpt.id == id);
  }
}