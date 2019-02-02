import { Component, OnInit } from '@angular/core';
import { FormService } from '../form.service';

@Component({
  selector: 'app-signin-start-form',
  templateUrl: './signin-start-form.component.html',
  styleUrls: ['./signin-start-form.component.scss']
})
export class SigninStartFormComponent implements OnInit {

  constructor(private formService: FormService) { }

  ngOnInit() {
  }

  nextPage() {
    this.formService.toPage(1);
  }

}
