import { Injectable } from '@angular/core';
import { UserInformation } from './models/Userinformation.model';
import { Party } from './models/Party.model';
import { Subject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private userinfo = new ReplaySubject<UserInformation>();
  private partydata: Party;
  private pagenumber = new Subject<number>();
  userinfo$ = this.userinfo.asObservable();
  pagenumber$ = this.pagenumber.asObservable();

  public toPage(number: number) {
    this.pagenumber.next(number);
  }

  public setUserinfo(userinfo: UserInformation) {
    console.log('...');
    this.userinfo.next(userinfo);
  }

  constructor() { }
}
