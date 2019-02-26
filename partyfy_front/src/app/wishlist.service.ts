import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private code: String;
  private showCode = new Subject<boolean>();
  public showCode$ = this.showCode.asObservable();

  constructor(private http: HttpClient) {
  }

  public setCode(value: String) {
    this.code = value;
    this.showCode.next(false);
  }

  public getCode(): String {
    return this.code;
  }

  public wishSong(uri: string) {
    console.log(uri);
    this.http.put('http://localhost:3000/api/wish/', '{"code": "' + this.code + '","uri" : "' + uri + '"}', httpOptions).subscribe(
      data => console.log(data)
    );
  }
}
