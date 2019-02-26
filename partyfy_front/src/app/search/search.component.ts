import { Component, OnInit, Inject } from '@angular/core';
import { stringify } from '@angular/core/src/util';
import { SearchService } from '../search.service';
import { DOCUMENT } from '@angular/common';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public termSearch = '';
  private signinref = '';
  private showCode = false;
  constructor(private searchService: SearchService, @Inject(DOCUMENT) private document: any, private wishlistservice: WishlistService) {
  }

  search(searchterm: string) {
    if (searchterm) {
      this.termSearch = searchterm;
      this.searchService.updateSearchInput(searchterm);
    }
  }

  signin(): void {
    this.document.location.href = this.signinref;
  }

  code(): void {
    this.showCode = true;
    this.wishlistservice.showCode$.subscribe(
      (data) => {
        this.showCode = data;
        console.log(data);
      }
    );
    console.log(this.showCode);
  }

  ngOnInit() {
    const scopes = 'user-read-private user-read-playback-state user-read-email user-read-birthdate playlist-modify-public' +
    ' playlist-modify-private user-modify-playback-state';
    this.signinref = 'https://accounts.spotify.com/authorize?response_type=code&client_id=a4053a069ef047e2a10c49745a218670'
    + (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent('http://localhost:4200/signin');
  }

}
