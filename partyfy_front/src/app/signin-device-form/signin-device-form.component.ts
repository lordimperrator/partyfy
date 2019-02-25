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
  selectedDevice: String;
  constructor(private formService: FormService) {
    this.selectedDevice = formService.getDeviceId();
    console.log(this.selectedDevice);
    this.formService.userinfo$.subscribe(
      (data) => {
        console.log(data);
        this.devices = data.devices;
      }
    );
    if (formService.getDeviceId() != null) {
      this.selectedDevice = formService.getDeviceId();
    } else {
      this.selectedDevice = this.devices[0].deviceid;
    }
    formService.setDeviceId(this.selectedDevice);
  }

  ngOnInit() {}

  previousPage() {
    this.formService.toPage(0);
  }

  nextPage() {
    this.formService.toPage(2);
  }

  setDeviceId(input: String) {
    this.formService.setDeviceId(input);
  }
}
