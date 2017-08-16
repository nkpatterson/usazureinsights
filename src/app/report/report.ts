import * as pbi from 'powerbi-client';

export class Report {
    public name: string;
    public id: string;
    public groupId: string;
    public accountFilterConfig: AccountFilterConfig;
    public callback: (report: pbi.Report) => void;

    constructor (name: string, 
        id: string, 
        groupId: string = null, 
        accountFilterConfig: AccountFilterConfig = null,
        callback: (report: pbi.Report) => void = null) {
            this.name = name;
            this.id = id;
            this.groupId = groupId;
            this.accountFilterConfig = accountFilterConfig != null ? accountFilterConfig : new AccountFilterConfig();
            this.callback = callback;
    }

    getEmbedUrl(): string {
        let url = `https://msit.powerbi.com/reportEmbed?reportId=${this.id}`;
        if (this.groupId) 
            url += `&groupId=${this.groupId}`;

        return url;
    }
}

export class AccountFilterConfig {
    public table: string;
    public column: string;

    constructor (table: string = "Account Information", column: string = "Top Parent") {
        this.table = table;
        this.column = column;
    }
}