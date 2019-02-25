import { Component, OnInit } from '@angular/core';
import { FormService } from '../form.service';

@Component({
  selector: 'app-signin-final-form',
  templateUrl: './signin-final-form.component.html',
  styleUrls: ['./signin-final-form.component.scss']
})
export class SigninFinalFormComponent implements OnInit {
private code: string;
  constructor(private formservice: FormService) {
    formservice.completeUserSignUp().subscribe(
      (data) =>
        this.code = data.code
      );
  }

  ngOnInit() {
  }

}
