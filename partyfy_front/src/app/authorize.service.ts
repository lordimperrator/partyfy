import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getUserInformation(userauthtoken: string): Observable<String> {
    console.log(userauthtoken);
    const _sanitizer = this.sanitizer;
    return new Observable<String>((observer) => {
      this.http.post('http://localhost:3000/api/authorize/', '{"token": "' + userauthtoken + '"}', httpOptions).subscribe(
        data => {
          observer.next(data.toString());
        }
      );
    });
  }

}
