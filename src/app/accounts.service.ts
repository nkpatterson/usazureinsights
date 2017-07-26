import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AccountsService {

  constructor(
    private http: Http
  ) { }

  public getMasterAccountsList(): Observable<string[]> {
    return this.http.get('/assets/master-accounts-list.txt')
      .map(response => response.text().split('\n'));
  }
}
