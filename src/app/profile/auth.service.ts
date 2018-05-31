import { Injectable } from '@angular/core';
import * as Msal from 'msal';
import { environment } from '../../environments/environment';

declare var appInsights: any;

const PBI_RESOURCE = "https://analysis.windows.net/powerbi/api/";
const HACK_TO_SUPPORT_PBI = "Renew token Expected state:";
const STATE_ACQUIRE_TOKEN = "msal.state.acquireToken";

@Injectable()
export class AuthService {

  private userAgentApp: Msal.UserAgentApplication;
  private appConfig = {
    clientID: '89e85e24-f329-462a-adb7-5417f45b371a',
    authority: "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47",
    graphScopes: [PBI_RESOURCE + "Report.Read.All", PBI_RESOURCE + "Group.Read.All"]
  };

  init(): void {
    console.log("AuthService.init()");
    var logger = new Msal.Logger(this.loggerCallback, { level: Msal.LogLevel.Verbose });

    this.userAgentApp = new Msal.UserAgentApplication(
      this.appConfig.clientID, 
      this.appConfig.authority, 
      this.authCallback, { 
        cacheLocation: 'localStorage', 
        redirectUri: environment.adalRedirectUri,
        logger: logger,
        navigateToLoginRequestUrl: false
      });

    var user = this.userAgentApp.getUser();
    if (!user) {
      if (!this.userAgentApp.isCallback(window.location.hash)) {
        this.userAgentApp.loginRedirect(this.appConfig.graphScopes);
      }
    } else {
      appInsights.setAuthenticatedUserContext(user.displayableId, user.displayableId);
    }
  }

  loggerCallback(logLevel, message, piiLoggingEnabled) {
    console.log(message);
    const index = message.indexOf(HACK_TO_SUPPORT_PBI);
    if (index > -1) {
        const neededState = message.substring(index + 28);
        window.localStorage.setItem(STATE_ACQUIRE_TOKEN, neededState.trim());
    }
  }

  getUser(): Msal.User {
    console.log("AuthService.getUser()");
    return this.userAgentApp.getUser();
  }

  getPbiToken(refresh: boolean = false): Promise<string> {
    console.log(`AuthService.getPbiToken(${refresh})`);
    if (!this.userAgentApp)
      this.init();

    if (!this.getUser())
      return new Promise<string>(null);

    let pbiScopes = this.appConfig.graphScopes;//.slice(1);
    if (refresh) {
      console.log("acquireTokenRedirect()");
      this.userAgentApp.acquireTokenRedirect(pbiScopes);
      return new Promise<string>(null);
    } else {
      console.log("acquireTokenSilent()");
      return this.userAgentApp.acquireTokenSilent(pbiScopes);
    }
  }

  login(): void {
    this.userAgentApp.loginRedirect(this.appConfig.graphScopes);
  }

  logout(): void {
    this.userAgentApp.logout();
  }

  private authCallback(errorDesc, token, error, tokenType): void {
    if (token) {
      console.log("Success: " + token);
    }
    else {
        console.log(error + ":" + errorDesc);
    }
  }
}
