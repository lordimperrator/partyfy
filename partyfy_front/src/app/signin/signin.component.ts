import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeService } from '../authorize.service';
import { Observable } from 'rxjs';
import { FormService } from '../form.service';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  private code = '';
  public page = 0;
  constructor(private router: Router, private authService: AuthorizeService, private formService: FormService) { }
  username: String;
  ngOnInit() {
    this.code = this.router.url.toString();
    if (this.code.includes('?code')) {
      this.code = this.code.substring((this.code.indexOf('?') + 6), this.code.length);
      console.log('here');
      this.authService.getUserInformation(this.code).subscribe(
        (data) => {
          console.log('too');
          this.formService.setUserinfo(data);
          console.log(data.userId);
          this.formService.setUserId(data.userId);
          this.username = data.username;
        }
      );
      this.formService.pagenumber$.subscribe(
        (data) => {
          this.page = data;
        }
      );
    }
  }

}
