import { Injectable } from '@angular/core';
import { UserInformation } from './models/Userinformation.model';
import { Party } from './models/Party.model';
import { Subject, ReplaySubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

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

  public setUserId(userId: String) {
    console.log(userId);
    this.partydata.setUserId(userId);
  }

  constructor(private http: HttpClient) {
    this.partydata = new Party();
   }

   completeUserSignUp(): Observable<any> {
     console.log(this.partydata.toJsonObject());
    return new Observable<any>((observer) =>
      this.http.post('http://' + window.location.origin + ':3000/api/signup/', this.partydata.toJsonObject(), httpOptions).subscribe(
        data => {
          console.log(data);
          observer.next(data);
        }
      )
    );
   }

}
