import { Deserializable } from './Deserializable.model';

export class Device implements Deserializable {
    devicename: string;
    deviceid: string;

    constructor() {}

    deserialize(input: any) {
        this.devicename = input.deviceName;
        this.deviceid = input.deviceId;
        return this;
    }
}
