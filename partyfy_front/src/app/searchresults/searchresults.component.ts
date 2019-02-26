import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../search.service';
import { observable, Observable } from 'rxjs';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { WishlistService } from '../wishlist.service';
export interface Result {
  item: Object;
}

@Component({
  selector: 'app-searchresults',
  templateUrl: './searchresults.component.html',
  styleUrls: ['./searchresults.component.scss']
})
export class SearchresultsComponent implements OnInit {
  searchterm: '';
  test = '';
  result$: Observable<any>;
  constructor(private searchService: SearchService, private _scrollToService: ScrollToService, private wishlistservice: WishlistService) {
    searchService.searchInput$.subscribe(
      data => {
        this.searchInputValue(data); }
    );
  }

  searchInputValue(input: string) {
    if (input !== '') {
      this.search(input);
    }
  }

  triggerScrollTo() {
    const config: ScrollToConfigOptions = {
      target: 'result',
      duration: 1000
    };
    this._scrollToService.scrollTo(config);
  }

  ngOnInit() {
  }

  search(term) {
    this.triggerScrollTo();
    this.result$ = this.searchService.getSearch(term);
  }

  wish(value) {
    this.wishlistservice.wishSong(value);
  }

}
