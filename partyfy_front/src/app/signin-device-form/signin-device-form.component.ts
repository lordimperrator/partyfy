import { Component, OnInit } from '@angular/core';
import { FormService } from '../form.service';
import { Device } from '../models/Device.model';

@Component({
  selector: 'app-signin-device-form',
  templateUrl: './signin-device-form.component.html',
  styleUrls: ['./signin-device-form.component.scss']
})
export class SigninDeviceFormComponent implements OnInit {

  devices = new Array<Device>();
  selectedDevice = new String();
  constructor(private formService: FormService) {
    this.selectedDevice = formService.getDeviceId();
    console.log(this.selectedDevice);
    this.formService.userinfo$.subscribe(
      (data) => {
        console.log(data);
        this.devices = data.devices;
      }
    );
  }

  ngOnInit() {}

  previousPage() {
    this.formService.toPage(0);
  }

  saveValue(input: any) {
    console.log(input + "");
    this.formService.setDeviceId(input);
  }

}
