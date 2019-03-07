import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, Subject } from 'rxjs';
import { TrackResult } from './models/TrackResult.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';



@Injectable({
  providedIn: 'root'
})

export class SearchService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  private searchInput = new Subject<string>();
  searchInput$ = this.searchInput.asObservable();

  updateSearchInput(data: string) {
    this.searchInput.next(data);
  }

  getSearch(term: string): Observable<TrackResult[]> {
    console.log(term);
    const _sanitizer = this.sanitizer;
    return new Observable<TrackResult[]>((observer) => {
      this.http.get(window.location.origin + ':3000/api/search/' + term).subscribe(
      data => {
        const results: TrackResult[] = new Array(0);
        console.log(data);
        Object.keys(data).forEach(function(track) {
          results.push(new TrackResult(_sanitizer).deserialize(data[track]));
          observer.next(results);
        });
      }
    );
    });
  }
}
