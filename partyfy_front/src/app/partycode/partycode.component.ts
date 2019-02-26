import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-partycode',
  templateUrl: './partycode.component.html',
  styleUrls: ['./partycode.component.scss']
})
export class PartycodeComponent implements OnInit {
  public code = '';
  constructor(private wishlistservice: WishlistService) {
    if (this.wishlistservice.getCode() !== undefined) {
      this.code = this.wishlistservice.getCode() + '';
    } else {
      this.code = '';
    }
  }

  ngOnInit() {

  }

  setCode(value: String) {
    console.log(value);
    this.wishlistservice.setCode(value);
  }

}
