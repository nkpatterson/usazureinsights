import { Injectable } from '@angular/core';
import { Report, AccountFilterConfig } from './report';
import * as pbi from 'powerbi-client';
import * as models from 'powerbi-models';

const reportsList: Report[] = [
    new Report("Southwest EOU Insights Report", "08eae7c5-0a77-4c8b-a2e1-82238ee10682", "93dacd31-caed-458a-8c63-6fe12375911f"),
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
    new Report("Azure Monthly Benefits Usage", "688bf26e-d8bf-4ab3-8f31-ed94383ddc87", "93dacd31-caed-458a-8c63-6fe12375911f", new AccountFilterConfig("DimAccounts", "AccountName"))
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