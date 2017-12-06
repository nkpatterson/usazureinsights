import * as pbi from 'powerbi-client';

export class Report {
    public name: string;
    public id: string;
    public groupId: string;
    public accountFilterConfig: AccountFilterConfig;
    public noAccessActionLink: string;
    public callback: (report: pbi.Report) => void;

    constructor (name: string, 
        id: string, 
        groupId: string = null, 
        accountFilterConfig: AccountFilterConfig = null,
        noAccessActionLink: string = null,
        callback: (report: pbi.Report) => void = null) {
            this.name = name;
            this.id = id;
            this.groupId = groupId;
            this.accountFilterConfig = accountFilterConfig != null ? accountFilterConfig : new AccountFilterConfig();
            this.noAccessActionLink = noAccessActionLink;
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
    public nameTable: string;
    public nameColumn: string;
    public tpidTable: string;
    public tpidColumn: string;
    public isTpidString: boolean;

    constructor (nameTable: string = "Account Information", nameColumn: string = "Top Parent",
                 tpidTable: string = "Account Information", tpidColumn: string = "TPID", isTpidString: boolean = false) {
        this.nameTable = nameTable;
        this.nameColumn = nameColumn;
        this.tpidTable = tpidTable;
        this.tpidColumn = tpidColumn;
        this.isTpidString = isTpidString;
    }
}