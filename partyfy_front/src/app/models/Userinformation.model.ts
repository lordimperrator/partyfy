import {Deserializable} from './Deserializable.model';
import { Device } from './Device.model';



export class UserInformation implements Deserializable {
    username: string;
    devices: Array<Device>;
    constructor() {}

    deserialize(input: any) {
        this.devices = new Array<Device>();
        this.username = input.username;
        input.devices.forEach(element => {
            this.devices.push(new Device().deserialize(element));
        });
        return this;
    }
}
