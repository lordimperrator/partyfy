import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeService } from '../authorize.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  private code = '';
  constructor(private router: Router, private authService: AuthorizeService) { }
  username: String;
  ngOnInit() {
    this.code = this.router.url.toString();
    if (this.code.includes('?code')) {
      this.code = this.code.substring((this.code.indexOf('?') + 6), this.code.length);
      console.log('here');
      this.authService.getUserInformation(this.code).subscribe(
        (data) => {
          console.log(data.username);
          console.log(data.devices);
          this.username = data.username;
        }
      );
    }
  }

}
