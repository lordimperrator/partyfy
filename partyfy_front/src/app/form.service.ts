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

  public getPartyname(): String {
    return this.partydata.getName();
  }

  public setUserinfo(userinfo: UserInformation) {
    this.userinfo.next(userinfo);
  }

  public setPartyname(partyname: String) {
    this.partydata.setName(partyname);
  }

  public getDeviceId(): String {
    return this.partydata.getDeviceId();
  }

  public setDeviceId(deviceId: String) {
    console.log(deviceId);
    this.partydata.setDeviceId(deviceId);
  }

  public getPlaylistId(): String {
    return this.partydata.getPlaylistId();
  }

  public setPlaylistId(playlistId: String) {
    return this.partydata.setPlaylistId(playlistId);
  }

  constructor() {
    this.partydata = new Party();
   }
}
