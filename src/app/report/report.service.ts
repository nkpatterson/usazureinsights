import { Injectable } from '@angular/core';
import { Report, AccountFilterConfig } from './report';
import * as pbi from 'powerbi-client';
import * as models from 'powerbi-models';

const reportsList: Report[] = [
    new Report("Southwest EOU Insights Report", "08eae7c5-0a77-4c8b-a2e1-82238ee10682", "93dacd31-caed-458a-8c63-6fe12375911f", null, "mailto:nipatter@microsoft.com?subject=SW EOU Insights Dashboard Access&body=Please add me :)"),
    // new Report("Azure Health Report Summary", "e83f256b-7f03-4a83-b173-018d9fc928c9", null, null, rpt => {
    //   rpt.getPages().then(pages => {
    //     pages.forEach(pg => {
    //       pg.getFilters().then(filters => {
    //         filters.forEach(f => {
    //           let basic = f as models.IBasicFilter;
    //           if (basic) {
    //             switch (basic.target.table) {
    //               case "Segment":
    //                 basic.operator = "All";
    //                 break;
    //             }
    //           }
    //         });

    //         pg.setFilters(filters);
    //       });
    //     });
    //   });
    // }),
    new Report("Azure Monthly MSDN Benefits Usage", "8345d23f-c787-489e-8d01-a0b930659b01", "93dacd31-caed-458a-8c63-6fe12375911f", new AccountFilterConfig("DimAccounts", "AccountName")),
    new Report("ISV Co-Sell Dashboard", "1d9ee913-1bc1-4936-83b2-ccfb81e169eb", "be4af5f0-770e-4e90-b7f0-9e04c864d7a8", new AccountFilterConfig("Account", "TP Account Name"), 'https://msit.powerbi.com/groups/me/dashboards/bfca9bc4-61be-4ca7-9ad6-5e532b70a786/requestAccess')
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