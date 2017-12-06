import { Injectable } from '@angular/core';
import { Report, AccountFilterConfig } from './report';
import * as pbi from 'powerbi-client';
import * as models from 'powerbi-models';

const reportsList: Report[] = [
    new Report("U.S. Azure Insights Dashboard", "934c259c-235f-48b9-abd2-be79ea1ba5b3", "93dacd31-caed-458a-8c63-6fe12375911f", null, "mailto:nipatter@microsoft.com?subject=U.S. Azure Insights Dashboard Access&body=Please add me :)"),
    new Report("Azure Monthly MSDN Benefits Usage", "8345d23f-c787-489e-8d01-a0b930659b01", "93dacd31-caed-458a-8c63-6fe12375911f", new AccountFilterConfig("DimAccounts", "AccountName", "DimAccounts", "TPID")),
    new Report("ISV Co-Sell Dashboard", "1d9ee913-1bc1-4936-83b2-ccfb81e169eb", "be4af5f0-770e-4e90-b7f0-9e04c864d7a8", new AccountFilterConfig("Account", "TP Account Name", "Partner Sales Connect Deals", "TPID", true), 'http://aka.ms/ocpinsights')
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