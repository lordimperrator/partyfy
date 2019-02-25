import { Component, OnInit } from '@angular/core';
import { FormService } from '../form.service';

@Component({
  selector: 'app-signin-start-form',
  templateUrl: './signin-start-form.component.html',
  styleUrls: ['./signin-start-form.component.scss']
})
export class SigninStartFormComponent implements OnInit {

  partyname: String;

  constructor(private formService: FormService) {
    if (this.formService.getPartyname() != null) {
      this.partyname = this.formService.getPartyname() + '';
    } else {
      this.partyname = ' ';
    }
   }

  error = false;
  ngOnInit() {
  }

  nextPage(partyname: String) {
    console.log(partyname);
    if (partyname.match('([A-Z]|[a-z]|[0-9])+')) {
      this.formService.setPartyname(partyname);
      this.formService.toPage(1);
    } else {
      this.error = true;
    }
  }

}
